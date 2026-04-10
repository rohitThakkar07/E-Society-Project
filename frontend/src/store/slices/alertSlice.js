import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

export const fetchAlerts = createAsyncThunk("alert/fetchAlerts", async (params = {}) => {
  const q = new URLSearchParams(params).toString();
  const res = await API.get(`/alert/list${q ? `?${q}` : ""}`);
  return res.data.data;
});

export const fetchAlertById = createAsyncThunk("alert/fetchAlertById", async (id) => {
  const res = await API.get(`/alert/${id}`);
  return res.data.data;
});

export const createAlert = createAsyncThunk("alert/createAlert", async (data, { rejectWithValue }) => {
  try {
    const res = await API.post("/alert/create", data);
    toast.success("Alert sent!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const resolveAlert = createAsyncThunk("alert/resolveAlert", async (id) => {
  const res = await API.put(`/alert/resolve/${id}`);
  toast.success("Alert resolved.");
  return res.data.data;
});

export const deleteAlert = createAsyncThunk("alert/deleteAlert", async (id) => {
  await API.delete(`/alert/delete/${id}`);
  toast.success("Alert deleted.");
  return id;
});

const initialState = { list: [], singleAlert: null, loading: false, error: null };

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: { clearSingleAlert: (s) => { s.singleAlert = null; } },
  extraReducers: (builder) => {
    builder.addCase(fetchAlerts.fulfilled,    (s, a) => { s.loading = false; s.list = a.payload; });
    builder.addCase(fetchAlertById.fulfilled, (s, a) => { s.loading = false; s.singleAlert = a.payload; });
    builder.addCase(createAlert.fulfilled,    (s, a) => { s.loading = false; s.list.unshift(a.payload); });
    builder.addCase(resolveAlert.fulfilled,   (s, a) => {
      s.loading = false;
      const i = s.list.findIndex(x => x._id === a.payload._id);
      if (i !== -1) s.list[i] = a.payload;
      s.singleAlert = a.payload;
    });
    builder.addCase(deleteAlert.fulfilled, (s, a) => { s.loading = false; s.list = s.list.filter(x => x._id !== a.payload); });
    builder.addMatcher(
      (a) => a.type.startsWith("alert/") && a.type.endsWith("/pending"),
      (s) => { s.loading = true; s.error = null; }
    );
    builder.addMatcher(
      (a) => a.type.startsWith("alert/") && a.type.endsWith("/rejected"),
      (s) => { s.loading = false; }
    );
  },
});

export const { clearSingleAlert } = alertSlice.actions;
export default alertSlice.reducer;