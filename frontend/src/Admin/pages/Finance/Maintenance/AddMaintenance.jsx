import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createMaintenance } from "../../../../store/slices/maintenanceSlice";
import { fetchResidents } from "../../../../store/slices/residentSlice";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1];

const TABS = [
  { label: "Overview", path: "/admin/maintenance/dashboard", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label: "Records", path: "/admin/maintenance/list", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Add Bill", path: "/admin/maintenance/add", icon: "M12 4v16m8-8H4" },
  { label: "Generate", path: "/admin/maintenance/generate", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
];

const AddMaintenance = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();
  const { residents = [] } = useSelector((state) => state.resident);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { year: currentYear, month: MONTHS[new Date().getMonth()] },
  });

  useEffect(() => { dispatch(fetchResidents()); }, [dispatch]);

  const onSubmit = async (data) => {
    if (submitting) return;
    const selectedResident = residents.find((r) => r._id === data.resident);
    const flatId = selectedResident?.flat?._id || selectedResident?.flat;
    if (!flatId) { alert("Selected resident does not have an assigned flat."); return; }
    setSubmitting(true);
    const res = await dispatch(createMaintenance({ ...data, flat: flatId, amount: Number(data.amount), lateFee: Number(data.lateFee || 0), year: Number(data.year) }));
    setSubmitting(false);
    if (res.type.endsWith("fulfilled")) navigate("/admin/maintenance/list");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Maintenance</h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">Track society maintenance bills and collections.</p>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-6 w-fit flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${location.pathname === tab.path ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Card */}
      <div className="max-w-4xl">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Add Maintenance Bill</p>
              <p className="text-[11px] text-slate-400">All fields marked * are required</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            {/* Resident */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Resident *</label>
              <select {...register("resident", { required: "Resident is required" })} className={`admin-input ${errors.resident ? "admin-input-error" : ""}`}>
                <option value="">Select resident</option>
                {residents.map((r) => (
                  <option key={r._id} value={r._id}>{r.wing}-{r.flatNumber} | {r.firstName} {r.lastName}</option>
                ))}
              </select>
              {errors.resident && <p className="text-xs text-red-500 font-medium">{errors.resident.message}</p>}
            </div>

            {/* Month & Year */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Month</label>
                <select {...register("month")} className="admin-input">
                  {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Year</label>
                <select {...register("year")} className="admin-input">
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {/* Amount & Late Fee */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Amount (₹) *</label>
                <input type="number" placeholder="e.g. 2000" {...register("amount", { required: true })} className={`admin-input ${errors.amount ? "admin-input-error" : ""}`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Late Fee (₹)</label>
                <input type="number" placeholder="0" {...register("lateFee")} className="admin-input" />
              </div>
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Due Date *</label>
              <input type="date" {...register("dueDate", { required: true })} className={`admin-input ${errors.dueDate ? "admin-input-error" : ""}`} />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={() => navigate(-1)}
                className="admin-btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="admin-btn-primary disabled:opacity-60">
                {submitting ? (
                  <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Add Bill</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AddMaintenance;
