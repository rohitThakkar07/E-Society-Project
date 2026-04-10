import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// --- Thunks ---
export const fetchPolls = createAsyncThunk("poll/fetchPolls", async (params = {}, { rejectWithValue }) => {
  try {
    const q = new URLSearchParams(params).toString();
    const res = await API.get(`/poll/list${q ? `?${q}` : ""}`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed");
  }
});

export const fetchPollById = createAsyncThunk("poll/fetchPollById", async (id, { rejectWithValue }) => {
  try {
    const res = await API.get(`/poll/${id}`);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed");
  }
});

export const createPoll = createAsyncThunk("poll/createPoll", async (data, { rejectWithValue }) => {
  try {
    const res = await API.post("/poll/create", data);
    toast.success("Poll created!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to create poll");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const castVote = createAsyncThunk("poll/castVote", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await API.post(`/poll/${id}/vote`, data);
    toast.success(res.data.message || "Vote recorded!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Vote failed");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const closePoll = createAsyncThunk("poll/closePoll", async (id, { rejectWithValue }) => {
  try {
    const res = await API.put(`/poll/${id}/close`);
    toast.success("Poll closed.");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deletePoll = createAsyncThunk("poll/deletePoll", async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/poll/delete/${id}`);
    toast.success("Poll deleted.");
    return id;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed");
    return rejectWithValue(err.response?.data?.message);
  }
});

// --- Slice ---
const pollSlice = createSlice({
  name: "poll",
  initialState: {
    list: [],
    singlePoll: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSinglePoll: (state) => { state.singlePoll = null; },
    clearError:      (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder

      // ── fetchPolls ────────────────────────────────────────────────────────
      .addCase(fetchPolls.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPolls.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      // ── fetchPollById ─────────────────────────────────────────────────────
      .addCase(fetchPollById.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(fetchPollById.fulfilled, (state, action) => { state.loading = false; state.singlePoll = action.payload; })
      .addCase(fetchPollById.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      // ── createPoll ────────────────────────────────────────────────────────
      .addCase(createPoll.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createPoll.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      // ── castVote ──────────────────────────────────────────────────────────
      .addCase(castVote.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(castVote.fulfilled, (state, action) => {
        state.loading = false;
        state.singlePoll = action.payload;
        const i = state.list.findIndex(p => p._id === action.payload._id);
        if (i !== -1) state.list[i] = action.payload;
      })
      .addCase(castVote.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      // ── closePoll ─────────────────────────────────────────────────────────
      .addCase(closePoll.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(closePoll.fulfilled, (state, action) => {
        state.loading = false;
        state.singlePoll = action.payload;
        const i = state.list.findIndex(p => p._id === action.payload._id);
        if (i !== -1) state.list[i] = action.payload;
      })
      .addCase(closePoll.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })

      // ── deletePoll ────────────────────────────────────────────────────────
      .addCase(deletePoll.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(deletePoll.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(p => p._id !== action.payload);
      })
      .addCase(deletePoll.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearSinglePoll, clearError } = pollSlice.actions;
export default pollSlice.reducer;