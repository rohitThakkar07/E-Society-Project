import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// ── Helper ────────────────────────────────────────────────────────────────────
const parseError = (err) => {
  const errData = err.response?.data;

  if (Array.isArray(errData?.errors) && errData.errors.length > 0) {
    return errData.errors.map((e) => e.msg).join(", ");
  }

  if (errData?.message) {
    const msg = errData.message;
    if (msg.includes("E11000") || msg.includes("duplicate key")) {
      if (msg.includes("email"))        return "This email is already registered.";
      if (msg.includes("mobileNumber")) return "This mobile number is already registered.";
      if (msg.includes("flat"))         return "This flat is already assigned to another resident.";
      return "A resident with these details already exists.";
    }
    return msg;
  }

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

      const dateStr = (v) => {
        if (v == null || v === "") return "";
        const d = new Date(v);
        return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
      };

      const hasChanged = Object.keys(formData).some((key) => {
        const cur = currentResident?.[key];
        const next = formData[key];
        if (key === "dateOfBirth") {
          return dateStr(cur) !== dateStr(next);
        }
        return String(cur ?? "").trim() !== String(next ?? "").trim();
      });

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

export const updateResidentStatus = createAsyncThunk(
  "resident/updateResidentStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/resident/update/${id}`, { status });
      toast.success(`Resident status set to ${status}`);
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
  residents:      [],
  singleResident: null,
  // FIX: Two separate loading flags so ProfilePage and RaiseComplaint
  // never block each other. profileLoading is ONLY for fetchResidentById.
  // loading is for list/create/update/delete operations.
  loading:        false,
  profileLoading: false,
  error:          null,
};

const residentSlice = createSlice({
  name: "resident",
  initialState,
  reducers: {
    clearSingleResident: (state) => { state.singleResident = null; },
    clearError:          (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // ── fetchResidents ──────────────────────────────────────────────────────
      .addCase(fetchResidents.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(fetchResidents.fulfilled, (state, action) => {
        state.loading   = false;
        state.residents = action.payload;
      })
      .addCase(fetchResidents.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── fetchResidentById ───────────────────────────────────────────────────
      // FIX: Uses profileLoading instead of loading so it never interferes
      // with complaint list loading or any other consumer of state.resident.loading
      .addCase(fetchResidentById.pending,   (state) => { state.profileLoading = true;  state.error = null; })
      .addCase(fetchResidentById.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.singleResident = action.payload;
      })
      .addCase(fetchResidentById.rejected,  (state, action) => {
        state.profileLoading = false;
        state.error          = action.payload;
      })

      // ── createResident ──────────────────────────────────────────────────────
      .addCase(createResident.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(createResident.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.residents.unshift(action.payload);
      })
      .addCase(createResident.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── updateResident ──────────────────────────────────────────────────────
      .addCase(updateResident.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(updateResident.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.residents.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) state.residents[index] = action.payload;
        state.singleResident = action.payload;
      })
      .addCase(updateResident.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── deleteResident ──────────────────────────────────────────────────────
      .addCase(deleteResident.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(deleteResident.fulfilled, (state, action) => {
        state.loading     = false;
        state.residents   = state.residents.filter((r) => r._id !== action.payload);
      })
      .addCase(deleteResident.rejected,  (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── updateResidentStatus ───────────────────────────────────────────────
      .addCase(updateResidentStatus.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(updateResidentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.residents.findIndex((r) => r._id === action.payload.id);
        if (index !== -1) state.residents[index].status = action.payload.status;
      })
      .addCase(updateResidentStatus.rejected,  (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSingleResident, clearError } = residentSlice.actions;
export default residentSlice.reducer;