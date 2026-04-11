import axios from "axios";

/** Default wait for most API calls. Bill generation / bulk jobs override per-request. */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  timeout: 60000,
});

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handler
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const msg = String(error.response?.data?.message || "");

    if (status === 403 && /inactive/i.test(msg)) {
      localStorage.clear();
      window.location.href = "/login?inactive=1";
      return Promise.reject(error);
    }

    if (status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
