// // store/slices/visitorSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";
// import API from "../../service/api";

// // 🔥 Async Thunks

// // Get all visitors
// export const fetchVisitors = createAsyncThunk(
//   "visitor/fetchVisitors",
//   async () => {
//     const response = await API.get("/visitor/list");
//     return response.data.data;
//   }
// );

// // Get single visitor
// export const fetchVisitorById = createAsyncThunk(
//   "visitor/fetchVisitorById",
//   async (id) => {
//     const response = await API.get(`/visitor/${id}`);
//     return response.data.data;
//   }
// );

// // Create visitor
// export const createVisitor = createAsyncThunk(
//   "visitor/createVisitor",
//   async (data) => {
//     const response = await API.post("/visitor/create", data);
//     toast.success("Visitor created successfully!");
//     return response.data.data;
//   }
// );

// // Update visitor
// export const updateVisitor = createAsyncThunk(
//   "visitor/updateVisitor",
//   async ({ id, data }) => {
//     const response = await API.put(`/visitor/update/${id}`, data);
//     toast.success("Visitor updated successfully!");
//     return response.data.data;
//   }
// );

// // Delete visitor
// export const deleteVisitor = createAsyncThunk(
//   "visitor/deleteVisitor",
//   async (id) => {
//     await API.delete(`/visitor/delete/${id}`);
//     toast.success("Visitor deleted successfully!");
//     return id;
//   }
// );

// // Update visitor status (Inside → Exited)
// export const updateVisitorStatus = createAsyncThunk(
//   "visitor/updateVisitorStatus",
//   async ({ id, status }) => {
//     const response = await API.put(`/visitor/update/${id}`, { status });
//     return { id, status };
//   }
// );

// // 🧠 Initial State
// const initialState = {
//   visitors: [],
//   singleVisitor: null,
//   loading: false,
// };

// // 🔥 Slice
// const visitorSlice = createSlice({
//   name: "visitor",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {

//     // 👉 Fetch All
//     builder.addCase(fetchVisitors.fulfilled, (state, action) => {
//       state.loading = false;
//       state.visitors = action.payload;
//     });

//     // 👉 Fetch One
//     builder.addCase(fetchVisitorById.fulfilled, (state, action) => {
//       state.loading = false;
//       state.singleVisitor = action.payload;
//     });

//     // 👉 Create
//     builder.addCase(createVisitor.fulfilled, (state, action) => {
//       state.loading = false;
//       state.visitors.unshift(action.payload);
//     });

//     // 👉 Update
//     builder.addCase(updateVisitor.fulfilled, (state, action) => {
//       state.loading = false;

//       const index = state.visitors.findIndex(
//         (v) => v._id === action.payload._id
//       );

//       if (index !== -1) {
//         state.visitors[index] = action.payload;
//       }

//       state.singleVisitor = action.payload;
//     });

//     // 👉 Delete
//     builder.addCase(deleteVisitor.fulfilled, (state, action) => {
//       state.loading = false;
//       state.visitors = state.visitors.filter(
//         (v) => v._id !== action.payload
//       );
//     });

//     // 👉 Update Status
//     builder.addCase(updateVisitorStatus.fulfilled, (state, action) => {
//       const index = state.visitors.findIndex(
//         (v) => v._id === action.payload.id
//       );

//       if (index !== -1) {
//         state.visitors[index].status = action.payload.status;
//       }
//     });
//   },
// });

// export default visitorSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// ─── Thunks ───────────────────────────────────────────────

export const fetchVisitors = createAsyncThunk(
  "visitor/fetchVisitors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/visitor/list");
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch visitors");
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
      return rejectWithValue(err.response?.data?.message || "Failed to fetch visitor");
    }
  }
);

export const createVisitor = createAsyncThunk(
  "visitor/createVisitor",
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.post("/visitor/create", data);
      toast.success("Visitor added successfully!");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add visitor");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateVisitor = createAsyncThunk(
  "visitor/updateVisitor",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/visitor/update/${id}`, data);
      toast.success("Visitor updated successfully!");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update visitor");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteVisitor = createAsyncThunk(
  "visitor/deleteVisitor",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/visitor/delete/${id}`);
      toast.success("Visitor deleted successfully!");
      return id;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete visitor");
      return rejectWithValue(err.response?.data?.message);
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
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ✅ Used in VisitorManagement.jsx — was MISSING before
export const approveVisitor = createAsyncThunk(
  "visitor/approveVisitor",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.put(`/visitor/approve/${id}`);
      toast.success("Visitor approved!");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ✅ Used in VisitorManagement.jsx — was MISSING before
export const denyVisitor = createAsyncThunk(
  "visitor/denyVisitor",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.put(`/visitor/deny/${id}`);
      toast.success("Visitor denied!");
      return response.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Denial failed");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ─── Initial State ────────────────────────────────────────

const initialState = {
  visitors:      [],
  singleVisitor: null,
  loading:       false,
  error:         null,
};

// ─── Slice ────────────────────────────────────────────────

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
      state.loading = false;
      state.visitors = action.payload;
    });

    // Fetch By ID
    builder.addCase(fetchVisitorById.fulfilled, (state, action) => {
      state.loading = false;
      state.singleVisitor = action.payload;
    });

    // Create
    builder.addCase(createVisitor.fulfilled, (state, action) => {
      state.loading = false;
      state.visitors.unshift(action.payload);
    });

    // Update
    builder.addCase(updateVisitor.fulfilled, (state, action) => {
      state.loading = false;
      const idx = state.visitors.findIndex((v) => v._id === action.payload._id);
      if (idx !== -1) state.visitors[idx] = action.payload;
      state.singleVisitor = action.payload;
    });

    // Delete
    builder.addCase(deleteVisitor.fulfilled, (state, action) => {
      state.loading = false;
      state.visitors = state.visitors.filter((v) => v._id !== action.payload);
      if (state.singleVisitor?._id === action.payload) state.singleVisitor = null;
    });

    // Update Status
    builder.addCase(updateVisitorStatus.fulfilled, (state, action) => {
      const idx = state.visitors.findIndex((v) => v._id === action.payload.id);
      if (idx !== -1) state.visitors[idx].status = action.payload.status;
    });

    // Approve
    builder.addCase(approveVisitor.fulfilled, (state, action) => {
      state.loading = false;
      const idx = state.visitors.findIndex((v) => v._id === action.payload._id);
      if (idx !== -1) state.visitors[idx] = action.payload;
      state.singleVisitor = action.payload;
    });

    // ✅ Deny — was MISSING
    builder.addCase(denyVisitor.fulfilled, (state, action) => {
      state.loading = false;
      const idx = state.visitors.findIndex((v) => v._id === action.payload._id);
      if (idx !== -1) state.visitors[idx] = action.payload;
      state.singleVisitor = action.payload;
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