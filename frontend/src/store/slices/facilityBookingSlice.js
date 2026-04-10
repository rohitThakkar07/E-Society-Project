import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// GET ALL
export const fetchBookings = createAsyncThunk(
  "booking/fetchBookings",
  async () => {
    const res = await API.get("/facility-booking/list");
    return res.data.data;
  }
);

// GET ONE
export const fetchBookingById = createAsyncThunk(
  "booking/fetchBookingById",
  async (id) => {
    if (!id) throw new Error("Booking ID is required");
    const res = await API.get(`/facility-booking/${id}`);
    return res.data.data;
  }
);

// CHECK AVAILABILITY — returns booked slots for a facility+date
export const checkAvailability = createAsyncThunk(
  "booking/checkAvailability",
  async ({ facilityId, bookingDate }) => {
    const res = await API.get(
      `/facility-booking/check-availability?facilityId=${facilityId}&bookingDate=${bookingDate}`
    );
    return res.data.data;
  }
);

// CREATE
export const createBooking = createAsyncThunk(
  "booking/createBooking",
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

// UPDATE
export const updateBooking = createAsyncThunk(
  "booking/updateBooking",
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

// DELETE
export const deleteBooking = createAsyncThunk(
  "booking/deleteBooking",
  async (id) => {
    await API.delete(`/facility-booking/delete/${id}`);
    toast.success("Booking deleted!");
    return id;
  }
);

// ✅ cancelBooking — imported in BookFacility.jsx
export const cancelBooking = createAsyncThunk(
  "facilityBooking/cancel",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.put(`/facilitybooking/cancel/${id}`);
      toast.success("Booking cancelled!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);
 
// export const updateBookingStatus = createAsyncThunk(
//   "facilityBooking/updateStatus",
//   async ({ id, status }, { rejectWithValue }) => {
//     try {
//       const res = await API.put(`/facilitybooking/update/${id}`, { status });
//       toast.success(`Booking ${status}!`);
//       return res.data.data;
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed");
//       return rejectWithValue(err.response?.data?.message);
//     }
//   }
// );
 
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

    builder.addCase(fetchBookings.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
    });

    builder.addCase(fetchBookingById.fulfilled, (state, action) => {
      state.loading = false;
      state.singleBooking = action.payload;
    });

    builder.addCase(checkAvailability.pending, (state) => {
      state.availabilityLoading = true;
      state.bookedSlots = [];
    });
    builder.addCase(checkAvailability.fulfilled, (state, action) => {
      state.availabilityLoading = false;
      state.bookedSlots = action.payload;
    });
    builder.addCase(checkAvailability.rejected, (state) => {
      state.availabilityLoading = false;
    });

    builder.addCase(createBooking.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings.unshift(action.payload);
    });
    builder.addCase(createBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(updateBooking.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.bookings.findIndex(
        (b) => b._id === action.payload._id
      );
      if (index !== -1) state.bookings[index] = action.payload;
      state.singleBooking = action.payload;
    });
    builder.addCase(updateBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(deleteBooking.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings = state.bookings.filter(
        (b) => b._id !== action.payload
      );
    });

    // Scoped pending/rejected — skip checkAvailability (has its own cases)
    builder.addMatcher(
      (action) =>
        action.type.startsWith("booking/") &&
        action.type.endsWith("/pending") &&
        !action.type.includes("checkAvailability"),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action) =>
        action.type.startsWith("booking/") &&
        action.type.endsWith("/rejected") &&
        !action.type.includes("checkAvailability"),
      (state) => {
        state.loading = false;
      }
    );
  },
});

export const { clearBookedSlots } = bookingSlice.actions;
export default bookingSlice.reducer;