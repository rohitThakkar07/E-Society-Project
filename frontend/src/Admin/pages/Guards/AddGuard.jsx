// pages/AddGuard.jsx (Updated with Redux)
import React from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createGuard, updateGuard, fetchGuardById, clearSingleGuard } from "../../../store/slices/guardSlice";
import { useEffect } from "react";

const AddGuard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = Boolean(id);

  const { singleGuard, loading } = useSelector((state) => state.guard);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: { status: "Active" },
  });

  // Clear singleGuard when leaving the page to prevent stale prefill
  useEffect(() => {
    return () => { dispatch(clearSingleGuard()); };
  }, [dispatch]);

  // Fetch guard data if editing
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchGuardById(id));
    }
  }, [id, isEditMode, dispatch]);

  // Populate form when singleGuard is fetched
  // API response fields: name, email, idProofType, idProofNumber, mobileNumber, joiningDate, shift, city, status
  useEffect(() => {
    if (singleGuard && isEditMode) {
      // API stores full name in 'name' field (not 'fullName')
      const nameParts = (singleGuard.name || "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName  = nameParts.slice(1).join(" ") || "";

      reset({
        firstName,
        lastName,
        mobileNumber:      singleGuard.mobileNumber      || "",
        alternativeNumber: singleGuard.alternativeNumber  || "",
        emailAddress:      singleGuard.email              || "",   // API field: 'email'
        city:              singleGuard.city               || "",
        shift:             singleGuard.shift              || "",
        idType:            singleGuard.idProofType        || "",   // API field: 'idProofType'
        idNumber:          singleGuard.idProofNumber      || "",   // API field: 'idProofNumber'
        joiningDate:       singleGuard.joiningDate
          ? singleGuard.joiningDate.split("T")[0]
          : "",
        status:            singleGuard.status             || "Active",
      });
    }
  }, [singleGuard, reset, isEditMode]);

  const onSubmit = async (data) => {

    data.fullName = `${data.firstName} ${data.lastName}`;
    const formData = new FormData();
    for (const key in data) {
      if (key === "idImage" && data[key]?.length > 0) {
        formData.append("idImage", data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    }

    if (isEditMode) {
      const result = await dispatch(updateGuard({ id, formData }));
      if (result.type.endsWith('fulfilled')) {
        setTimeout(() => navigate("/admin/guards"), 1500);
      }
    } else {
      const result = await dispatch(createGuard(formData));
      if (result.type.endsWith('fulfilled')) {
        reset();
        setTimeout(() => navigate("/admin/guards"), 1500);
      }
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading guard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="mb-8 border-b pb-4">
          <h2 className="text-3xl font-extrabold text-gray-800">
            {isEditMode ? "Edit Guard" : "Add New Guard"}
          </h2>
          <p className="text-gray-500 mt-1">
            {isEditMode
              ? "Update security personnel information."
              : "Register a new security personnel into the system."}
          </p>
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

              <div>
                <label className="text-sm font-medium text-gray-700">Password {!isEditMode && <span className="text-red-500">*</span>}</label>
                <input
                  type="password"
                  {...register("password", {
                    required: isEditMode ? false : "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder={isEditMode ? "Leave empty to keep current password" : "Create a login password"}
                />
                {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  {...register("status")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* --- Submit Button --- */}
          <div className="pt-6 border-t mt-8 flex justify-end gap-3">
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
                ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
            >
              {loading ? "Saving..." : isEditMode ? "Update Guard" : "Save Guard Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGuard;