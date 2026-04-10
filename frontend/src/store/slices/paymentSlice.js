import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// ── THUNKS ────────────────────────────────────────────────────────────────────

// Step 1: Get payment intent (new)
export const initiatePayment = createAsyncThunk(
  "payment/initiate",
  async (maintenanceId, { rejectWithValue }) => {
    try {
      const res = await API.post("/payment/initiate", { maintenanceId });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to initiate payment");
    }
  }
);

/** Razorpay verify: body must include maintenanceId, orderId, paymentId, signature */
export const addPayment = createAsyncThunk(
  "payment/add",
  async (paymentData, { rejectWithValue }) => {
    try {
      const res = await API.post("/payment/verify", paymentData);
      toast.success("Payment recorded!");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Payment failed");
    }
  }
);

// Fetch resident's own payment history (existing)
export const fetchPaymentHistory = createAsyncThunk(
  "payment/history",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/payment/my-history");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch history");
    }
  }
);

// ── SLICE ─────────────────────────────────────────────────────────────────────

const paymentSlice = createSlice({
  name: "payment",

  initialState: {
    history: [],

    // Step 1 — intent
    intent:        null,   // { clientSecret, paymentIntentId, amount }
    initiating:    false,
    initiateError: null,

    // Step 2 — confirm
    confirming:    false,
    confirmError:  null,
    lastReceipt:   null,   // { receiptNumber, transactionId, paidAt }
  },

  reducers: {
    clearIntent(state) {
      state.intent        = null;
      state.initiateError = null;
      state.confirmError  = null;
      state.lastReceipt   = null;
    },
  },

  extraReducers: (builder) => {

    // ── initiatePayment
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.initiating    = true;
        state.initiateError = null;
        state.intent        = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.initiating = false;
        state.intent     = action.payload;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.initiating    = false;
        state.initiateError = action.payload;
      });

    // ── addPayment (confirm)
    builder
      .addCase(addPayment.pending, (state) => {
        state.confirming   = true;
        state.confirmError = null;
        state.lastReceipt  = null;
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.confirming  = false;
        state.lastReceipt = action.payload;
        state.intent      = null;
        if (action.payload) state.history.unshift(action.payload);
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.confirming   = false;
        state.confirmError = action.payload;
      });

    // ── fetchPaymentHistory
    builder
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.history = action.payload || [];
      });
  },
});

export const { clearIntent } = paymentSlice.actions;

// ── SELECTORS ─────────────────────────────────────────────────────────────────
export const selectHistory       = (state) => state.payment.history;
export const selectIntent        = (state) => state.payment.intent;
export const selectInitiating    = (state) => state.payment.initiating;
export const selectInitiateError = (state) => state.payment.initiateError;
export const selectConfirming    = (state) => state.payment.confirming;
export const selectConfirmError  = (state) => state.payment.confirmError;
export const selectLastReceipt   = (state) => state.payment.lastReceipt;

export default paymentSlice.reducer;