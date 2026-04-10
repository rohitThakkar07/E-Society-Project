import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

export const fetchBookings = createAsyncThunk(
  "booking/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/facility-booking/list");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load bookings");
    }
  }
);

export const fetchMyBookings = createAsyncThunk(
  "booking/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/facility-booking/my");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load your bookings");
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  "booking/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/facility-booking/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const previewBooking = createAsyncThunk(
  "booking/preview",
  async ({ facilityId, startDateTime, endDateTime }, { rejectWithValue }) => {
    try {
      const res = await API.post("/facility-booking/preview", {
        facilityId,
        startDateTime,
        endDateTime,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Preview failed");
    }
  }
);

export const checkAvailability = createAsyncThunk(
  "booking/checkAvailability",
  async ({ facilityId, date }) => {
    const res = await API.get(
      `/facility-booking/check-availability?facilityId=${facilityId}&date=${encodeURIComponent(date)}`
    );
    return { slots: res.data.data, facilityMeta: res.data.facility };
  }
);

export const createBooking = createAsyncThunk(
  "booking/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/facility-booking/create", data);
      toast.success(res.data.message || "Booking created");
      return res.data.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Booking failed";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateBooking = createAsyncThunk(
  "booking/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/facility-booking/update/${id}`, data);
      toast.success(res.data.message || "Updated");
      return res.data.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Update failed";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const deleteBooking = createAsyncThunk("booking/delete", async (id) => {
  await API.delete(`/facility-booking/delete/${id}`);
  toast.success("Booking deleted");
  return id;
});

export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.put(`/facility-booking/update/${id}`, { status: "Cancelled" });
      toast.success("Booking cancelled");
      return res.data.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to cancel";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const initialState = {
  bookings: [],
  myBookings: [],
  singleBooking: null,
  bookedSlots: [],
  availabilityFacilityMeta: null,
  preview: null,
  availabilityLoading: false,
  previewLoading: false,
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookedSlots: (state) => {
      state.bookedSlots = [];
      state.availabilityFacilityMeta = null;
    },
    clearPreview: (state) => {
      state.preview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload || [];
      })
      .addCase(fetchBookings.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = action.payload || [];
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleBooking = action.payload;
      })
      .addCase(previewBooking.pending, (state) => {
        state.previewLoading = true;
        state.preview = null;
      })
      .addCase(previewBooking.fulfilled, (state, action) => {
        state.previewLoading = false;
        state.preview = action.payload;
      })
      .addCase(previewBooking.rejected, (state) => {
        state.previewLoading = false;
        state.preview = null;
      })
      .addCase(checkAvailability.pending, (state) => {
        state.availabilityLoading = true;
        state.bookedSlots = [];
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.availabilityLoading = false;
        state.bookedSlots = action.payload.slots || [];
        state.availabilityFacilityMeta = action.payload.facilityMeta || null;
      })
      .addCase(checkAvailability.rejected, (state) => {
        state.availabilityLoading = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.myBookings.unshift(action.payload);
          state.bookings.unshift(action.payload);
        }
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const u = (b) => (b._id === action.payload._id ? action.payload : b);
        state.bookings = state.bookings.map(u);
        state.myBookings = state.myBookings.map(u);
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        const u = (b) => (b._id === action.payload._id ? action.payload : b);
        state.bookings = state.bookings.map(u);
        state.myBookings = state.myBookings.map(u);
        state.singleBooking = action.payload;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter((b) => b._id !== action.payload);
        state.myBookings = state.myBookings.filter((b) => b._id !== action.payload);
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("booking/") &&
          action.type.endsWith("/pending") &&
          !action.type.includes("checkAvailability") &&
          !action.type.includes("preview"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("booking/") &&
          action.type.endsWith("/rejected") &&
          !action.type.includes("checkAvailability") &&
          !action.type.includes("preview"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearBookedSlots, clearPreview } = bookingSlice.actions;
export default bookingSlice.reducer;
