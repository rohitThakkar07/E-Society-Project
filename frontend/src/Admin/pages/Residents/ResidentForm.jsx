// components/ResidentForm.jsx (Updated for Minimal Slice)
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResidentById,
  createResident,
  updateResident,
} from "../../../store/slices/residentSlice";

const ResidentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = Boolean(id);

  // Redux state
  const { singleResident, loading } = useSelector((state) => state.resident);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { status: "Active", residentType: "Owner", flatType: "1BHK" },
  });

  // Fetch resident data if editing
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchResidentById(id));
    }
  }, [id, isEditMode, dispatch]);

  // Populate form when singleResident is fetched
  useEffect(() => {
    if (singleResident) {
      const formData = {
        ...singleResident,
        dateOfBirth: singleResident.dateOfBirth
          ? singleResident.dateOfBirth.split("T")[0]
          : "",
        moveInDate: singleResident.moveInDate
          ? singleResident.moveInDate.split("T")[0]
          : "",
      };
      reset(formData);
    }
  }, [singleResident, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      floorNumber: parseInt(data.floorNumber || 0, 10),
    };

    if (isEditMode) {
      const result = await dispatch(updateResident({ id, formData: formattedData }));
      if (result.type.endsWith('fulfilled')) {
        setTimeout(() => navigate("/admin/residents"), 1500);
      }
    } else {
      const result = await dispatch(createResident(formattedData));
      if (result.type.endsWith('fulfilled')) {
        setTimeout(() => navigate("/admin/residents"), 1500);
      }
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading resident data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8">
        <div className="mb-8 border-b pb-4">
          <h2 className="text-3xl font-extrabold text-gray-800">
            {isEditMode ? "Edit Resident" : "Add New Resident"}
          </h2>
          <p className="text-gray-500 mt-1">
            {isEditMode
              ? "Update resident information in the system."
              : "Register a new resident into the society."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* --- Personal Details --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="e.g. Rahul"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="e.g. Sharma"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("gender", {
                    required: "Gender is required",
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 bg-white outline-none transition"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register("dateOfBirth")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* --- Contact Information --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register("mobileNumber", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Must be exactly 10 digits",
                    },
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="10-digit number"
                />
                {errors.mobileNumber && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="e.g. rahul@example.com"
                />
              </div>
            </div>
          </div>

          {/* --- Flat Details --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Flat Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Wing <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("wing", { required: "Wing is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. A"
                />
                {errors.wing && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.wing.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Flat No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("flatNumber", {
                    required: "Flat number is required",
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. 203"
                />
                {errors.flatNumber && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.flatNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Flat Type
                </label>
                <select
                  {...register("flatType")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="4BHK">4BHK</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Floor Number
                </label>
                <input
                  type="number"
                  {...register("floorNumber")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. 9"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Move In Date
                </label>
                <input
                  type="date"
                  {...register("moveInDate")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Resident Type
                </label>
                <select
                  {...register("residentType")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Owner">Owner</option>
                  <option value="Tenant">Tenant</option>
                </select>
              </div>
            </div>
          </div>

          {/* --- Emergency Contact & Security --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Emergency Contact & Security
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Contact Name
                </label>
                <input
                  {...register("emergencyContactName")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="Name of relative"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="tel"
                  {...register("emergencyContactNumber")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="Relative's 10-digit number"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Password {!isEditMode && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: isEditMode ? false : "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder={
                    isEditMode
                      ? "Leave empty to keep current password"
                      : "Enter Password"
                  }
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  {...register("status")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* --- Submit Buttons --- */}
          <div className="pt-6 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 rounded-lg text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg text-white font-semibold text-lg transition-all shadow-md 
                ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
                }`}
            >
              {loading
                ? "Saving Resident..."
                : isEditMode
                ? "Update Resident"
                : "Save Resident"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResidentForm;