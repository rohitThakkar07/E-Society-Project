import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// 🔥 Thunks

export const fetchComplaints = createAsyncThunk(
  "complaint/fetchComplaints",
  async () => {
    const res = await API.get("/complaint/list");
    return res.data.data;
  }
);

export const fetchComplaintById = createAsyncThunk(
  "complaint/fetchComplaintById",
  async (id) => {
    const res = await API.get(`/complaint/${id}`);
    return res.data.data;
  }
);

export const createComplaint = createAsyncThunk(
  "complaint/createComplaint",
  async (data) => {
    const res = await API.post("/complaint/create", data);
    toast.success("Complaint created!");
    return res.data.data;
  }
);

export const updateComplaint = createAsyncThunk(
  "complaint/updateComplaint",
  async ({ id, data }) => {
    const res = await API.put(`/complaint/update/${id}`, data);
    toast.success("Complaint updated!");
    return res.data.data;
  }
);

export const deleteComplaint = createAsyncThunk(
  "complaint/deleteComplaint",
  async (id) => {
    await API.delete(`/complaint/delete/${id}`);
    toast.success("Complaint deleted!");
    return id;
  }
);

export const updateComplaintStatus = createAsyncThunk(
  "complaint/updateComplaintStatus",
  async ({ id, status }) => {
    await API.put(`/complaint/update/${id}`, { status });
    return { id, status };
  }
);

// 🔥 Initial State
const initialState = {
  complaints: [],
  singleComplaint: null,
  loading: false,
};

// 🔥 Slice
const complaintSlice = createSlice({
  name: "complaint",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(fetchComplaints.fulfilled, (state, action) => {
      state.loading = false;
      state.complaints = action.payload;
    });

    builder.addCase(fetchComplaintById.fulfilled, (state, action) => {
      state.loading = false;
      state.singleComplaint = action.payload;
    });

    builder.addCase(createComplaint.fulfilled, (state, action) => {
      state.loading = false;
      state.complaints.unshift(action.payload);
    });

    builder.addCase(updateComplaint.fulfilled, (state, action) => {
      state.loading = false;

      const index = state.complaints.findIndex(
        (c) => c._id === action.payload._id
      );

      if (index !== -1) {
        state.complaints[index] = action.payload;
      }

      state.singleComplaint = action.payload;
    });

    builder.addCase(deleteComplaint.fulfilled, (state, action) => {
      state.loading = false;
      state.complaints = state.complaints.filter(
        (c) => c._id !== action.payload
      );
    });

    builder.addCase(updateComplaintStatus.fulfilled, (state, action) => {
      const index = state.complaints.findIndex(
        (c) => c._id === action.payload.id
      );

      if (index !== -1) {
        state.complaints[index].status = action.payload.status;
      }
    });

    // 🔥 loading handler
    builder.addMatcher(
      (action) => action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
      }
    );

    builder.addMatcher(
      (action) => action.type.endsWith("/rejected"),
      (state) => {
        state.loading = false;
      }
    );
  },
});

export default complaintSlice.reducer;