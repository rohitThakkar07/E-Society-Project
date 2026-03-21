import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

export const fetchNotices = createAsyncThunk("notice/fetchNotices", async (params = {}) => {
  const q = new URLSearchParams(params).toString();
  const res = await API.get(`/notice/list${q ? `?${q}` : ""}`);
  return res.data.data;
});

export const fetchNoticeById = createAsyncThunk("notice/fetchNoticeById", async (id) => {
  const res = await API.get(`/notice/${id}`);
  return res.data.data;
});

export const createNotice = createAsyncThunk("notice/createNotice", async (data, { rejectWithValue }) => {
  try {
    const res = await API.post("/notice/create", data);
    toast.success("Notice posted!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateNotice = createAsyncThunk("notice/updateNotice", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/notice/update/${id}`, data);
    toast.success("Notice updated!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteNotice = createAsyncThunk("notice/deleteNotice", async (id) => {
  await API.delete(`/notice/delete/${id}`);
  toast.success("Notice deleted.");
  return id;
});

const initialState = { list: [], singleNotice: null, loading: false, error: null };

const noticeSlice = createSlice({
  name: "notice",
  initialState,
  reducers: { clearSingleNotice: (s) => { s.singleNotice = null; } },
  extraReducers: (builder) => {
    builder.addCase(fetchNotices.fulfilled,    (s, a) => { s.loading = false; s.list = a.payload; });
    builder.addCase(fetchNoticeById.fulfilled, (s, a) => { s.loading = false; s.singleNotice = a.payload; });
    builder.addCase(createNotice.fulfilled,    (s, a) => { s.loading = false; s.list.unshift(a.payload); });
    builder.addCase(updateNotice.fulfilled,    (s, a) => {
      s.loading = false;
      const i = s.list.findIndex(n => n._id === a.payload._id);
      if (i !== -1) s.list[i] = a.payload;
      s.singleNotice = a.payload;
    });
    builder.addCase(deleteNotice.fulfilled, (s, a) => { s.loading = false; s.list = s.list.filter(n => n._id !== a.payload); });
    builder.addCase(createNotice.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
    builder.addMatcher(
      (a) => a.type.startsWith("notice/") && a.type.endsWith("/pending"),
      (s) => { s.loading = true; s.error = null; }
    );
    builder.addMatcher(
      (a) => a.type.startsWith("notice/") && a.type.endsWith("/rejected"),
      (s) => { s.loading = false; }
    );
  },
});

export const { clearSingleNotice } = noticeSlice.actions;
export default noticeSlice.reducer;