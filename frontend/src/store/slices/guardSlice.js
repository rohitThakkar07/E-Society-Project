// store/slices/guardSlice.js (Minimal Version)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// Async Thunks
export const fetchGuards = createAsyncThunk(
  "guard/fetchGuards",
  async () => {
    const response = await API.get("/guard/list");
    return response.data.data;
  }
);

export const fetchGuardById = createAsyncThunk(
  "guard/fetchGuardById",
  async (id) => {
    const response = await API.get(`/guard/${id}`);
    return response.data.data;
  }
);

export const createGuard = createAsyncThunk(
  "guard/createGuard",
  async (formData) => {
    const response = await API.post("/guard/create", formData);
    toast.success("Guard created successfully!");
    return response.data.data;
  }
);

export const updateGuard = createAsyncThunk(
  "guard/updateGuard",
  async ({ id, formData }) => {
    const response = await API.put(`/guard/update/${id}`, formData);
    toast.success("Guard updated successfully!");
    return response.data.data;
  }
);

export const deleteGuard = createAsyncThunk(
  "guard/deleteGuard",
  async (id) => {
    await API.delete(`/guard/delete/${id}`);
    toast.success("Guard deleted successfully!");
    return id;
  }
);

export const updateGuardStatus = createAsyncThunk(
  "guard/updateGuardStatus",
  async ({ id, status }) => {
    const response = await API.put(`/guard/update/${id}`, { status });
    return { id, status };
  }
);

// Initial State
const initialState = {
  guards: [],
  singleGuard: null,
  loading: false,
};

// Slice
const guardSlice = createSlice({
  name: "guard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch All Guards
    builder.addCase(fetchGuards.fulfilled, (state, action) => {
      state.loading = false;
      state.guards = action.payload;
    });

    // Fetch Single Guard
    builder.addCase(fetchGuardById.fulfilled, (state, action) => {
      state.loading = false;
      state.singleGuard = action.payload;
    });

    // Create Guard
    builder.addCase(createGuard.fulfilled, (state, action) => {
      state.loading = false;
      state.guards.push(action.payload);
    });

    // Update Guard
    builder.addCase(updateGuard.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.guards.findIndex(g => g._id === action.payload._id);
      if (index !== -1) {
        state.guards[index] = action.payload;
      }
      state.singleGuard = action.payload;
    });

    // Delete Guard
    builder.addCase(deleteGuard.fulfilled, (state, action) => {
      state.loading = false;
      state.guards = state.guards.filter(g => g._id !== action.payload);
    });

    // Update Guard Status
    builder.addCase(updateGuardStatus.fulfilled, (state, action) => {
      const index = state.guards.findIndex(g => g._id === action.payload.id);
      if (index !== -1) {
        state.guards[index].status = action.payload.status;
      }
    });
  },
});

export default guardSlice.reducer;