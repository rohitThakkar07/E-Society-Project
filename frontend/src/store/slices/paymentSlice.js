import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// 🔹 THUNKS

export const addPayment = createAsyncThunk(
  "payment/add",
  async (paymentData) => {
    const res = await API.post("/payments/add", paymentData);
    toast.success("Payment recorded!");
    return res.data.data;
  }
);

export const fetchPaymentHistory = createAsyncThunk(
  "payment/history",
  async () => {
    const res = await API.get("/payments/history");
    return res.data.data;
  }
);

// 🔹 SLICE

const paymentSlice = createSlice({
  name: "payment",

  initialState: {
    history: [],
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        state.history = action.payload || [];
      })

      .addCase(addPayment.fulfilled, (state, action) => {
        state.history.unshift(action.payload);
      });
  },
});

export default paymentSlice.reducer;
