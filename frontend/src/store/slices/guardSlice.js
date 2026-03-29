import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// ── Helper: Parse any backend error into a human-readable message ─────────────
const parseError = (err) => {
  const errData = err.response?.data;

  // 1. express-validator array
  if (Array.isArray(errData?.errors) && errData.errors.length > 0) {
    return errData.errors.map((e) => e.msg).join(", ");
  }

  // 2. Backend message — translate MongoDB duplicate key errors
  if (errData?.message) {
    const msg = errData.message;
    if (msg.includes("E11000") || msg.includes("duplicate key")) {
      if (msg.includes("email"))        return "A guard with this email already exists.";
      if (msg.includes("mobileNumber")) return "A guard with this mobile number already exists.";
      if (msg.includes("guardId"))      return "This Guard ID is already in use.";
      return "A guard with these details already exists.";
    }
    return msg;
  }

  // 3. Network / unknown
  if (!err.response) return "Network error. Please check your connection.";
  return "Something went wrong. Please try again.";
};

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchGuards = createAsyncThunk(
  "guard/fetchGuards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/guard/list");
      const payload = response?.data?.data ?? response?.data ?? response;
      return Array.isArray(payload) ? payload : [];
    } catch (err) {
      const msg = parseError(err);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const fetchGuardById = createAsyncThunk(
  "guard/fetchGuardById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/guard/${id}`);
      return response?.data?.data ?? response?.data ?? response;
    } catch (err) {
      const msg = parseError(err);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const createGuard = createAsyncThunk(
  "guard/createGuard",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post("/guard/create", formData);
      toast.success("Guard created successfully!");
      return response?.data?.data ?? response?.data ?? response;
    } catch (err) {
      const msg = parseError(err);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateGuard = createAsyncThunk(
  "guard/updateGuard",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/guard/update/${id}`, formData);
      toast.success("Guard updated successfully!");
      return response?.data?.data ?? response?.data ?? response;
    } catch (err) {
      const msg = parseError(err);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteGuard = createAsyncThunk(
  "guard/deleteGuard",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/guard/delete/${id}`);
      toast.success("Guard deleted successfully!");
      return id;
    } catch (err) {
      const msg = parseError(err);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateGuardStatus = createAsyncThunk(
  "guard/updateGuardStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await API.put(`/guard/update/${id}`, { status });
      toast.success("Guard status updated.");
      return { id, status };
    } catch (err) {
      const msg = parseError(err);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  guards: [],
  singleGuard: null,
  loading: false,
  error: null,
};

const guardSlice = createSlice({
  name: "guard",
  initialState,
  reducers: {
    clearSingleGuard: (state) => { state.singleGuard = null; },
    clearError:       (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending  = (state)         => { state.loading = true;  state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      // fetchGuards
      .addCase(fetchGuards.pending,   pending)
      .addCase(fetchGuards.fulfilled, (state, action) => {
        state.loading = false;
        state.guards = action.payload;
      })
      .addCase(fetchGuards.rejected,  rejected)

      // fetchGuardById
      .addCase(fetchGuardById.pending,   pending)
      .addCase(fetchGuardById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleGuard = action.payload;
      })
      .addCase(fetchGuardById.rejected,  rejected)

      // createGuard
      .addCase(createGuard.pending,   pending)
      .addCase(createGuard.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.guards.unshift(action.payload);
      })
      .addCase(createGuard.rejected,  rejected)

      // updateGuard
      .addCase(updateGuard.pending,   pending)
      .addCase(updateGuard.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.guards.findIndex((g) => g._id === action.payload._id);
        if (index !== -1) state.guards[index] = action.payload;
        state.singleGuard = action.payload;
      })
      .addCase(updateGuard.rejected,  rejected)

      // deleteGuard
      .addCase(deleteGuard.pending,   pending)
      .addCase(deleteGuard.fulfilled, (state, action) => {
        state.loading = false;
        state.guards = state.guards.filter((g) => g._id !== action.payload);
      })
      .addCase(deleteGuard.rejected,  rejected)

      // updateGuardStatus
      .addCase(updateGuardStatus.pending,   pending)
      .addCase(updateGuardStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.guards.findIndex((g) => g._id === action.payload.id);
        if (index !== -1) state.guards[index].status = action.payload.status;
      })
      .addCase(updateGuardStatus.rejected,  rejected);
  },
});

export const { clearSingleGuard, clearError } = guardSlice.actions;
export default guardSlice.reducer;