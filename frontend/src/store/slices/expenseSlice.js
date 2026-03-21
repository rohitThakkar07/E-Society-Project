import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchDashboardSummary = createAsyncThunk(
  "expense/fetchDashboardSummary",
  async () => {
    const res = await API.get("/expense/dashboard");
    return res.data.data;
  }
);

export const fetchExpenses = createAsyncThunk(
  "expense/fetchExpenses",
  async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await API.get(`/expense/list${query ? `?${query}` : ""}`);
    return res.data.data;
  }
);

export const fetchExpenseById = createAsyncThunk(
  "expense/fetchExpenseById",
  async (id) => {
    const res = await API.get(`/expense/${id}`);
    return res.data.data;
  }
);

export const fetchReport = createAsyncThunk(
  "expense/fetchReport",
  async ({ month, year }) => {
    const res = await API.get(`/expense/report?month=${month}&year=${year}`);
    return res.data.data;
  }
);

export const createExpense = createAsyncThunk(
  "expense/createExpense",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/expense/create", data);
      toast.success("Expense added!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add expense");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateExpense = createAsyncThunk(
  "expense/updateExpense",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/expense/update/${id}`, data);
      toast.success("Expense updated!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expense/deleteExpense",
  async (id) => {
    await API.delete(`/expense/delete/${id}`);
    toast.success("Expense deleted.");
    return id;
  }
);

// ── Initial state ─────────────────────────────────────────────────────────────

const initialState = {
  list:            [],
  singleExpense:   null,
  summary:         null,  // dashboard summary
  report:          null,  // { expenses, total, categorySummary }
  loading:         false,
  summaryLoading:  false,
  reportLoading:   false,
  error:           null,
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    clearSingleExpense: (s) => { s.singleExpense = null; },
    clearReport:        (s) => { s.report = null; },
  },
  extraReducers: (builder) => {

    // Dashboard summary
    builder.addCase(fetchDashboardSummary.pending,   (s) => { s.summaryLoading = true; });
    builder.addCase(fetchDashboardSummary.fulfilled, (s, a) => { s.summaryLoading = false; s.summary = a.payload; });
    builder.addCase(fetchDashboardSummary.rejected,  (s) => { s.summaryLoading = false; });

    // Report
    builder.addCase(fetchReport.pending,   (s) => { s.reportLoading = true; });
    builder.addCase(fetchReport.fulfilled, (s, a) => { s.reportLoading = false; s.report = a.payload; });
    builder.addCase(fetchReport.rejected,  (s) => { s.reportLoading = false; });

    // List
    builder.addCase(fetchExpenses.fulfilled, (s, a) => {
      s.loading = false; s.list = a.payload;
    });

    // Single
    builder.addCase(fetchExpenseById.fulfilled, (s, a) => {
      s.loading = false; s.singleExpense = a.payload;
    });

    // Create
    builder.addCase(createExpense.fulfilled, (s, a) => {
      s.loading = false; s.list.unshift(a.payload);
    });
    builder.addCase(createExpense.rejected, (s, a) => {
      s.loading = false; s.error = a.payload;
    });

    // Update
    builder.addCase(updateExpense.fulfilled, (s, a) => {
      s.loading = false;
      const i = s.list.findIndex((e) => e._id === a.payload._id);
      if (i !== -1) s.list[i] = a.payload;
      s.singleExpense = a.payload;
    });
    builder.addCase(updateExpense.rejected, (s, a) => {
      s.loading = false; s.error = a.payload;
    });

    // Delete
    builder.addCase(deleteExpense.fulfilled, (s, a) => {
      s.loading = false;
      s.list = s.list.filter((e) => e._id !== a.payload);
    });

    // Scoped loading/error — skip dedicated loaders
    builder.addMatcher(
      (action) =>
        action.type.startsWith("expense/") &&
        action.type.endsWith("/pending") &&
        !action.type.includes("fetchDashboardSummary") &&
        !action.type.includes("fetchReport"),
      (s) => { s.loading = true; s.error = null; }
    );
    builder.addMatcher(
      (action) =>
        action.type.startsWith("expense/") &&
        action.type.endsWith("/rejected") &&
        !action.type.includes("fetchDashboardSummary") &&
        !action.type.includes("fetchReport"),
      (s) => { s.loading = false; }
    );
  },
});

export const { clearSingleExpense, clearReport } = expenseSlice.actions;
export default expenseSlice.reducer;