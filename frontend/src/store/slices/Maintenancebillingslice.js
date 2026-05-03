import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../src/service/api";

const DEFAULT_SETTINGS = {
  dueDays: 10,
  gracePeriodDays: 5,
  lateFeeType: "none",
  lateFeeAmount: 0,
  lateFeePercent: 0,
  // Escalation
  escalation1Enabled: false,
  escalation1Days: 15,
  escalation1Type: "none",
  escalation1Amount: 0,
  escalation1Percent: 0,
  escalation2Enabled: false,
  escalation2Days: 30,
  escalation3Enabled: false,
  escalation3Days: 60,
  // Restrictions
  blockFacilityOnOverdue: false,
  // Pre-due reminders
  sendPreDueReminders: false,
  preDueReminderDays: [7, 2],
  // Auto-generate
  autoGenerate: false,
  // Email
  sendEmailOnGenerate: true,
  sendOverdueReminder: true,
  overdueReminderDays: 3,
};

/** Merge API document into form state (avoids NaN / missing keys from older DB docs). */
function normalizeSettingsFromApi(raw) {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_SETTINGS };
  const n = (v, fallback) => {
    const x = Number(v);
    return Number.isFinite(x) ? x : fallback;
  };
  return {
    ...DEFAULT_SETTINGS,
    dueDays: Math.min(28, Math.max(1, n(raw.dueDays, 10))),
    gracePeriodDays: Math.min(30, Math.max(0, n(raw.gracePeriodDays, 5))),
    lateFeeType: ["none", "flat", "percent"].includes(raw.lateFeeType) ? raw.lateFeeType : "none",
    lateFeeAmount:  Math.max(0, n(raw.lateFeeAmount, 0)),
    lateFeePercent: Math.min(100, Math.max(0, n(raw.lateFeePercent, 0))),
    // Escalation
    escalation1Enabled: Boolean(raw.escalation1Enabled),
    escalation1Days:    Math.max(1, n(raw.escalation1Days, 15)),
    escalation1Type:    ["none", "flat", "percent"].includes(raw.escalation1Type) ? raw.escalation1Type : "none",
    escalation1Amount:  Math.max(0, n(raw.escalation1Amount, 0)),
    escalation1Percent: Math.min(100, Math.max(0, n(raw.escalation1Percent, 0))),
    escalation2Enabled: Boolean(raw.escalation2Enabled),
    escalation2Days:    Math.max(1, n(raw.escalation2Days, 30)),
    escalation3Enabled: Boolean(raw.escalation3Enabled),
    escalation3Days:    Math.max(1, n(raw.escalation3Days, 60)),
    // Restrictions
    blockFacilityOnOverdue: Boolean(raw.blockFacilityOnOverdue),
    // Pre-due reminders
    sendPreDueReminders: Boolean(raw.sendPreDueReminders),
    preDueReminderDays: Array.isArray(raw.preDueReminderDays) ? raw.preDueReminderDays : [7, 2],
    // Auto-generate
    autoGenerate: Boolean(raw.autoGenerate),
    // Email
    sendEmailOnGenerate: raw.sendEmailOnGenerate !== false,
    sendOverdueReminder: raw.sendOverdueReminder !== false,
    overdueReminderDays: Math.min(30, Math.max(1, n(raw.overdueReminderDays, 3))),
  };
}

function payloadForSave(settings) {
  const s = settings || {};
  return {
    dueDays: s.dueDays,
    gracePeriodDays: s.gracePeriodDays,
    lateFeeType: s.lateFeeType,
    lateFeeAmount: s.lateFeeAmount,
    lateFeePercent: s.lateFeePercent,
    escalation1Enabled: s.escalation1Enabled,
    escalation1Days: s.escalation1Days,
    escalation1Type: s.escalation1Type,
    escalation1Amount: s.escalation1Amount,
    escalation1Percent: s.escalation1Percent,
    escalation2Enabled: s.escalation2Enabled,
    escalation2Days: s.escalation2Days,
    escalation3Enabled: s.escalation3Enabled,
    escalation3Days: s.escalation3Days,
    blockFacilityOnOverdue: s.blockFacilityOnOverdue,
    sendPreDueReminders: s.sendPreDueReminders,
    preDueReminderDays: s.preDueReminderDays,
    autoGenerate: s.autoGenerate,
    sendEmailOnGenerate: s.sendEmailOnGenerate,
    sendOverdueReminder: s.sendOverdueReminder,
    overdueReminderDays: s.overdueReminderDays,
  };
}

// ── THUNKS ────────────────────────────────────────────────────────────────────

export const fetchSettings = createAsyncThunk(
  "maintenanceBilling/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/maintenance/settings");
      return normalizeSettingsFromApi(res.data.data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to load settings"
      );
    }
  }
);

export const saveSettings = createAsyncThunk(
  "maintenanceBilling/saveSettings",
  async (settings, { rejectWithValue }) => {
    try {
      const res = await api.put("/maintenance/settings", payloadForSave(settings));
      return normalizeSettingsFromApi(res.data.data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to save settings"
      );
    }
  }
);

const GENERATE_TIMEOUT_MS = 180000; // bulk create + optional emails can exceed 10s easily

export const generateBills = createAsyncThunk(
  "maintenanceBilling/generateBills",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const res = await api.post(
        "/maintenance/generate",
        { month, year },
        { timeout: GENERATE_TIMEOUT_MS }
      );
      const d = res.data || {};
      return {
        success: d.success !== false,
        message: d.message || "Generation complete",
        summary: {
          created: Number(d.summary?.created) || 0,
          skipped: Number(d.summary?.skipped) || 0,
          errors: Number(d.summary?.errors) || 0,
        },
        details: {
          created: Array.isArray(d.details?.created) ? d.details.created : [],
          skipped: Array.isArray(d.details?.skipped) ? d.details.skipped : [],
          errors: Array.isArray(d.details?.errors) ? d.details.errors : [],
        },
      };
    } catch (err) {
      const aborted =
        err.code === "ECONNABORTED" ||
        /timeout/i.test(String(err.message || ""));
      if (aborted) {
        return rejectWithValue(
          "Generation is taking longer than usual. Check Maintenance → Records in a moment — bills may still have been created."
        );
      }
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to generate bills"
      );
    }
  }
);

// ── SLICE ─────────────────────────────────────────────────────────────────────

const maintenanceBillingSlice = createSlice({
  name: "maintenanceBilling",
  initialState: {
    // settings
    settings: { ...DEFAULT_SETTINGS },
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
        if (action.payload) state.settings = { ...DEFAULT_SETTINGS, ...action.payload };
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
        if (action.payload) state.settings = { ...DEFAULT_SETTINGS, ...action.payload };
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