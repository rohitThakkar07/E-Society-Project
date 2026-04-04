import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchResidentById, createResident, updateResident } from "../../../store/slices/residentSlice";
import { fetchFlats } from "../../../store/slices/flatSlice";

const ResidentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = Boolean(id);

  const { singleResident, loading } = useSelector((state) => state.resident);
  const { list: flats = [] } = useSelector((state) => state.flat);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { status: "Active", residentType: "Owner" },
  });

  useEffect(() => {
    dispatch(fetchFlats());
    if (isEditMode) dispatch(fetchResidentById(id));
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (singleResident && isEditMode) {
      reset({
        ...singleResident,
        flat: singleResident.flat?._id || singleResident.flat,
        dateOfBirth: singleResident.dateOfBirth?.split("T")[0] || "",
        moveInDate: singleResident.moveInDate?.split("T")[0] || "",
      });
    }
  }, [singleResident, isEditMode, reset]);

  const onSubmit = async (data) => {
    const selectedFlat = flats.find((f) => f._id === data.flat);
    if (!selectedFlat) {
      alert("Please select a valid flat");
      return;
    }
    const formattedData = {
      ...data,
      wing: selectedFlat.wing || selectedFlat.block,
      flatNumber: selectedFlat.flatNumber,
      floorNumber: Number(selectedFlat.floor ?? selectedFlat.floorNumber ?? 0),
      flatType: selectedFlat.type,
      mobileNumber: data.mobileNumber.toString(),
    };
    if (isEditMode) {
      const result = await dispatch(updateResident({ id, formData: formattedData }));
      if (result.type.endsWith("fulfilled")) navigate("/admin/residents");
    } else {
      const result = await dispatch(createResident(formattedData));
      if (result.type.endsWith("fulfilled")) navigate("/admin/residents");
    }
  };

  const getFlatLabel = (f) => `${f.flatNumber} (${f.type})`;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {isEditMode ? "Edit Resident" : "Add New Resident"}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isEditMode ? "Update resident information below." : "Fill in the details to register a new resident."}
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{isEditMode ? "Edit Profile" : "Resident Information"}</p>
            <p className="text-[11px] text-slate-400">All fields marked * are required</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* First Name */}
            <FormField label="First Name *" error={errors.firstName}>
              <input
                type="text"
                {...register("firstName", { required: "First name is required" })}
                className={`admin-input ${errors.firstName ? "admin-input-error" : ""}`}
                placeholder="Enter first name"
              />
            </FormField>

            {/* Last Name */}
            <FormField label="Last Name">
              <input
                type="text"
                {...register("lastName")}
                className="admin-input"
                placeholder="Enter last name"
              />
            </FormField>

            {/* Gender */}
            <FormField label="Gender *" error={errors.gender}>
              <select
                {...register("gender", { required: "Gender is required" })}
                className={`admin-input ${errors.gender ? "admin-input-error" : ""}`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </FormField>

            {/* Date of Birth */}
            <FormField label="Date of Birth">
              <input
                type="date"
                {...register("dateOfBirth")}
                className="admin-input"
              />
            </FormField>

            {/* Mobile */}
            <FormField label="Mobile Number *" error={errors.mobileNumber}>
              <input
                type="text"
                {...register("mobileNumber", {
                  required: "Mobile number is required",
                  pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit mobile number" },
                })}
                className={`admin-input ${errors.mobileNumber ? "admin-input-error" : ""}`}
                placeholder="10-digit mobile number"
              />
            </FormField>

            {/* Email */}
            <FormField label="Email Address">
              <input
                type="email"
                {...register("email")}
                className="admin-input"
                placeholder="email@example.com"
              />
            </FormField>

            {/* Assign Flat */}
            <FormField label="Assign Flat *" error={errors.flat}>
              <select
                {...register("flat", { required: "Assigning a flat is required" })}
                className={`admin-input ${errors.flat ? "admin-input-error" : ""}`}
              >
                <option value="">Select a Flat</option>
                {flats
                  .filter((f) => {
                    if (f.status === "Vacant") return true;
                    if (isEditMode && f._id === singleResident?.flat?._id) return true;
                    return false;
                  })
                  .map((f) => (
                    <option key={f._id} value={f._id}>
                      {getFlatLabel(f)}
                    </option>
                  ))}
              </select>
            </FormField>

            {/* Resident Type */}
            <FormField label="Resident Type *">
              <select {...register("residentType")} className="admin-input">
                <option value="Owner">Owner</option>
                <option value="Tenant">Tenant</option>
              </select>
            </FormField>

            {/* Move In Date */}
            <FormField label="Move In Date">
              <input
                type="date"
                {...register("moveInDate")}
                className="admin-input"
              />
            </FormField>

            {/* Status */}
            <FormField label="Status">
              <select {...register("status")} className="admin-input">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </FormField>

            {/* Password (add mode only) */}
            {!isEditMode && (
              <div className="col-span-full">
                <FormField label="Password *" error={errors.password}>
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" },
                    })}
                    className={`admin-input ${errors.password ? "admin-input-error" : ""}`}
                    placeholder="Minimum 6 characters"
                  />
                </FormField>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEditMode ? "Update Resident" : "Save Resident"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Helper Component ──────────────────────────────────────────────────────────
const FormField = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{label}</label>
    {children}
    {error && (
      <p className="text-xs text-red-500 font-medium flex items-center gap-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error.message}
      </p>
    )}
  </div>
);

export default ResidentForm;