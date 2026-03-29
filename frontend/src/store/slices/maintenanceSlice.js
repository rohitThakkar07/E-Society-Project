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
        return res.data.data; // Ensure this returns the full object { _id, resident: {...}, amount, etc }
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

export const payMaintenance = createAsyncThunk("maintenance/pay", async ({ id, method }, { rejectWithValue }) => {
    try {
        const res = await API.put(`/maintenance/pay/${id}`, { paymentMethod: method });
        toast.success("Payment successful");
        return res.data.data;
    } catch (err) {
        toast.error("Payment failed");
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

// --- Slice ---
const maintenanceSlice = createSlice({
    name: "maintenance",
    initialState: {
        list: [],
        singleRecord: null,
        summary: null,
        loading: false,
        error: null
    },
    reducers: {
        clearSingleRecord: (state) => { state.singleRecord = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMaintenanceList.fulfilled, (state, action) => {
                state.list = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchMyMaintenance.fulfilled, (state, action) => {
                state.list = action.payload; 
            })
            .addCase(fetchMaintenanceById.fulfilled, (state, action) => {
                // ✅ Ensure singleRecord is populated correctly for the Invoice UI
                state.singleRecord = action.payload;
            })
            .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
                state.summary = action.payload;
            })
            .addCase(createMaintenance.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })
            .addCase(deleteMaintenance.fulfilled, (state, action) => {
                state.list = state.list.filter(item => item._id !== action.payload);
            })
            
            // ✅ Unified Update Matcher
            .addMatcher(
                (action) => [
                    payMaintenance.fulfilled.type, 
                    markAsPaid.fulfilled.type, 
                    addPayment.fulfilled.type
                ].includes(action.type),
                (state, action) => {
                    state.singleRecord = action.payload;
                    const index = state.list.findIndex(item => item._id === action.payload._id);
                    if (index !== -1) state.list[index] = action.payload;
                }
            )

            // GLOBAL PENDING
            .addMatcher(
                (action) => action.type.startsWith("maintenance/") && action.type.endsWith("/pending"),
                (state) => { 
                    state.loading = true; 
                    state.error = null; 
                }
            )
            // GLOBAL FULFILLED/REJECTED
            .addMatcher(
                (action) => action.type.startsWith("maintenance/") && (action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected")),
                (state, action) => { 
                    state.loading = false; 
                    if (action.type.endsWith("/rejected")) state.error = action.payload;
                }
            );
    },
});

export const { clearSingleRecord } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;