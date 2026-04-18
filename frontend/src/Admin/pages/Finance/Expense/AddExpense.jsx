import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createExpense } from "../../../../store/slices/expenseSlice";
import { fetchGuards } from "../../../../store/slices/guardSlice";

const TABS = [
  { label: "Overview",     path: "/admin/expense/dashboard" },
  { label: "All Expenses", path: "/admin/expense/list" },
  { label: "Add Expense",  path: "/admin/expense/add" },
  { label: "Reports",      path: "/admin/expense/report" },
];

const AddExpense = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();
  const { loading = false } = useSelector((s) => s.expense) ?? {};

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const selectedCategory = watch("category");

  const { guards = [] } = useSelector((s) => s.guard) ?? {};

  React.useEffect(() => {
    dispatch(fetchGuards());
  }, [dispatch]);

  const onGuardChange = (e) => {
    const guardId = e.target.value;
    if (!guardId) return;
    
    const selectedGuard = guards.find(g => g._id === guardId);
    if (selectedGuard) {
      const month = new Date().toLocaleString("default", { month: "long" });
      const year = new Date().getFullYear();
      setValue("title", `Salary for ${selectedGuard.name} - ${month} ${year}`);
      setValue("amount", selectedGuard.monthlySalary || 0);
      setValue("description", `Monthly salary for ${selectedGuard.name} (${selectedGuard.guardId})`);
    }
  };

  const onSubmit = async (data) => {
    const res = await dispatch(createExpense({ ...data, amount: Number(data.amount) }));
    if (res.type.endsWith("fulfilled")) { reset(); navigate("/admin/expense/list"); }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Expense</h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">Record and track society expenditures.</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Add New Expense</p>
              <p className="text-[11px] text-slate-400">All fields marked * are required</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">

            {/* Title */}
            <div className="admin-form-group">
              <label className="admin-label">Expense Title *</label>
              <input type="text" placeholder="e.g. Lift Repair, Electric Bill"
                {...register("title", { required: "Title is required", minLength: { value: 3, message: "Min 3 characters" } })}
                className={`admin-input ${errors.title ? "border-red-500" : ""}`} />
              {errors.title && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{errors.title.message}</p>}
            </div>

            {/* Category + Payment Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
              <div className="admin-form-group">
                <label className="admin-label">Category *</label>
                <select {...register("category", { required: "Category is required" })} className={`admin-input ${errors.category ? "border-red-500" : ""}`}>
                  <option value="">Select category</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Water">Water</option>
                  <option value="Salary">Salary</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Repair">Repair</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{errors.category.message}</p>}
              </div>

              {selectedCategory === "Salary" && (
                <div className="admin-form-group">
                  <label className="admin-label">Select Guard *</label>
                  <select onChange={onGuardChange} className="admin-input">
                    <option value="">Choose Guard</option>
                    {guards.map(g => (
                      <option key={g._id} value={g._id}>{g.name} ({g.guardId})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="admin-form-group">
                <label className="admin-label">Payment Mode *</label>
                <select {...register("paymentMode", { required: "Payment mode is required" })} className={`admin-input ${errors.paymentMode ? "border-red-500" : ""}`}>
                  <option value="">Select mode</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                </select>
                {errors.paymentMode && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{errors.paymentMode.message}</p>}
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Amount (₹) *</label>
                <input type="number" placeholder="e.g. 15000"
                  {...register("amount", { required: "Amount is required", min: { value: 1, message: "Must be > 0" } })}
                  className={`admin-input ${errors.amount ? "border-red-500" : ""}`} />
                {errors.amount && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{errors.amount.message}</p>}
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Expense Date *</label>
                <input type="date" {...register("date", { required: "Date is required" })} className={`admin-input ${errors.date ? "border-red-500" : ""}`} />
                {errors.date && <p className="text-[10px] text-red-500 font-bold uppercase mt-1">{errors.date.message}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="admin-form-group">
              <label className="admin-label">Description (Optional)</label>
              <textarea rows={3} placeholder="Additional details..."
                {...register("description")}
                className="admin-input resize-none" />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
              <button type="button" onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold text-sm hover:bg-gray-100 transition">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="admin-btn-primary">
                {loading ? "Saving..." : "Add Expense"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;