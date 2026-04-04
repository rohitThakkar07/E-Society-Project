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
  { label: "Overview",   path: "/admin/maintenance/dashboard" },
  { label: "Records",    path: "/admin/maintenance/list" },
  { label: "Add Bill",   path: "/admin/maintenance/add" },
  { label: "Generate",   path: "/admin/maintenance/generate" },
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
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Maintenance</h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">Track society maintenance bills and collections.</p>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-6 w-fit flex-wrap">
        {TABS.map((tab) => (
          <button key={tab.path} onClick={() => navigate(tab.path)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${location.pathname === tab.path ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Card */}
      <div className="max-w-2xl">
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
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2">
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
  );
};

export default AddMaintenance;