// store/slices/authSlice.js (Minimal Version)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import API from "../../service/api";

// Async Thunks
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    const response = await API.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    // toast.success("Login successful!");
    return response.data;
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (formData) => {
    const response = await API.post("/auth/register", formData);
    toast.success("Registration successful!");
    return response.data;
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async () => {
    const response = await API.get("/auth/me");
    return response.data.data;
  }
);

// Initial State
const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  isAuthenticated: !!localStorage.getItem("token"),
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user || action.payload.data;
      state.isAuthenticated = true;
    });

    // Register
    builder.addCase(register.fulfilled, (state) => {
      state.loading = false;
    });

    // Get Current User
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
  },
});

export default authSlice.reducer;