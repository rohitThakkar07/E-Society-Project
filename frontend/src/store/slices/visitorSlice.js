// src/store/slices/visitorSlice.js
// REPLACE your existing visitorSlice.js with this file
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// ─── Helper ──────────────────────────────────────────────────────────────────
const parseError = (err) => {
  const d = err.response?.data;
  if (Array.isArray(d?.errors)) return d.errors.map((e) => e.msg).join(", ");
  if (d?.message) return d.message;
  if (!err.response) return "Network error.";
  return "Something went wrong.";
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchVisitors = createAsyncThunk(
  "visitor/fetchVisitors",
  async (params = {}, { rejectWithValue }) => {
    try {
      const qs = new URLSearchParams(params).toString();
      const response = await API.get(`/visitor/list${qs ? `?${qs}` : ""}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(parseError(err));
    }
  }
);

export const fetchVisitorById = createAsyncThunk(
  "visitor/fetchVisitorById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/visitor/${id}`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(parseError(err));
    }
  }
);

export const fetchTodayStats = createAsyncThunk(
  "visitor/fetchTodayStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/visitor/stats/today");
      return response.data.data;
    } catch (err) {
      return rejectWithValue(parseError(err));
    }
  }
);

export const fetchMyVisitors = createAsyncThunk(
  "visitor/fetchMyVisitors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/visitor/my");
      return response.data.data;
    } catch (err) {
      return rejectWithValue(parseError(err));
    }
  }
);

export const createVisitor = createAsyncThunk(
  "visitor/createVisitor",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.post("/visitor/create", data);
      toast.success("Visitor entry created! OTP sent to resident.");
      return response.data.data;
    } catch (err) {
      const msg = parseError(err);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateVisitor = createAsyncThunk(
  "visitor/updateVisitor",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/visitor/update/${id}`, data);
      toast.success("Visitor updated.");
      return response.data.data;
    } catch (err) {
      const msg = parseError(err);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteVisitor = createAsyncThunk(
  "visitor/deleteVisitor",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/visitor/delete/${id}`);
      toast.success("Visitor deleted.");
      return id;
    } catch (err) {
      const msg = parseError(err);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const markExit = createAsyncThunk(
  "visitor/markExit",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.put(`/visitor/exit/${id}`);
      toast.success("Visitor exit logged.");
      return response.data.data;
    } catch (err) {
      const msg = parseError(err);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const denyVisitor = createAsyncThunk(
  "visitor/denyVisitor",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const data = typeof payload === "string" ? { id: payload } : payload;
      const { id, notes } = data;
      if (!id) {
        throw new Error("Visitor ID is required to deny visitor.");
      }
      const response = await API.put(`/visitor/deny/${id}`, { notes });
      toast.success("Visitor denied.");
      return response.data.data;
    } catch (err) {
      const msg = parseError(err);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const approveVisitor = createAsyncThunk(
  "visitor/approveVisitor",
  async (payload, { rejectWithValue }) => {
    try {
      const data = typeof payload === "string" ? { id: payload } : payload;
      const { id, otp } = data;
      
      let response;
      if (otp) {
        response = await API.post(`/visitor/verify-otp/${id}`, { otp });
      } else {
        response = await API.put(`/visitor/allow-entry/${id}`);
      }
      
      toast.success("Visitor entry allowed.");
      return response.data.data;
    } catch (err) {
      const msg = parseError(err);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateVisitorStatus = createAsyncThunk(
  "visitor/updateVisitorStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await API.put(`/visitor/update/${id}`, { status });
      return { id, status };
    } catch (err) {
      return rejectWithValue(parseError(err));
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  visitors:      [],
  myVisitors:    [],
  singleVisitor: null,
  todayStats:    {},
  loading:       false,
  error:         null,
};

const visitorSlice = createSlice({
  name: "visitor",
  initialState,
  reducers: {
    clearSingleVisitor: (state) => { state.singleVisitor = null; },
    clearError:         (state) => { state.error = null; },
  },
  extraReducers: (builder) => {

    // Fetch All
    builder.addCase(fetchVisitors.fulfilled, (state, action) => {
      state.loading  = false;
      state.visitors = action.payload || [];
    });

    // Fetch By ID
    builder.addCase(fetchVisitorById.fulfilled, (state, action) => {
      state.loading       = false;
      state.singleVisitor = action.payload;
    });

    // Today Stats
    builder.addCase(fetchTodayStats.fulfilled, (state, action) => {
      state.todayStats = action.payload || {};
    });

    // My Visitors (resident view)
    builder.addCase(fetchMyVisitors.fulfilled, (state, action) => {
      state.loading    = false;
      state.myVisitors = action.payload || [];
    });

    // Create
    builder.addCase(createVisitor.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) state.visitors.unshift(action.payload);
    });

    // Update
    builder.addCase(updateVisitor.fulfilled, (state, action) => {
      state.loading = false;
      const idx = state.visitors.findIndex((v) => v._id === action.payload?._id);
      if (idx !== -1) state.visitors[idx] = action.payload;
      state.singleVisitor = action.payload;
    });

    // Delete
    builder.addCase(deleteVisitor.fulfilled, (state, action) => {
      state.loading  = false;
      state.visitors = state.visitors.filter((v) => v._id !== action.payload);
      if (state.singleVisitor?._id === action.payload) state.singleVisitor = null;
    });

    // Exit
    builder.addCase(markExit.fulfilled, (state, action) => {
      state.loading = false;
      const idx = state.visitors.findIndex((v) => v._id === action.payload?._id);
      if (idx !== -1) state.visitors[idx] = action.payload;
      if (state.singleVisitor?._id === action.payload?._id) state.singleVisitor = action.payload;
    });

    // Deny
    builder.addCase(denyVisitor.fulfilled, (state, action) => {
      state.loading = false;
      const idx = state.visitors.findIndex((v) => v._id === action.payload?._id);
      if (idx !== -1) state.visitors[idx] = action.payload;
      state.singleVisitor = action.payload;
    });

    // Approve
    builder.addCase(approveVisitor.fulfilled, (state, action) => {
      state.loading = false;
      const idx = state.visitors.findIndex((v) => v._id === action.payload?._id);
      if (idx !== -1) state.visitors[idx] = action.payload;
      state.singleVisitor = action.payload;
    });

    // Update Status (inline)
    builder.addCase(updateVisitorStatus.fulfilled, (state, action) => {
      const idx = state.visitors.findIndex((v) => v._id === action.payload.id);
      if (idx !== -1) state.visitors[idx].status = action.payload.status;
    });

    // Global pending
    builder.addMatcher(
      (action) => action.type.startsWith("visitor/") && action.type.endsWith("/pending"),
      (state) => { state.loading = true; state.error = null; }
    );

    // Global rejected
    builder.addMatcher(
      (action) => action.type.startsWith("visitor/") && action.type.endsWith("/rejected"),
      (state, action) => { state.loading = false; state.error = action.payload; }
    );
  },
});

export const { clearSingleVisitor, clearError } = visitorSlice.actions;
export default visitorSlice.reducer;