import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const AddResident = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Resident Data:", data);

    // TODO: Replace with API call
    // await axios.post("/api/residents", data);

    alert("Resident Added Successfully");
    reset();
    navigate("/residents");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Add New Resident
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block mb-1 font-medium">Full Name *</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Unit / Flat */}
          <div>
            <label className="block mb-1 font-medium">Unit / Flat No *</label>
            <input
              type="text"
              {...register("unit", { required: "Unit number is required" })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Example: A-101"
            />
            {errors.unit && (
              <p className="text-red-500 text-sm mt-1">
                {errors.unit.message}
              </p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="block mb-1 font-medium">Contact Number *</label>
            <input
              type="tel"
              {...register("contact", {
                required: "Contact number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter valid 10-digit number",
                },
              })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Enter mobile number"
            />
            {errors.contact && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contact.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email *</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Resident Type */}
          <div>
            <label className="block mb-1 font-medium">Resident Type *</label>
            <select
              {...register("type", { required: "Please select resident type" })}
              className="w-full border px-4 py-2 rounded-lg"
            >
              <option value="">Select Type</option>
              <option value="Owner">Owner</option>
              <option value="Tenant">Tenant</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password *</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Create password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Resident
            </button>

            <button
              type="button"
              onClick={() => navigate("/residents")}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddResident;