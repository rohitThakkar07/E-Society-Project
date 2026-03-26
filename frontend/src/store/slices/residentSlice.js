// store/slices/residentSlice.js (Minimal Version)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// Async Thunks
export const fetchResidents = createAsyncThunk(
  "resident/fetchResidents",
  async () => {
    const response = await API.get("/resident/list");
    return response.data.data;
  }
);

export const fetchResidentById = createAsyncThunk(
  "resident/fetchResidentById",
  async (id) => {
    const response = await API.get(`/resident/${id}`);
    console.log(response);
    return response.data.data;
  }
);

export const createResident = createAsyncThunk(
  "resident/createResident",
  async (formData) => {
    const response = await API.post("/resident/create", formData);
    toast.success("Resident created successfully!");
    return response.data.data;
  }
);

export const updateResident = createAsyncThunk(
  "resident/updateResident",
  async ({ id, formData }, { getState }) => {
    const state = getState();
    const currentResident = state.resident.singleResident;

    const hasChanged = Object.keys(formData).some(
      (key) => String(currentResident[key] || "") !== String(formData[key] || "")
    );

    if (!hasChanged) {
      toast.warning("No changes made");
      throw new Error("No changes made");
    }

    const response = await API.put(`/resident/update/${id}`, formData);
    toast.success("Resident updated successfully!");
    return response.data.data;
  }
);

export const deleteResident = createAsyncThunk(
  "resident/deleteResident",
  async (id) => {
    await API.delete(`/resident/delete/${id}`);
    toast.success("Resident deleted successfully!");
    return id;
  }
);

// Initial State
const initialState = {
  residents: [],
  singleResident: null,
  loading: false,
};

// Slice
const residentSlice = createSlice({
  name: "resident",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch All Residents
    builder.addCase(fetchResidents.fulfilled, (state, action) => {
      state.loading = false;
      state.residents = action.payload;
    });

    // Fetch Single Resident
    builder.addCase(fetchResidentById.fulfilled, (state, action) => {
      state.loading = false;
      state.singleResident = action.payload;
    });

    // Create Resident
    builder.addCase(createResident.fulfilled, (state, action) => {
      state.loading = false;
      state.residents.push(action.payload);
    });

    // Update Resident
    builder.addCase(updateResident.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.residents.findIndex(r => r._id === action.payload._id);
      if (index !== -1) {
        state.residents[index] = action.payload;
      }
      state.singleResident = action.payload;
    });

    // Delete Resident
    builder.addCase(deleteResident.fulfilled, (state, action) => {
      state.loading = false;
      state.residents = state.residents.filter(r => r._id !== action.payload);
    });
  },
});

export default residentSlice.reducer;