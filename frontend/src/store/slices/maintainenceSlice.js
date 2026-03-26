import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// --- Thunks ---
export const fetchMaintenanceList = createAsyncThunk("maintenance/fetchList", async (_, { rejectWithValue }) => {
  try {
    const res = await API.get("/maintenance/list");
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchMaintenanceById = createAsyncThunk("maintenance/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await API.get(`/maintenance/${id}`);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchMyMaintenance = createAsyncThunk("maintenance/fetchMy", async (_, { rejectWithValue }) => {
  try {
    const res = await API.get("/maintenance/my");
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createMaintenance = createAsyncThunk("maintenance/create", async (formData, { rejectWithValue }) => {
  try {
    const res = await API.post("/maintenance/create", formData);
    toast.success("Maintenance created!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Create failed");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const markAsPaid = createAsyncThunk("maintenance/markAsPaid", async ({ id, notes }, { rejectWithValue }) => {
  try {
    const res = await API.post(`/maintenance/mark-paid/${id}`, { notes });
    toast.success("Marked as Paid!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Action failed");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchDashboardSummary = createAsyncThunk("maintenance/fetchSummary", async (_, { rejectWithValue }) => {
  try {
    const res = await API.get("/maintenance/summary");
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const addPayment = createAsyncThunk("maintenance/addPayment", async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const res = await API.post(`/maintenance/add-payment/${id}`, data);
    toast.success("Payment recorded!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Payment failed");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteMaintenance = createAsyncThunk("maintenance/delete", async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/maintenance/delete/${id}`);
    toast.success("Deleted!");
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

// ✅ PAY MAINTENANCE (USER FLOW)
export const payMaintenance = createAsyncThunk(
  "maintenance/pay",
  async ({ id, method }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/maintenance/pay/${id}`, {
        paymentMethod: method,
      });
      toast.success("Payment successful");
      return res.data.data;
    } catch (err) {
      toast.error("Payment failed");
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// --- Slice ---
const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState: {
    list: [],
    singleRecord: null,
    summary: null,
    loading: false, // Essential for skeleton loaders
    error: null
  },
  reducers: {
    clearSingleRecord: (state) => { state.singleRecord = null; },
  },
  // maintenanceSlice.js

extraReducers: (builder) => {
  builder
    // 1. ALL addCase calls must come FIRST
    .addCase(fetchMaintenanceList.fulfilled, (state, action) => {
      state.loading = false;
      state.list = Array.isArray(action.payload) ? action.payload : [];
    })
    // maintenanceSlice.js

.addCase(fetchMyMaintenance.fulfilled, (state, action) => {
    state.loading = false;
    state.list = action.payload; 
})
    .addCase(fetchMaintenanceById.fulfilled, (state, action) => {
      state.loading = false;
      state.singleRecord = action.payload;
    })
    .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
      state.loading = false;
      state.summary = action.payload;
    })
    .addCase(createMaintenance.fulfilled, (state, action) => {
      state.loading = false;
      state.list.unshift(action.payload);
    })
    .addCase(deleteMaintenance.fulfilled, (state, action) => {
      state.loading = false;
      state.list = state.list.filter(item => item._id !== action.payload);
    })
    // Add any other specific cases (markAsPaid, etc.) here...

    // 2. Matchers MUST come AFTER all addCase calls
    .addMatcher(
      (action) => action.type.startsWith("maintenance/") && action.type.endsWith("/pending"),
      (state) => { 
        state.loading = true; 
        state.error = null; 
      }
    )
    .addMatcher(
      (action) => action.type.startsWith("maintenance/") && action.type.endsWith("/rejected"),
      (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      }
    );
},
});

export const { clearSingleRecord } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;