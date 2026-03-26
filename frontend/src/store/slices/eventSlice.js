import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// ─── Thunks ───────────────────────────────────────────────

export const fetchEvents = createAsyncThunk(
  "event/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/event/list");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch events");
    }
  }
);

export const fetchEventById = createAsyncThunk(
  "event/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/event/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch event");
    }
  }
);

export const createEvent = createAsyncThunk(
  "event/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.post("/event/create", formData);
      toast.success("Event created successfully!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create event");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateEvent = createAsyncThunk(
  "event/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/event/update/${id}`, formData);
      toast.success("Event updated successfully!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update event");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "event/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/event/delete/${id}`);
      toast.success("Event deleted successfully!");
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete event");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ─── Initial State ────────────────────────────────────────

const initialState = {
  events: [],
  singleEvent: null,
  loading: false,
  error: null,
};

// ─── Slice ────────────────────────────────────────────────

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    clearSingleEvent(state) {
      state.singleEvent = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {

    // ── Fetch All ──
    builder.addCase(fetchEvents.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      state.loading = false;
      state.events = action.payload;
    });
    builder.addCase(fetchEvents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ── Fetch By ID ──
    builder.addCase(fetchEventById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchEventById.fulfilled, (state, action) => {
      state.loading = false;
      state.singleEvent = action.payload;
    });
    builder.addCase(fetchEventById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ── Create ──
    builder.addCase(createEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createEvent.fulfilled, (state, action) => {
      state.loading = false;
      state.events.unshift(action.payload);
    });
    builder.addCase(createEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ── Update ──
    builder.addCase(updateEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateEvent.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.events.findIndex((e) => e._id === action.payload._id);
      if (index !== -1) state.events[index] = action.payload;
      state.singleEvent = action.payload;
    });
    builder.addCase(updateEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ── Delete ──
    builder.addCase(deleteEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteEvent.fulfilled, (state, action) => {
      state.loading = false;
      state.events = state.events.filter((e) => e._id !== action.payload);
      if (state.singleEvent?._id === action.payload) state.singleEvent = null;
    });
    builder.addCase(deleteEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

  },
});

export const { clearSingleEvent, clearError } = eventSlice.actions;
export default eventSlice.reducer;