import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

export const fetchStaffSummary = createAsyncThunk("staff/fetchStaffSummary", async () => {
  const res = await API.get("/staff/dashboard");
  console.log(res.data)
  return res.data.data;
});

export const fetchStaff = createAsyncThunk("staff/fetchStaff", async (params = {}) => {
  const q = new URLSearchParams(params).toString();
  const res = await API.get(`/staff/list${q ? `?${q}` : ""}`); 
  return res.data.data;
});

export const fetchStaffById = createAsyncThunk("staff/fetchStaffById", async (id) => {
  const res = await API.get(`/staff/${id}`);
  return res.data.data;
});

export const createStaff = createAsyncThunk("staff/createStaff", async (data, { rejectWithValue }) => {
  try {
    const res = await API.post("/staff/create", data);
    toast.success("Staff added!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateStaff = createAsyncThunk("staff/updateStaff", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/staff/update/${id}`, data);
    toast.success("Staff updated!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteStaff = createAsyncThunk("staff/deleteStaff", async (id) => {
  await API.delete(`/staff/delete/${id}`);
  toast.success("Staff removed.");
  return id;
});

const initialState = { list: [], singleStaff: null, summary: null, loading: false, summaryLoading: false, error: null };

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: { clearSingleStaff: (s) => { s.singleStaff = null; } },
  extraReducers: (builder) => {
    builder.addCase(fetchStaffSummary.pending,   (s) => { s.summaryLoading = true; });
    builder.addCase(fetchStaffSummary.fulfilled, (s, a) => { s.summaryLoading = false; s.summary = a.payload; });
    builder.addCase(fetchStaffSummary.rejected,  (s) => { s.summaryLoading = false; });
    builder.addCase(fetchStaff.fulfilled,      (s, a) => { s.loading = false; s.list = a.payload; });
    builder.addCase(fetchStaffById.fulfilled,  (s, a) => { s.loading = false; s.singleStaff = a.payload; });
    builder.addCase(createStaff.fulfilled,     (s, a) => { s.loading = false; s.list.unshift(a.payload); });
    builder.addCase(updateStaff.fulfilled,     (s, a) => {
      s.loading = false;
      const i = s.list.findIndex(x => x._id === a.payload._id);
      if (i !== -1) s.list[i] = a.payload;
      s.singleStaff = a.payload;
    });
    builder.addCase(deleteStaff.fulfilled, (s, a) => { s.loading = false; s.list = s.list.filter(x => x._id !== a.payload); });
    builder.addMatcher(
      (a) => a.type.startsWith("staff/") && a.type.endsWith("/pending") && !a.type.includes("fetchStaffSummary"),
      (s) => { s.loading = true; s.error = null; }
    );
    builder.addMatcher(
      (a) => a.type.startsWith("staff/") && a.type.endsWith("/rejected") && !a.type.includes("fetchStaffSummary"),
      (s) => { s.loading = false; }
    );
    
  },
});

export const { clearSingleStaff } = staffSlice.actions;
export default staffSlice.reducer;