import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const AddMaintenance = () => {
    const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Maintenance Data:", data);

    // TODO: Send to backend API using axios
    // axios.post("/api/maintenance", data)

    alert("Maintenance Added Successfully!");
    navigate("/maintenance/list")
    reset();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add Maintenance</h1>
        <p className="text-gray-500">Create monthly maintenance charge</p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* MONTH */}
          <div>
            <label className="block mb-2 font-medium">Month</label>
            <select
              {...register("month", { required: "Month is required" })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
            </select>
            {errors.month && (
              <p className="text-red-500 text-sm mt-1">
                {errors.month.message}
              </p>
            )}
          </div>

          {/* AMOUNT */}
          <div>
            <label className="block mb-2 font-medium">Amount (₹)</label>
            <input
              type="number"
              placeholder="Enter amount"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 1, message: "Amount must be greater than 0" },
              })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* DUE DATE */}
          <div>
            <label className="block mb-2 font-medium">Due Date</label>
            <input
              type="date"
              {...register("dueDate", {
                required: "Due date is required",
              })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dueDate.message}
              </p>
            )}
          </div>

          {/* LATE FEE */}
          <div>
            <label className="block mb-2 font-medium">
              Late Fee (Optional)
            </label>
            <input
              type="number"
              placeholder="Enter late fee"
              {...register("lateFee", {
                min: { value: 0, message: "Late fee cannot be negative" },
              })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.lateFee && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lateFee.message}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              rows="3"
              placeholder="Enter description (optional)"
              {...register("description")}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          {/* SUBMIT BUTTON */}
          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Maintenance
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddMaintenance;