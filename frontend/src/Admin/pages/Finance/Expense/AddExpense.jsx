import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createExpense } from "../../../../store/slices/expenseSlice";

const AddExpense = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const expenseState = useSelector((s) => s.expense) ?? {};
  const { loading = false } = expenseState;

  const {
    register, handleSubmit, reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await dispatch(createExpense({
      ...data,
      amount: Number(data.amount),
    }));
    if (res.type.endsWith("fulfilled")) {
      reset();
      navigate("/admin/expense/list");
    }
  };

  const inputClass = (err) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition focus:ring-2 focus:ring-red-400 ${err ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
    }`;
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
  const ErrMsg = ({ e }) => e
    ? <p className="mt-1 text-xs text-red-500">{e.message}</p>
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-start justify-center">
      <div className="w-full max-w-2xl">

        {/* HEADER */}
        <div className="mb-8">
          <button type="button" onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              {/* // Inside the button in AddExpense.jsx */}
              {/* <button 
  type="submit" 
  disabled={loading} // Prevent double submissions
  className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-lg flex items-center gap-2"
>
  {loading ? (
    <>
      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      Saving...
    </>
  ) : "Add Expense"}
</button> */}
              <h1 className="text-xl font-bold text-gray-900">Add Expense</h1>
              <p className="text-sm text-gray-400">Record a new society expense</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-red-600 to-red-400" />

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">

            {/* Title */}
            <div>
              <label className={labelClass}>Expense Title *</label>
              <input
                type="text"
                placeholder="e.g. Lift Repair, Electric Bill"
                {...register("title", {
                  required: "Expense title is required",
                  minLength: { value: 3, message: "Min 3 characters" },
                })}
                className={inputClass(errors.title)}
              />
              <ErrMsg e={errors.title} />
            </div>

            {/* Category + Payment Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category *</label>
                <select
                  {...register("category", { required: "Category is required" })}
                  className={inputClass(errors.category)}
                >
                  <option value="">Select category</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Water">Water</option>
                  <option value="Salary">Salary</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other</option>
                </select>
                <ErrMsg e={errors.category} />
              </div>
              <div>
                <label className={labelClass}>Payment Mode *</label>
                <select
                  {...register("paymentMode", { required: "Payment mode is required" })}
                  className={inputClass(errors.paymentMode)}
                >
                  <option value="">Select mode</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
                <ErrMsg e={errors.paymentMode} />
              </div>
            </div>

            {/* Amount + Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Amount (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  {...register("amount", {
                    required: "Amount is required",
                    min: { value: 1, message: "Must be > 0" },
                  })}
                  className={inputClass(errors.amount)}
                />
                <ErrMsg e={errors.amount} />
              </div>
              <div>
                <label className={labelClass}>Expense Date *</label>
                <input
                  type="date"
                  {...register("date", { required: "Date is required" })}
                  className={inputClass(errors.date)}
                />
                <ErrMsg e={errors.date} />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Description (Optional)</label>
              <textarea
                rows={3}
                placeholder="Additional details..."
                {...register("description")}
                className={`${inputClass(false)} resize-none`}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => navigate(-1)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-lg flex items-center gap-2">
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving...
                  </>
                ) : "Add Expense"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;