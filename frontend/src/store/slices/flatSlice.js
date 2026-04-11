import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

export const fetchFlatSummary = createAsyncThunk("flat/fetchFlatSummary", async () => {
  const res = await API.get("/flat/dashboard");
  console.log(res.data.data);
  return res.data.data;
});

export const fetchFlats = createAsyncThunk("flat/fetchFlats", async (params = {}) => {
  const q = new URLSearchParams(params).toString();
  const res = await API.get(`/flat/list${q ? `?${q}` : ""}`);
  return res.data.data;
});

export const fetchFlatById = createAsyncThunk("flat/fetchFlatById", async (id) => {
  const res = await API.get(`/flat/${id}`);
  return res.data.data;
});

export const fetchResidentFlat = createAsyncThunk("flat/fetchResidentFlat", async (userId, { rejectWithValue }) => {
  try {
    const res = await API.get(`/flat/resident/${userId}`);
    return res.data.data;
  } catch (err) {
    const message = err.response?.data?.message || "Something went wrong";
    toast.error(message);
    return rejectWithValue(message);
  }
});

export const createFlat = createAsyncThunk("flat/createFlat", async (data, { rejectWithValue }) => {
  try {
    const res = await API.post("/flat/create", data);
    toast.success("Flat added!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateFlat = createAsyncThunk("flat/updateFlat", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/flat/update/${id}`, data);
    toast.success("Flat updated!");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed");
    return rejectWithValue(err.response?.data?.message);
  }
});

export const deleteFlat = createAsyncThunk("flat/deleteFlat", async (id) => {
  await API.delete(`/flat/delete/${id}`);
  toast.success("Flat deleted.");
  return id;
});

const initialState = { list: [], singleFlat: null, summary: null, loading: false, summaryLoading: false, error: null };

const flatSlice = createSlice({
  name: "flat",
  initialState,
  reducers: { clearSingleFlat: (s) => { s.singleFlat = null; } },
  extraReducers: (builder) => {
    builder.addCase(fetchResidentFlat.fulfilled, (s, a) => {
      s.loading = false;
      s.singleFlat = a.payload;
    });
    builder.addCase(fetchFlatSummary.pending, (s) => { s.summaryLoading = true; });
    builder.addCase(fetchFlatSummary.fulfilled, (s, a) => { s.summaryLoading = false; s.summary = a.payload; });
    builder.addCase(fetchFlatSummary.rejected, (s) => { s.summaryLoading = false; });
    builder.addCase(fetchFlats.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; });
    builder.addCase(fetchFlatById.fulfilled, (s, a) => { s.loading = false; s.singleFlat = a.payload; });
    builder.addCase(createFlat.fulfilled, (s, a) => { s.loading = false; s.list.unshift(a.payload); });
    builder.addCase(updateFlat.fulfilled, (s, a) => {
      s.loading = false;
      const i = s.list.findIndex(x => x._id === a.payload._id);
      if (i !== -1) s.list[i] = a.payload;
      s.singleFlat = a.payload;
    });
    builder.addCase(deleteFlat.fulfilled, (s, a) => { s.loading = false; s.list = s.list.filter(x => x._id !== a.payload); });
    builder.addMatcher(
      (a) => a.type.startsWith("flat/") && a.type.endsWith("/pending") && !a.type.includes("fetchFlatSummary"),
      (s) => { s.loading = true; s.error = null; }
    );
    builder.addMatcher(
      (a) => a.type.startsWith("flat/") && a.type.endsWith("/rejected") && !a.type.includes("fetchFlatSummary"),
      (s) => { s.loading = false; }
    );
  },
});

export const { clearSingleFlat } = flatSlice.actions;
export default flatSlice.reducer;