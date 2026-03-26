import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// ✅ FIX 1: Standardized all types to start with "booking/" 
// to ensure the Matcher (at the bottom) catches them all.

export const fetchBookings = createAsyncThunk(
  "booking/fetchAll",
  async () => {
    const res = await API.get("/facility-booking/list");
    return res.data.data;
  }
);

export const fetchBookingById = createAsyncThunk(
  "booking/fetchById",
  async (id) => {
    const res = await API.get(`/facility-booking/${id}`);
    return res.data.data;
  }
);

export const checkAvailability = createAsyncThunk(
  "booking/checkAvailability",
  async ({ facilityId, bookingDate }) => {
    const res = await API.get(
      `/facility-booking/check-availability?facilityId=${facilityId}&bookingDate=${bookingDate}`
    );
    return res.data.data;
  }
);

export const createBooking = createAsyncThunk(
  "booking/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/facility-booking/create", data);
      toast.success("Booking created!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateBooking = createAsyncThunk(
  "booking/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/facility-booking/update/${id}`, data);
      toast.success("Booking updated!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "booking/delete",
  async (id) => {
    await API.delete(`/facility-booking/delete/${id}`);
    toast.success("Booking deleted!");
    return id;
  }
);

// ✅ FIX 2: Fixed the type string to start with "booking/"
export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async (id, { rejectWithValue }) => {
    try {
      // Ensure the URL matches your backend route
      const res = await API.put(`/facility-booking/update/${id}`, { status: "Cancelled" });
      toast.success("Booking cancelled!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const initialState = {
  bookings: [],
  singleBooking: null,
  bookedSlots: [],
  availabilityLoading: false,
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookedSlots: (state) => {
      state.bookedSlots = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleBooking = action.payload;
      })
      .addCase(checkAvailability.pending, (state) => {
        state.availabilityLoading = true;
        state.bookedSlots = [];
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.availabilityLoading = false;
        state.bookedSlots = action.payload;
      })
      .addCase(checkAvailability.rejected, (state) => {
        state.availabilityLoading = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
      })
      // ✅ FIX 3: Added case for Cancel Booking so it updates in the list immediately
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) state.bookings[index] = action.payload;
        state.singleBooking = action.payload;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(b => b._id !== action.payload);
      })

      // GLOBAL MATCHERS
      .addMatcher(
        (action) => action.type.startsWith("booking/") && action.type.endsWith("/pending") && !action.type.includes("checkAvailability"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("booking/") && action.type.endsWith("/rejected") && !action.type.includes("checkAvailability"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearBookedSlots } = bookingSlice.actions;
export default bookingSlice.reducer;