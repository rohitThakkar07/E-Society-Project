import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createMaintenance } from "../../../../store/slices/maintenanceSlice";
import { fetchResidents } from "../../../../store/slices/residentSlice";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1];

const AddMaintenance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get residents from Redux (Ensure they are populated with flat details)
  const { residents = [] } = useSelector((state) => state.resident);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: { year: currentYear, month: MONTHS[new Date().getMonth()] },
  });

  useEffect(() => {
    dispatch(fetchResidents());
  }, [dispatch]);

  const onSubmit = async (data) => {
  if (submitting) return;

  const selectedResident = residents.find(r => r._id === data.resident);
  
  // Debugging: See what's inside the resident object
  console.log("Selected Resident Info:", selectedResident);

  // Use optional chaining to find the ID whether it's populated or not
  const flatId = selectedResident?.flat?._id || selectedResident?.flat;

  if (!flatId) {
    alert("Selected resident does not have an assigned flat in the database.");
    return;
  }

  setSubmitting(true);
  const res = await dispatch(
    createMaintenance({
      ...data,
      flat: flatId, // Send the extracted ID
      amount: Number(data.amount),
      lateFee: Number(data.lateFee || 0),
      year: Number(data.year),
    })
  );
  setSubmitting(false);

  if (res.type.endsWith("fulfilled")) {
    navigate("/admin/maintenance/list");
  }
};
  const inputClass = (err) => `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${err ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"}`;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Add Maintenance Charge</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Resident *</label>
              <select {...register("resident", { required: "Required" })} className={inputClass(errors.resident)}>
                <option value="">Select resident</option>
                {residents.map((r) => (
                  <option key={r._id} value={r._id}>{r.wing}-{r.flatNumber} | {r.firstName} {r.lastName}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Month</label>
                <select {...register("month")} className={inputClass(false)}>
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Year</label>
                <select {...register("year")} className={inputClass(false)}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Amount (₹) *</label>
                <input type="number" {...register("amount", { required: true })} className={inputClass(errors.amount)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Late Fee (₹)</label>
                <input type="number" {...register("lateFee")} className={inputClass(false)} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Due Date *</label>
              <input type="date" {...register("dueDate", { required: true })} className={inputClass(errors.dueDate)} />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 text-sm text-gray-500 bg-gray-100 rounded-lg">Cancel</button>
              <button type="submit" disabled={submitting} className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg">
                {submitting ? "Saving..." : "Add Maintenance"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMaintenance;