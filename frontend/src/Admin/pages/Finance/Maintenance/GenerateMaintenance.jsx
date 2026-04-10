import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchSettings,
  saveSettings,
  generateBills,
  updateSettingsField,
  clearResults,
  clearSettingsError,
  selectSettings,
  selectSettingsLoading,
  selectSettingsSaving,
  selectSettingsError,
  selectGenerateLoading,
  selectResults,
} from "../../../../store/slices/Maintenancebillingslice";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TABS = [
  { label: "Overview", path: "/admin/maintenance/dashboard", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label: "Records", path: "/admin/maintenance/list", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Generate", path: "/admin/maintenance/generate", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i);

export default function GenerateMaintenance() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const settings = useSelector(selectSettings);
  const settingsLoading = useSelector(selectSettingsLoading);
  const settingsSaving = useSelector(selectSettingsSaving);
  const settingsError = useSelector(selectSettingsError);
  const generateLoading = useSelector(selectGenerateLoading);
  const results = useSelector(selectResults);

  const [generate, setGenerate] = useState({
    month: MONTHS[new Date().getMonth()],
    year: currentYear,
  });

  useEffect(() => {
    dispatch(fetchSettings());
    return () => {
      dispatch(clearResults());
    };
  }, [dispatch]);

  useEffect(() => {
    if (settingsError) {
      toast.error(settingsError);
      dispatch(clearSettingsError());
    }
  }, [settingsError, dispatch]);

  function updateField(key, value) {
    dispatch(updateSettingsField({ key, value }));
  }

  async function handleSaveSettings(e) {
    e.preventDefault();
    const result = await dispatch(saveSettings(settings));
    if (saveSettings.fulfilled.match(result)) {
      toast.success("Settings saved successfully.");
    } else {
      toast.error(result.payload || "Failed to save settings.");
    }
  }

  async function handleGenerate() {
    const result = await dispatch(generateBills(generate));
    if (generateBills.rejected.match(result)) {
      toast.error(typeof result.payload === "string" ? result.payload : "Failed to generate bills.");
      return;
    }
    const { summary, message } = result.payload;
    const created = summary?.created ?? 0;
    const skipped = summary?.skipped ?? 0;
    const errors = summary?.errors ?? 0;
    if (created > 0) {
      toast.success(message || `${created} bill${created === 1 ? "" : "s"} generated.`);
    } else if (errors > 0) {
      toast.error(`No new bills created. ${errors} error${errors === 1 ? "" : "s"} — see details below.`);
    } else if (skipped > 0) {
      toast(`All ${skipped} resident${skipped === 1 ? "" : "s"} skipped (e.g. bill already exists or no flat).`, {
        type: "info",
      });
    } else {
      toast.info("No active residents found to bill.");
    }
  }

  if (settingsLoading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Maintenance</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Track society maintenance bills and collections.</p>
        </div>
        <div className="flex items-center justify-center h-48 text-slate-400 text-sm rounded-2xl border border-slate-200 bg-white">
          Loading billing settings…
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Maintenance</h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">Track society maintenance bills and collections.</p>
      </div>

      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-6 w-fit flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.path}
            type="button"
            onClick={() => navigate(tab.path)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              location.pathname === tab.path
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-6xl">
        {/* Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              ⚙
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Billing settings</p>
              <p className="text-[11px] text-slate-400">Due dates, late fees, and email options</p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="p-6 space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Due date (day of month)</label>
              <input
                type="number"
                min={1}
                max={28}
                value={settings.dueDays}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  updateField("dueDays", Number.isFinite(v) ? Math.min(28, Math.max(1, v)) : 1);
                }}
                className="admin-input mt-1.5"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Bills are due on the {settings.dueDays}
                {ordinal(settings.dueDays)} of each month.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Late fee type</label>
              <div className="flex gap-2 mt-1.5">
                {["none", "flat", "percent"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updateField("lateFeeType", t)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                      settings.lateFeeType === t
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    {t === "none" ? "None" : t === "flat" ? "Flat ₹" : "Percent %"}
                  </button>
                ))}
              </div>
            </div>

            {settings.lateFeeType === "flat" && (
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Late fee amount (₹)</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={settings.lateFeeAmount}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    updateField("lateFeeAmount", Number.isFinite(v) ? Math.max(0, v) : 0);
                  }}
                  className="admin-input mt-1.5"
                />
              </div>
            )}

            {settings.lateFeeType === "percent" && (
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Late fee (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={settings.lateFeePercent}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    updateField(
                      "lateFeePercent",
                      Number.isFinite(v) ? Math.min(100, Math.max(0, v)) : 0
                    );
                  }}
                  className="admin-input mt-1.5"
                />
              </div>
            )}

            <div className="space-y-3 pt-1 border-t border-slate-100">
              <ToggleRow
                label="Auto-generate bills on the 1st of each month"
                value={settings.autoGenerate}
                onChange={(v) => updateField("autoGenerate", v)}
              />
              <ToggleRow
                label="Send email when a bill is generated"
                value={settings.sendEmailOnGenerate}
                onChange={(v) => updateField("sendEmailOnGenerate", v)}
              />
              <ToggleRow
                label="Send overdue reminder email"
                value={settings.sendOverdueReminder}
                onChange={(v) => updateField("sendOverdueReminder", v)}
              />
            </div>

            {settings.sendOverdueReminder && (
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Reminder after (days past due)
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={settings.overdueReminderDays}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    updateField(
                      "overdueReminderDays",
                      Number.isFinite(v) ? Math.min(30, Math.max(1, v)) : 3
                    );
                  }}
                  className="admin-input mt-1.5"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={settingsSaving}
              className="admin-btn-primary w-full justify-center"
            >
              {settingsSaving ? "Saving…" : "Save settings"}
            </button>
          </form>
        </div>

        {/* Generate + results */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                ⚡
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Generate monthly bills</p>
                <p className="text-[11px] text-slate-400">One bill per active resident &amp; flat; skips duplicates</p>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-600 mb-5">
                Uses each flat&apos;s <span className="font-semibold text-slate-800">monthly maintenance</span> amount.
                Residents without a flat or with zero amount still get a bill of ₹0 unless you adjust flats first.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Month</label>
                  <select
                    value={generate.month}
                    onChange={(e) => setGenerate({ ...generate, month: e.target.value })}
                    className="admin-input mt-1.5"
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Year</label>
                  <select
                    value={generate.year}
                    onChange={(e) =>
                      setGenerate({ ...generate, year: parseInt(e.target.value, 10) })
                    }
                    className="admin-input mt-1.5"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={generateLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition disabled:opacity-60 disabled:pointer-events-none"
              >
                {generateLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>Generate for {generate.month} {generate.year}</>
                )}
              </button>
            </div>
          </div>

          {results && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-800">Last run</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{results.message}</p>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="Created" value={results.summary.created} tone="emerald" />
                  <StatCard label="Skipped" value={results.summary.skipped} tone="amber" />
                  <StatCard label="Errors" value={results.summary.errors} tone="red" />
                </div>

                {results.details.created?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Created bills
                    </p>
                    <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                      {results.details.created.map((c, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center text-sm bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2"
                        >
                          <span className="font-medium text-slate-700 truncate mr-2">
                            {c.flatNumber} — {c.resident}
                          </span>
                          <span className="text-emerald-800 font-bold whitespace-nowrap">
                            ₹{(c.amount ?? 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.details.skipped?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2">
                      Skipped
                    </p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs">
                      {results.details.skipped.map((s, i) => (
                        <div
                          key={i}
                          className="bg-amber-50 border border-amber-100 text-amber-900 rounded-lg px-3 py-2"
                        >
                          <span className="font-semibold">{s.flatNumber || s.resident || "—"}</span>
                          {s.reason ? `: ${s.reason}` : ""}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.details.errors?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-2">Errors</p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs">
                      {results.details.errors.map((errItem, i) => (
                        <div key={i} className="bg-red-50 border border-red-100 text-red-800 rounded-lg px-3 py-2">
                          <span className="font-semibold">
                            {errItem.flatNumber || errItem.resident || "Record"}
                          </span>
                          : {errItem.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 ">
      <span className="text-sm text-slate-600 leading-snug">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded shrink-0 transition-colors ${
          value ? "bg-blue-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ease-out ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function StatCard({ label, value, tone }) {
  const map = {
    emerald: "bg-emerald-50 text-emerald-800 border-emerald-100",
    amber: "bg-amber-50 text-amber-900 border-amber-100",
    red: "bg-red-50 text-red-800 border-red-100",
  };
  return (
    <div className={`rounded-xl p-3 text-center border ${map[tone]}`}>
      <div className="text-2xl font-black tabular-nums">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-wide opacity-90">{label}</div>
    </div>
  );
}

function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

