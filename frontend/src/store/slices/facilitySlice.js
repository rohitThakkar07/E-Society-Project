import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// 🔥 GET ALL
export const fetchFacilities = createAsyncThunk(
  "facility/fetchFacilities",
  async () => {
    const res = await API.get("/facility/list");
    return res.data.data;
  }
);

// 🔥 GET ONE
export const fetchFacilityById = createAsyncThunk(
  "facility/fetchFacilityById",
  async (id) => {
    const res = await API.get(`/facility/${id}`);
    return res.data.data;
  }
);

// 🔥 CREATE
export const createFacility = createAsyncThunk(
  "facility/createFacility",
  async (data) => {
    const res = await API.post("/facility/create", data);
    toast.success("Facility created successfully!");
    return res.data.data;
  }
);

// 🔥 UPDATE
export const updateFacility = createAsyncThunk(
  "facility/updateFacility",
  async ({ id, data }) => {
    const res = await API.put(`/facility/update/${id}`, data);
    toast.success("Facility updated successfully!");
    return res.data.data;
  }
);

// 🔥 DELETE
export const deleteFacility = createAsyncThunk(
  "facility/deleteFacility",
  async (id) => {
    await API.delete(`/facility/delete/${id}`);
    toast.success("Facility deleted!");
    return id;
  }
);

// 🔥 UPDATE STATUS
export const updateFacilityStatus = createAsyncThunk(
  "facility/updateFacilityStatus",
  async ({ id, status }) => {
    await API.put(`/facility/update/${id}`, { status });
    return { id, status };
  }
);

// 🔥 INITIAL STATE
const initialState = {
  facilities: [],
  singleFacility: null,
  loading: false,
};

// 🔥 SLICE
const facilitySlice = createSlice({
  name: "facility",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    // GET ALL
    builder.addCase(fetchFacilities.fulfilled, (state, action) => {
      state.loading = false;
      state.facilities = action.payload;
    });

    // GET ONE
    builder.addCase(fetchFacilityById.fulfilled, (state, action) => {
      state.loading = false;
      state.singleFacility = action.payload;
    });

    // CREATE
    builder.addCase(createFacility.fulfilled, (state, action) => {
      state.loading = false;
      state.facilities.unshift(action.payload);
    });

    // UPDATE
    builder.addCase(updateFacility.fulfilled, (state, action) => {
      state.loading = false;

      const index = state.facilities.findIndex(
        (f) => f._id === action.payload._id
      );

      if (index !== -1) {
        state.facilities[index] = action.payload;
      }

      state.singleFacility = action.payload;
    });

    // DELETE
    builder.addCase(deleteFacility.fulfilled, (state, action) => {
      state.loading = false;
      state.facilities = state.facilities.filter(
        (f) => f._id !== action.payload
      );
    });

    // STATUS UPDATE
    builder.addCase(updateFacilityStatus.fulfilled, (state, action) => {
      const index = state.facilities.findIndex(
        (f) => f._id === action.payload.id
      );

      if (index !== -1) {
        state.facilities[index].status = action.payload.status;
      }
    });

    // 🔥 COMMON LOADING HANDLER
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

export default facilitySlice.reducer;