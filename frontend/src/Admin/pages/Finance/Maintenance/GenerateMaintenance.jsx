import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchSettings,
  saveSettings,
  generateBills,
  updateSettingsField,
  clearResults,
  selectSettings,
  selectSettingsLoading,
  selectSettingsSaving,
  selectGenerateLoading,
  selectGenerateError,
  selectResults,
} from "../../../../store/slices/Maintenancebillingslice";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i);

export default function GenerateMaintenance() {
  const dispatch = useDispatch();

  const settings        = useSelector(selectSettings);
  const settingsLoading = useSelector(selectSettingsLoading);
  const settingsSaving  = useSelector(selectSettingsSaving);
  const generateLoading = useSelector(selectGenerateLoading);
  const generateError   = useSelector(selectGenerateError);
  const results         = useSelector(selectResults);

  const [generate, setGenerate] = useState({
    month: MONTHS[new Date().getMonth()],
    year: currentYear,
  });

  // Load settings on mount
  useEffect(() => {
    dispatch(fetchSettings());
    return () => { dispatch(clearResults()); };
  }, [dispatch]);

  // Show generate error as toast
  useEffect(() => {
    if (generateError) toast.error(generateError);
  }, [generateError]);

  // Helper to update a single settings field
  function updateField(key, value) {
    dispatch(updateSettingsField({ key, value }));
  }

  async function handleSaveSettings(e) {
    e.preventDefault();
    const result = await dispatch(saveSettings(settings));
    if (saveSettings.fulfilled.match(result)) {
      toast.success("Settings saved!");
    } else {
      toast.error(result.payload || "Failed to save settings");
    }
  }

  async function handleGenerate() {
    const result = await dispatch(generateBills(generate));
    if (generateBills.fulfilled.match(result)) {
      toast.success(`${result.payload.summary.created} bills generated!`);
    }
  }

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Maintenance Billing</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Configure auto-billing settings and generate monthly maintenance bills
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Settings Panel ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">⚙️</span>
            Billing Settings
          </h2>

          <form onSubmit={handleSaveSettings} className="space-y-5">

            {/* Due Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date (day of month)
              </label>
              <input
                type="number"
                min="1"
                max="28"
                value={settings.dueDays}
                onChange={e => updateField("dueDays", parseInt(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Bills will be due on the {settings.dueDays}{ordinal(settings.dueDays)} of every month
              </p>
            </div>

            {/* Late Fee Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Late Fee Type</label>
              <div className="flex gap-3">
                {["none", "flat", "percent"].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updateField("lateFeeType", t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                      settings.lateFeeType === t
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    {t === "none" ? "None" : t === "flat" ? "Flat ₹" : "Percent %"}
                  </button>
                ))}
              </div>
            </div>

            {settings.lateFeeType === "flat" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Late Fee Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={settings.lateFeeAmount}
                  onChange={e => updateField("lateFeeAmount", parseFloat(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {settings.lateFeeType === "percent" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Late Fee (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={settings.lateFeePercent}
                  onChange={e => updateField("lateFeePercent", parseFloat(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Toggles */}
            <div className="space-y-3 pt-2">
              <ToggleRow
                label="Auto-generate bills on 1st of each month"
                value={settings.autoGenerate}
                onChange={v => updateField("autoGenerate", v)}
              />
              <ToggleRow
                label="Send email when bill is generated"
                value={settings.sendEmailOnGenerate}
                onChange={v => updateField("sendEmailOnGenerate", v)}
              />
              <ToggleRow
                label="Send overdue reminder email"
                value={settings.sendOverdueReminder}
                onChange={v => updateField("sendOverdueReminder", v)}
              />
            </div>

            {settings.sendOverdueReminder && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Send reminder after (days past due)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.overdueReminderDays}
                  onChange={e => updateField("overdueReminderDays", parseInt(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={settingsSaving}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {settingsSaving ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>

        {/* ── Generate Bills Panel ── */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-sm">📋</span>
              Generate Monthly Bills
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Generates bills for all active residents based on their flat's monthly maintenance amount. Skips already generated bills.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  value={generate.month}
                  onChange={e => setGenerate({ ...generate, month: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {MONTHS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={generate.year}
                  onChange={e => setGenerate({ ...generate, year: parseInt(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {years.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generateLoading}
              className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {generateLoading ? (
                <><span className="animate-spin">⟳</span> Generating...</>
              ) : (
                <><span>⚡</span> Generate Bills for {generate.month} {generate.year}</>
              )}
            </button>
          </div>

          {/* Results */}
          {results && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Generation Results</h3>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <StatCard label="Created" value={results.summary.created} color="green" />
                <StatCard label="Skipped" value={results.summary.skipped} color="yellow" />
                <StatCard label="Errors"  value={results.summary.errors}  color="red"   />
              </div>

              {results.details.created.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Created Bills</p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {results.details.created.map((c, i) => (
                      <div key={i} className="flex justify-between items-center text-sm bg-green-50 rounded-lg px-3 py-2">
                        <span className="font-medium text-gray-700">{c.flatNumber} — {c.resident}</span>
                        <span className="text-green-700 font-semibold">₹{c.amount?.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.details.errors.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-red-500 uppercase tracking-wide mb-2">Errors</p>
                  {results.details.errors.map((e, i) => (
                    <div key={i} className="text-xs text-red-600 bg-red-50 rounded px-3 py-2">
                      {e.flatNumber}: {e.error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components (unchanged) ────────────────────────────────────────────────

function ToggleRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative ${value ? "bg-blue-600" : "bg-gray-200"}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${value ? "left-5.5 translate-x-0.5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    green:  "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red:    "bg-red-50 text-red-700",
  };
  return (
    <div className={`${colors[color]} rounded-lg p-3 text-center`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium">{label}</div>
    </div>
  );
}

function ordinal(n) {
  const s = ["th","st","nd","rd"], v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}