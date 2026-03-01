import React from "react";
import { useForm } from "react-hook-form";

const AddExpense = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Expense Data:", data);

    // TODO: Connect Backend API
    // axios.post("/api/expense", data)

    alert("Expense Added Successfully!");
    reset();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add Expense</h1>
        <p className="text-gray-500">Record new society expense</p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* TITLE */}
          <div>
            <label className="block mb-2 font-medium">Expense Title</label>
            <input
              type="text"
              placeholder="Enter expense title"
              {...register("title", {
                required: "Expense title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block mb-2 font-medium">Category</label>
            <select
              {...register("category", {
                required: "Category is required",
              })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Category</option>
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Salary">Salary</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
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
                min: {
                  value: 1,
                  message: "Amount must be greater than 0",
                },
              })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* EXPENSE DATE */}
          <div>
            <label className="block mb-2 font-medium">Expense Date</label>
            <input
              type="date"
              {...register("date", {
                required: "Expense date is required",
              })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* PAYMENT MODE */}
          <div>
            <label className="block mb-2 font-medium">Payment Mode</label>
            <select
              {...register("paymentMode", {
                required: "Payment mode is required",
              })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Payment Mode</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
            {errors.paymentMode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.paymentMode.message}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block mb-2 font-medium">Description (Optional)</label>
            <textarea
              rows="3"
              placeholder="Enter additional details"
              {...register("description")}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          {/* SUBMIT BUTTON */}
          <div>
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Add Expense
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddExpense;