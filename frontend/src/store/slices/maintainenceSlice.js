import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// 🔹 FETCH LIST
export const fetchMaintenanceList = createAsyncThunk(
  "maintenance/fetchList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/maintenance/list");
      return res.data.data;
    } catch (err) {
      toast.error("Failed to fetch maintenance list");
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// 🔹 FETCH BY ID
export const fetchMaintenanceById = createAsyncThunk(
  "maintenance/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/maintenance/${id}`);
      return res.data.data;
    } catch (err) {
      toast.error("Failed to fetch details");
      return rejectWithValue(err.response?.data?.message);
    }
  },
);
// get mymaintenance
export const fetchMyMaintenance = createAsyncThunk(
  "maintenance/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/maintenance/my");
      return res.data.data;
    } catch (err) {
      toast.error("Failed to load data");
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// 🔹 CREATE
export const createMaintenance = createAsyncThunk(
  "maintenance/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.post("/maintenance/create", formData);
      toast.success("Maintenance created!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// 🔹 MARK AS PAID
export const markAsPaid = createAsyncThunk(
  "maintenance/markAsPaid",
  async ({ id, notes }, { rejectWithValue }) => {
    try {
      const res = await API.post(`/maintenance/mark-paid/${id}`, { notes });
      toast.success("Marked as Paid!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Mark failed");
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

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
// dashboard summery

export const fetchDashboardSummary = createAsyncThunk(
  "maintenance/fetchSummary",
  async () => {
    const res = await API.get("/maintenance/summary");
    return res.data.data;
  },
);
// 🔹 ADD PAYMENT (FIXED)
export const addPayment = createAsyncThunk(
  "maintenance/addPayment",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const res = await API.post(`/maintenance/add-payment/${id}`, data);
      toast.success("Payment added!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// 🔹 DELETE
export const deleteMaintenance = createAsyncThunk(
  "maintenance/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/maintenance/delete/${id}`);
      toast.success("Deleted!");
      return id;
    } catch (err) {
      toast.error("Delete failed");
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

// 🔹 SLICE
const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState: {
    list: [],
    singleRecord: null,
  },

  reducers: {
    clearSingleRecord: (state) => {
      state.singleRecord = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchMaintenanceList.fulfilled, (state, action) => {
        state.list = action.payload || [];
      })

      .addCase(fetchMyMaintenance.fulfilled, (state, action) => {
        state.list = action.payload || [];
      })

      .addCase(fetchMaintenanceById.fulfilled, (state, action) => {
        state.singleRecord = action.payload;
      })

      .addCase(createMaintenance.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      .addCase(markAsPaid.fulfilled, (state, action) => {
        const i = state.list.findIndex(
          (item) => item._id === action.payload._id,
        );
        if (i !== -1) state.list[i] = action.payload;

        state.singleRecord = action.payload; // ✅ update UI instantly
      })

      .addCase(addPayment.fulfilled, (state, action) => {
        state.singleRecord = action.payload; // ✅ update details page
      })

      .addCase(deleteMaintenance.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item._id !== action.payload);
      });
  },
});

export const { clearSingleRecord } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
