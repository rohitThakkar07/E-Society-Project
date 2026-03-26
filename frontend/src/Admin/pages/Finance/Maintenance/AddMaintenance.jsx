import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createMaintenance } from "../../../../store/slices/maintainenceSlice";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1];

const AddMaintenance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [residents, setResidents] = useState([]);
  const [submitting, setSubmitting] = useState(false); // ✅ local state

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      year: currentYear,
      month: MONTHS[new Date().getMonth()], // ✅ auto month
    },
  });

  // 🔹 Fetch residents
  useEffect(() => {
    const load = async () => {
      try {
        const { default: API } = await import("../../../../service/api");
        const res = await API.get("/resident/list");
        setResidents(res.data.data || []);
      } catch {
        setResidents([]);
      }
    };
    load();
  }, []);

  // 🔹 Submit
  const onSubmit = async (data) => {
    if (submitting) return; // prevent double click

    if (!data.resident || !data.month || !data.year) return;

    setSubmitting(true);

    const res = await dispatch(
      createMaintenance({
        ...data,
        amount: Number(data.amount),
        lateFee: Number(data.lateFee || 0),
        year: Number(data.year),
      })
    );

    setSubmitting(false);

    if (res.meta.requestStatus === "fulfilled") {
      reset();
      navigate("/admin/maintenance/list");
    }
  };

  const inputClass = (err) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
      err ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
    }`;

  const labelClass =
    "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  const ErrMsg = ({ e }) =>
    e ? <p className="mt-1 text-xs text-red-500">{e.message}</p> : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-start justify-center">
      <div className="w-full max-w-2xl">

        {/* HEADER */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4"
          >
            ← Back
          </button>

          <h1 className="text-xl font-bold text-gray-900">
            Add Maintenance
          </h1>
          <p className="text-sm text-gray-400">
            Create a monthly maintenance charge for a resident
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400" />

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 md:p-8 space-y-6"
          >

            {/* Resident */}
            <div>
              <label className={labelClass}>Resident *</label>
              <select
                {...register("resident", {
                  required: "Please select a resident",
                })}
                className={inputClass(errors.resident)}
              >
                <option value="">Select resident</option>
                {residents.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.flatNumber} — {r.firstName} {r.lastName || ""}
                  </option>
                ))}
              </select>
              <ErrMsg e={errors.resident} />
            </div>

            {/* Month + Year */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Month *</label>
                <select
                  {...register("month", {
                    required: "Month is required",
                  })}
                  className={inputClass(errors.month)}
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <ErrMsg e={errors.month} />
              </div>

              <div>
                <label className={labelClass}>Year *</label>
                <select
                  {...register("year", {
                    required: "Year is required",
                  })}
                  className={inputClass(errors.year)}
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <ErrMsg e={errors.year} />
              </div>
            </div>

            {/* Amount + Late Fee */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Amount (₹) *</label>
                <input
                  type="number"
                  placeholder="e.g. 2000"
                  {...register("amount", {
                    required: "Amount is required",
                    min: { value: 1, message: "Must be > 0" },
                  })}
                  className={inputClass(errors.amount)}
                />
                <ErrMsg e={errors.amount} />
              </div>

              <div>
                <label className={labelClass}>Late Fee (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  {...register("lateFee", {
                    min: { value: 0, message: "Cannot be negative" },
                  })}
                  className={inputClass(errors.lateFee)}
                />
                <ErrMsg e={errors.lateFee} />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className={labelClass}>Due Date *</label>
              <input
                type="date"
                {...register("dueDate", {
                  required: "Due date is required",
                })}
                className={inputClass(errors.dueDate)}
              />
              <ErrMsg e={errors.dueDate} />
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows={3}
                placeholder="Optional notes..."
                {...register("description")}
                className={`${inputClass(false)} resize-none`}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg"
              >
                Add Maintenance
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMaintenance;
