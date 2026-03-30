import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// Helper for error extracting
const getErrorMessage = (error) => {
  return error.response?.data?.message || error.message || "Something went wrong";
};

// 🔥 Thunks with Error Handling
export const fetchComplaints = createAsyncThunk(
  "complaint/fetchComplaints",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/complaint/list");
      return res.data.data;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchComplaintById = createAsyncThunk(
  "complaint/fetchComplaintById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/complaint/${id}`);
      return res.data.data;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createComplaint = createAsyncThunk(
  "complaint/createComplaint",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/complaint/create", data);
      toast.success("Complaint created successfully!");
      return res.data.data;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateComplaint = createAsyncThunk(
  "complaint/updateComplaint",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/complaint/update/${id}`, data);
      toast.success("Complaint updated successfully!");
      return res.data.data;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteComplaint = createAsyncThunk(
  "complaint/deleteComplaint",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/complaint/delete/${id}`);
      toast.success("Complaint deleted!");
      return id;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateComplaintStatus = createAsyncThunk(
  "complaint/updateComplaintStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await API.put(`/complaint/update/${id}`, { status });
      toast.info(`Status updated to ${status}`);
      return { id, status };
    } catch (error) {
      toast.error(getErrorMessage(error));
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// 🔥 Initial State
const initialState = {
  complaints: [],
  singleComplaint: null,
  loading: false,
  error: null,
};

// 🔥 Slice
const complaintSlice = createSlice({
  name: "complaint",
  initialState,
  reducers: {
    clearComplaintState: (state) => {
      state.singleComplaint = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload;
      })
      .addCase(fetchComplaintById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleComplaint = action.payload;
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints.unshift(action.payload);
      })
      .addCase(updateComplaint.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.complaints.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.complaints[index] = action.payload;
        state.singleComplaint = action.payload;
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = state.complaints.filter((c) => c._id !== action.payload);
      })
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.complaints.findIndex((c) => c._id === action.payload.id);
        if (index !== -1) state.complaints[index].status = action.payload.status;
      });

    // 🔥 Global Matchers for Loading and Error State
    builder.addMatcher(
      (action) => action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action) => action.type.endsWith("/rejected"),
      (state, action) => {
        state.loading = false;
        state.error = action.payload; // Stores the error message from rejectWithValue
      }
    );
  },
});

export const { clearComplaintState } = complaintSlice.actions;
export default complaintSlice.reducer;