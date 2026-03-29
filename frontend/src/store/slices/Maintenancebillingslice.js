import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../src/service/api";

// ── THUNKS ────────────────────────────────────────────────────────────────────

export const fetchSettings = createAsyncThunk(
  "maintenanceBilling/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/maintenance/settings");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load settings");
    }
  }
);

export const saveSettings = createAsyncThunk(
  "maintenanceBilling/saveSettings",
  async (settings, { rejectWithValue }) => {
    try {
      const res = await api.put("/maintenance/settings", settings);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to save settings");
    }
  }
);

export const generateBills = createAsyncThunk(
  "maintenanceBilling/generateBills",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const res = await api.post("/maintenance/generate", { month, year });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to generate bills");
    }
  }
);

// ── SLICE ─────────────────────────────────────────────────────────────────────

const maintenanceBillingSlice = createSlice({
  name: "maintenanceBilling",
  initialState: {
    // settings
    settings: {
      dueDays: 10,
      lateFeeType: "none",
      lateFeeAmount: 0,
      lateFeePercent: 0,
      autoGenerate: false,
      sendEmailOnGenerate: true,
      sendOverdueReminder: true,
      overdueReminderDays: 3,
    },
    settingsLoading: false,
    settingsSaving: false,
    settingsError: null,

    // generate
    generateLoading: false,
    generateError: null,
    results: null,         // { summary: {created, skipped, errors}, details: {...} }
  },

  reducers: {
    // Let the UI update local settings state optimistically
    updateSettingsField(state, action) {
      const { key, value } = action.payload;
      state.settings[key] = value;
    },
    clearResults(state) {
      state.results = null;
      state.generateError = null;
    },
    clearSettingsError(state) {
      state.settingsError = null;
    },
  },

  extraReducers: (builder) => {
    // ── fetchSettings
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.settingsLoading = true;
        state.settingsError = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        if (action.payload) state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.settingsError = action.payload;
      });

    // ── saveSettings
    builder
      .addCase(saveSettings.pending, (state) => {
        state.settingsSaving = true;
        state.settingsError = null;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.settingsSaving = false;
        if (action.payload) state.settings = action.payload;
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.settingsSaving = false;
        state.settingsError = action.payload;
      });

    // ── generateBills
    builder
      .addCase(generateBills.pending, (state) => {
        state.generateLoading = true;
        state.generateError = null;
        state.results = null;
      })
      .addCase(generateBills.fulfilled, (state, action) => {
        state.generateLoading = false;
        state.results = action.payload;
      })
      .addCase(generateBills.rejected, (state, action) => {
        state.generateLoading = false;
        state.generateError = action.payload;
      });
  },
});

export const { updateSettingsField, clearResults, clearSettingsError } =
  maintenanceBillingSlice.actions;

// ── SELECTORS ─────────────────────────────────────────────────────────────────
export const selectSettings        = (state) => state.maintenanceBilling.settings;
export const selectSettingsLoading = (state) => state.maintenanceBilling.settingsLoading;
export const selectSettingsSaving  = (state) => state.maintenanceBilling.settingsSaving;
export const selectSettingsError   = (state) => state.maintenanceBilling.settingsError;
export const selectGenerateLoading = (state) => state.maintenanceBilling.generateLoading;
export const selectGenerateError   = (state) => state.maintenanceBilling.generateError;
export const selectResults         = (state) => state.maintenanceBilling.results;

export default maintenanceBillingSlice.reducer;