import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// ── Helper: Parse any backend error into a human-readable message ─────────────
const parseError = (err) => {
  const errData = err.response?.data;

  // 1. express-validator array: [{ msg: "..." }, ...]
  if (Array.isArray(errData?.errors) && errData.errors.length > 0) {
    return errData.errors.map((e) => e.msg).join(", ");
  }

  // 2. Plain backend message string
  if (errData?.message) {
    const msg = errData.message;

    // 3. MongoDB duplicate key error → user-friendly translation
    if (msg.includes("E11000") || msg.includes("duplicate key")) {
      if (msg.includes("email"))        return "This email is already registered. Please use a different email.";
      if (msg.includes("mobileNumber")) return "This mobile number is already registered.";
      if (msg.includes("flat"))         return "This flat is already assigned to another resident.";
      return "A resident with these details already exists.";
    }

    return msg;
  }

  // 4. Network / unknown error
  if (!err.response) return "Network error. Please check your connection.";

  return "Something went wrong. Please try again.";
};

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchResidents = createAsyncThunk(
  "resident/fetchResidents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/resident/list");
      const payload = response?.data?.data ?? response?.data ?? response;
      return Array.isArray(payload) ? payload : [];
    } catch (err) {
      const msg = parseError(err);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const fetchResidentById = createAsyncThunk(
  "resident/fetchResidentById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/resident/${id}`);
      return response?.data?.data ?? response?.data ?? response;
    } catch (err) {
      const msg = parseError(err);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const createResident = createAsyncThunk(
  "resident/createResident",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post("/resident/create", formData);
      toast.success("Resident created successfully!");
      return response?.data?.data ?? response?.data ?? response;
    } catch (err) {
      const msg = parseError(err);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateResident = createAsyncThunk(
  "resident/updateResident",
  async ({ id, formData }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentResident = state.resident.singleResident;

      const hasChanged = Object.keys(formData).some(
        (key) => String(currentResident?.[key] || "") !== String(formData[key] || "")
      );

      if (!hasChanged) {
        toast.warning("No changes detected.");
        return rejectWithValue("No changes made");
      }

      const response = await API.put(`/resident/update/${id}`, formData);
      toast.success("Resident updated successfully!");
      return response?.data?.data ?? response?.data ?? response;
    } catch (err) {
      const msg = parseError(err);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteResident = createAsyncThunk(
  "resident/deleteResident",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/resident/delete/${id}`);
      toast.success("Resident deleted successfully!");
      return id;
    } catch (err) {
      const msg = parseError(err);
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  residents: [],
  singleResident: null,
  loading: false,
  error: null,
};

const residentSlice = createSlice({
  name: "resident",
  initialState,
  reducers: {
    clearSingleResident: (state) => { state.singleResident = null; },
    clearError:          (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending  = (state)         => { state.loading = true;  state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      // fetchResidents
      .addCase(fetchResidents.pending,   pending)
      .addCase(fetchResidents.fulfilled, (state, action) => { state.loading = false; state.residents = action.payload; })
      .addCase(fetchResidents.rejected,  rejected)

      // fetchResidentById
      .addCase(fetchResidentById.pending,   pending)
      .addCase(fetchResidentById.fulfilled, (state, action) => { state.loading = false; state.singleResident = action.payload; })
      .addCase(fetchResidentById.rejected,  rejected)

      // createResident
      .addCase(createResident.pending,   pending)
      .addCase(createResident.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.residents.unshift(action.payload);
      })
      .addCase(createResident.rejected,  rejected)

      // updateResident
      .addCase(updateResident.pending,   pending)
      .addCase(updateResident.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.residents.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) state.residents[index] = action.payload;
        state.singleResident = action.payload;
      })
      .addCase(updateResident.rejected,  rejected)

      // deleteResident
      .addCase(deleteResident.pending,   pending)
      .addCase(deleteResident.fulfilled, (state, action) => {
        state.loading = false;
        state.residents = state.residents.filter((r) => r._id !== action.payload);
      })
      .addCase(deleteResident.rejected,  rejected);
  },
});

export const { clearSingleResident, clearError } = residentSlice.actions;
export default residentSlice.reducer;