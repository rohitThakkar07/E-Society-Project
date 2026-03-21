import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

export const fetchPolls = createAsyncThunk("poll/fetchPolls", async (params = {}) => {
  const q = new URLSearchParams(params).toString();
  const res = await API.get(`/poll/list${q ? `?${q}` : ""}`);
  return res.data.data;
});

export const fetchPollById = createAsyncThunk("poll/fetchPollById", async (id) => {
  const res = await API.get(`/poll/${id}`);
  return res.data.data;
});

export const createPoll = createAsyncThunk("poll/createPoll", async (data, { rejectWithValue }) => {
  try {
    const res = await API.post("/poll/create", data);
    toast.success("Poll created!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed");
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

export const closePoll = createAsyncThunk("poll/closePoll", async (id) => {
  const res = await API.put(`/poll/${id}/close`);
  toast.success("Poll closed.");
  return res.data.data;
});

export const deletePoll = createAsyncThunk("poll/deletePoll", async (id) => {
  await API.delete(`/poll/delete/${id}`);
  toast.success("Poll deleted.");
  return id;
});

const initialState = { list: [], singlePoll: null, loading: false, error: null };

const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: { clearSinglePoll: (s) => { s.singlePoll = null; } },
  extraReducers: (builder) => {
    builder.addCase(fetchPolls.fulfilled,    (s, a) => { s.loading = false; s.list = a.payload; });
    builder.addCase(fetchPollById.fulfilled, (s, a) => { s.loading = false; s.singlePoll = a.payload; });
    builder.addCase(createPoll.fulfilled,    (s, a) => { s.loading = false; s.list.unshift(a.payload); });
    builder.addCase(castVote.fulfilled,      (s, a) => { s.loading = false; s.singlePoll = a.payload; const i = s.list.findIndex(x => x._id === a.payload._id); if (i !== -1) s.list[i] = a.payload; });
    builder.addCase(closePoll.fulfilled,     (s, a) => { s.loading = false; const i = s.list.findIndex(x => x._id === a.payload._id); if (i !== -1) s.list[i] = a.payload; s.singlePoll = a.payload; });
    builder.addCase(deletePoll.fulfilled,    (s, a) => { s.loading = false; s.list = s.list.filter(x => x._id !== a.payload); });
    builder.addMatcher(
      (a) => a.type.startsWith("poll/") && a.type.endsWith("/pending"),
      (s) => { s.loading = true; s.error = null; }
    );
    builder.addMatcher(
      (a) => a.type.startsWith("poll/") && a.type.endsWith("/rejected"),
      (s) => { s.loading = false; }
    );
  },
});

export const { clearSinglePoll } = pollSlice.actions;
export default pollSlice.reducer;