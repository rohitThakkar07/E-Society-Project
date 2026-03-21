import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// GET ALL
export const fetchBookings = createAsyncThunk(
  "booking/fetchBookings",
  async () => {
    const res = await API.get("/booking/list");
    return res.data.data;
  }
);

// GET ONE
export const fetchBookingById = createAsyncThunk(
  "booking/fetchBookingById",
  async (id) => {
    const res = await API.get(`/booking/${id}`);
    return res.data.data;
  }
);

// CREATE
export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (data) => {
    const res = await API.post("/booking/create", data);
    toast.success("Booking created!");
    return res.data.data;
  }
);

// UPDATE
export const updateBooking = createAsyncThunk(
  "booking/updateBooking",
  async ({ id, data }) => {
    const res = await API.put(`/booking/update/${id}`, data);
    toast.success("Booking updated!");
    return res.data.data;
  }
);

// DELETE
export const deleteBooking = createAsyncThunk(
  "booking/deleteBooking",
  async (id) => {
    await API.delete(`/booking/delete/${id}`);
    toast.success("Booking deleted!");
    return id;
  }
);

const initialState = {
  bookings: [],
  singleBooking: null,
  loading: false,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(fetchBookings.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
    });

    builder.addCase(fetchBookingById.fulfilled, (state, action) => {
      state.loading = false;
      state.singleBooking = action.payload;
    });

    builder.addCase(createBooking.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings.unshift(action.payload);
    });

    builder.addCase(updateBooking.fulfilled, (state, action) => {
      state.loading = false;

      const index = state.bookings.findIndex(
        (b) => b._id === action.payload._id
      );

      if (index !== -1) {
        state.bookings[index] = action.payload;
      }

      state.singleBooking = action.payload;
    });

    builder.addCase(deleteBooking.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings = state.bookings.filter(
        (b) => b._id !== action.payload
      );
    });

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

export default bookingSlice.reducer;