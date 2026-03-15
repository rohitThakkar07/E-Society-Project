import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddGuard = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
  setIsLoading(true);

  try {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "idImage" && data[key].length > 0) {
        formData.append(key, data[key][0]);
      } else if (data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    const response = await axios.post(
      "http://localhost:4000/api/guard/create",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    // ✅ Handle success & backend errors
    if (response.data.success) {
      toast.success(response.data.message || "Guard registered successfully");
      reset();
      navigate("/guards");
    } else {
      toast.error(response.data.message || "Something went wrong");
    }

  } catch (error) {
    console.error("Error adding guard:", error);

    toast.error(
      error.response?.data?.message ||
      error.message ||
      "Server Error"
    );
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8 border border-gray-100">

        <div className="mb-8 border-b pb-4">
          <h2 className="text-3xl font-extrabold text-gray-800">Add New Guard</h2>
          <p className="text-gray-500 mt-1">Register a new security personnel into the system.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* --- Section 1: Personal Details --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full inline-flex justify-center items-center mr-2 text-sm">1</span>
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                <input
                  {...register("firstName", { required: "First name is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="e.g. Ramesh"
                />
                {errors.firstName && <span className="text-xs text-red-500">{errors.firstName.message}</span>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                <input
                  {...register("lastName", { required: "Last name is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="e.g. Singh"
                />
                {errors.lastName && <span className="text-xs text-red-500">{errors.lastName.message}</span>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">City <span className="text-red-500">*</span></label>
                <input
                  {...register("city", { required: "City is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="e.g. Mumbai"
                />
                {errors.city && <span className="text-xs text-red-500">{errors.city.message}</span>}
              </div>
            </div>
          </div>

          {/* --- Section 2: Contact Information --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full inline-flex justify-center items-center mr-2 text-sm">2</span>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  {...register("mobileNumber", {
                    required: "Mobile number is required",
                    pattern: { value: /^[0-9]{10}$/, message: "Must be exactly 10 digits" }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="10-digit number"
                />
                {errors.mobileNumber && <span className="text-xs text-red-500">{errors.mobileNumber.message}</span>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Alternative Number</label>
                <input
                  type="tel"
                  {...register("alternativeNumber")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  {...register("emailAddress")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="e.g. guard@example.com"
                />
              </div>
            </div>
          </div>

          {/* --- Section 3: Identity & Employment --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full inline-flex justify-center items-center mr-2 text-sm">3</span>
              Identity & Employment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* <div>
                <label className="text-sm font-medium text-gray-700">Contractor/Agency <span className="text-red-500">*</span></label>
                <input
                  {...register("contractor", { required: "Contractor is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Agency Name or ID"
                />
                {errors.contractor && <span className="text-xs text-red-500">{errors.contractor.message}</span>}
              </div> */}

              <div>
                <label className="text-sm font-medium text-gray-700">Shift <span className="text-red-500">*</span></label>
                <select
                  {...register("shift", { required: "Shift is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
                >
                  <option value="">Select Shift</option>
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                </select>
                {errors.shift && <span className="text-xs text-red-500">{errors.shift.message}</span>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">ID Type <span className="text-red-500">*</span></label>
                <select
                  {...register("idType", { required: "ID Type is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
                >
                  <option value="">Select ID</option>
                  <option value="Aadhar Card">Aadhar Card</option>
                
                </select>
                {errors.idType && <span className="text-xs text-red-500">{errors.idType.message}</span>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">ID Number <span className="text-red-500">*</span></label>
                <input
                  {...register("idNumber", { required: "ID Number is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Enter ID number"
                />
                {errors.idNumber && <span className="text-xs text-red-500">{errors.idNumber.message}</span>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Upload ID Image</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("idImage")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {errors.idImage && <span className="text-xs text-red-500">{errors.idImage.message}</span>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Joining Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  {...register("joiningDate", { required: "Joining date is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
                {errors.joiningDate && <span className="text-xs text-red-500">{errors.joiningDate.message}</span>}
              </div>

              {/* --- Password Field --- */}
              <div>
                <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Create a login password"
                />
                {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  {...register("status")}
                  defaultValue="Active"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

            </div>
          </div>

          {/* --- Submit Button --- */}
          <div className="pt-6 border-t mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-3 rounded-lg text-white font-semibold text-lg transition-all shadow-md 
                ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Guard...
                </span>
              ) : (
                "Save Guard Record"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddGuard;