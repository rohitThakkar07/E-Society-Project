// store/slices/visitorSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// 🔥 Async Thunks

// Get all visitors
export const fetchVisitors = createAsyncThunk(
  "visitor/fetchVisitors",
  async () => {
    const response = await API.get("/visitor/list");
    return response.data.data;
  }
);

// Get single visitor
export const fetchVisitorById = createAsyncThunk(
  "visitor/fetchVisitorById",
  async (id) => {
    const response = await API.get(`/visitor/${id}`);
    return response.data.data;
  }
);

// Create visitor
export const createVisitor = createAsyncThunk(
  "visitor/createVisitor",
  async (data) => {
    const response = await API.post("/visitor/create", data);
    toast.success("Visitor created successfully!");
    return response.data.data;
  }
);

// Update visitor
export const updateVisitor = createAsyncThunk(
  "visitor/updateVisitor",
  async ({ id, data }) => {
    const response = await API.put(`/visitor/update/${id}`, data);
    toast.success("Visitor updated successfully!");
    return response.data.data;
  }
);

// Delete visitor
export const deleteVisitor = createAsyncThunk(
  "visitor/deleteVisitor",
  async (id) => {
    await API.delete(`/visitor/delete/${id}`);
    toast.success("Visitor deleted successfully!");
    return id;
  }
);

// Update visitor status (Inside → Exited)
export const updateVisitorStatus = createAsyncThunk(
  "visitor/updateVisitorStatus",
  async ({ id, status }) => {
    const response = await API.put(`/visitor/update/${id}`, { status });
    return { id, status };
  }
);

// 🧠 Initial State
const initialState = {
  visitors: [],
  singleVisitor: null,
  loading: false,
};

// 🔥 Slice
const visitorSlice = createSlice({
  name: "visitor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    // 👉 Fetch All
    builder.addCase(fetchVisitors.fulfilled, (state, action) => {
      state.loading = false;
      state.visitors = action.payload;
    });

    // 👉 Fetch One
    builder.addCase(fetchVisitorById.fulfilled, (state, action) => {
      state.loading = false;
      state.singleVisitor = action.payload;
    });

    // 👉 Create
    builder.addCase(createVisitor.fulfilled, (state, action) => {
      state.loading = false;
      state.visitors.unshift(action.payload);
    });

    // 👉 Update
    builder.addCase(updateVisitor.fulfilled, (state, action) => {
      state.loading = false;

      const index = state.visitors.findIndex(
        (v) => v._id === action.payload._id
      );

      if (index !== -1) {
        state.visitors[index] = action.payload;
      }

      state.singleVisitor = action.payload;
    });

    // 👉 Delete
    builder.addCase(deleteVisitor.fulfilled, (state, action) => {
      state.loading = false;
      state.visitors = state.visitors.filter(
        (v) => v._id !== action.payload
      );
    });

    // 👉 Update Status
    builder.addCase(updateVisitorStatus.fulfilled, (state, action) => {
      const index = state.visitors.findIndex(
        (v) => v._id === action.payload.id
      );

      if (index !== -1) {
        state.visitors[index].status = action.payload.status;
      }
    });
  },
});

export default visitorSlice.reducer;