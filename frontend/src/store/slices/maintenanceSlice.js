import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchDashboardSummary = createAsyncThunk(
  "maintenance/fetchDashboardSummary",
  async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await API.get(`/maintenance/dashboard${query ? `?${query}` : ""}`);
    return res.data.data;
  }
);

export const fetchMaintenanceList = createAsyncThunk(
  "maintenance/fetchMaintenanceList",
  async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await API.get(`/maintenance/list${query ? `?${query}` : ""}`);
    return res.data.data;
  }
);

export const fetchMaintenanceById = createAsyncThunk(
  "maintenance/fetchMaintenanceById",
  async (id) => {
    if (!id) throw new Error("ID required");
    const res = await API.get(`/maintenance/${id}`);
    return res.data.data;
  }
);

export const createMaintenance = createAsyncThunk(
  "maintenance/createMaintenance",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/maintenance/create", data);
      toast.success("Maintenance record created!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateMaintenance = createAsyncThunk(
  "maintenance/updateMaintenance",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/maintenance/update/${id}`, data);
      toast.success("Updated successfully!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteMaintenance = createAsyncThunk(
  "maintenance/deleteMaintenance",
  async (id) => {
    await API.delete(`/maintenance/delete/${id}`);
    toast.success("Deleted.");
    return id;
  }
);

// Add a partial payment
export const addPayment = createAsyncThunk(
  "maintenance/addPayment",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.post(`/maintenance/${id}/add-payment`, data);
      toast.success(res.data.message || "Payment recorded!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// Mark fully paid in one shot
export const markAsPaid = createAsyncThunk(
  "maintenance/markAsPaid",
  async ({ id, data = {} }, { rejectWithValue }) => {
    try {
      const res = await API.post(`/maintenance/${id}/mark-paid`, data);
      toast.success("Marked as paid!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ── Initial state ─────────────────────────────────────────────────────────────

const initialState = {
  list:            [],   // all maintenance records
  singleRecord:    null, // current detail view
  summary:         null, // dashboard summary object
  loading:         false,
  summaryLoading:  false,
  error:           null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState,
  reducers: {
    clearSingleRecord: (state) => { state.singleRecord = null; },
  },
  extraReducers: (builder) => {

    // Dashboard summary
    builder.addCase(fetchDashboardSummary.pending,   (s) => { s.summaryLoading = true; });
    builder.addCase(fetchDashboardSummary.fulfilled, (s, a) => { s.summaryLoading = false; s.summary = a.payload; });
    builder.addCase(fetchDashboardSummary.rejected,  (s) => { s.summaryLoading = false; });

    // List
    builder.addCase(fetchMaintenanceList.fulfilled, (s, a) => {
      s.loading = false; s.list = a.payload;
    });

    // Single
    builder.addCase(fetchMaintenanceById.fulfilled, (s, a) => {
      s.loading = false; s.singleRecord = a.payload;
    });

    // Create
    builder.addCase(createMaintenance.fulfilled, (s, a) => {
      s.loading = false; s.list.unshift(a.payload);
    });
    builder.addCase(createMaintenance.rejected, (s, a) => {
      s.loading = false; s.error = a.payload;
    });

    // Update
    builder.addCase(updateMaintenance.fulfilled, (s, a) => {
      s.loading = false;
      const i = s.list.findIndex((r) => r._id === a.payload._id);
      if (i !== -1) s.list[i] = a.payload;
      s.singleRecord = a.payload;
    });

    // Delete
    builder.addCase(deleteMaintenance.fulfilled, (s, a) => {
      s.loading = false;
      s.list = s.list.filter((r) => r._id !== a.payload);
    });

    // Add payment / Mark paid — both update singleRecord + list entry
    [addPayment, markAsPaid].forEach((thunk) => {
      builder.addCase(thunk.fulfilled, (s, a) => {
        s.loading = false;
        s.singleRecord = a.payload;
        const i = s.list.findIndex((r) => r._id === a.payload._id);
        if (i !== -1) s.list[i] = a.payload;
      });
      builder.addCase(thunk.rejected, (s, a) => {
        s.loading = false; s.error = a.payload;
      });
    });

    // Scoped loading/error matchers
    builder.addMatcher(
      (action) => action.type.startsWith("maintenance/") && action.type.endsWith("/pending")
        && !action.type.includes("fetchDashboardSummary"),
      (s) => { s.loading = true; s.error = null; }
    );
    builder.addMatcher(
      (action) => action.type.startsWith("maintenance/") && action.type.endsWith("/rejected")
        && !action.type.includes("fetchDashboardSummary"),
      (s) => { s.loading = false; }
    );
  },
});

export const { clearSingleRecord } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;