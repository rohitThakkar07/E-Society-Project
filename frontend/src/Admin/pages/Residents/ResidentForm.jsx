import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchResidentById, createResident, updateResident } from "../../../store/slices/residentSlice";
import { fetchFlats } from "../../../store/slices/flatSlice";

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const PASSWORD_HINT = "Use 8+ characters with uppercase, lowercase, number, and special character.";
const labelClass = "admin-label";
const errorClass = "mt-1 text-[10px] font-bold text-red-500 uppercase tracking-tight";

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
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { status: "Active", residentType: "Owner" },
  });

  const selectedFlatId = watch("flat");
  const selectedFlatData = (flats || []).find((f) => f._id === selectedFlatId);
  const hasOwner = !!(selectedFlatData?.owner?.name);

  // Sync Resident Type based on Flat Ownership
  useEffect(() => {
    if (selectedFlatId) {
      if (hasOwner) {
        setValue("residentType", "Tenant");
      } else {
        setValue("residentType", "Owner");
      }
    }
  }, [selectedFlatId, hasOwner, setValue]);


  useEffect(() => {
    dispatch(fetchFlats());
    if (isEditMode) dispatch(fetchResidentById(id));
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (singleResident && isEditMode) {
      reset({
        ...singleResident,
        flat: singleResident.flat?._id || singleResident.flat,
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

    const formData = new FormData();

    // Core fields
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName || "");
    formData.append("mobileNumber", data.mobileNumber.toString());
    formData.append("email", data.email || "");
    formData.append("flat", data.flat);
    formData.append("residentType", data.residentType);
    formData.append("moveInDate", data.moveInDate || "");
    formData.append("status", data.status || "Active");

    // Denormalized fields
    formData.append("wing", selectedFlat.wing);
    formData.append("flatNumber", selectedFlat.flatNumber);
    formData.append("floorNumber", Number(selectedFlat.floor ?? selectedFlat.floorNumber ?? 0));
    formData.append("flatType", selectedFlat.type);

    if (!isEditMode && data.password) {
      formData.append("password", data.password);
    }

    // Handle Image
    if (data.profileImage && data.profileImage.length > 0) {
      formData.append("profileImage", data.profileImage[0]);
    }

    if (isEditMode) {
      const result = await dispatch(updateResident({ id, formData }));
      if (result.type.endsWith("fulfilled")) navigate("/admin/residents");
      return;
    }

    const result = await dispatch(createResident(formData));
    if (result.type.endsWith("fulfilled")) navigate("/admin/residents");
  };

  const getFlatLabel = (flat) => `${flat.flatNumber} (${flat.type})`;
  const availableFlats = flats.filter((flat) => {
    if (flat.status === "Vacant") return true;
    if (isEditMode && flat._id === (singleResident?.flat?._id || singleResident?.flat)) return true;
    return false;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit" : "Add"} Resident</h1>
          <p className="text-sm text-gray-500">
            {isEditMode ? "Update" : "Create"} resident details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <div className="admin-form-group">
            <label className={labelClass}>First Name *</label>
            <input
              type="text"
              {...register("firstName", { required: "First name is required" })}
              className="admin-input"
              placeholder="Enter first name"
            />
            {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Last Name</label>
            <input type="text" {...register("lastName")} className="admin-input" placeholder="Enter last name" />
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Mobile Number *</label>
            <input
              type="text"
              {...register("mobileNumber", {
                required: "Mobile number is required",
                pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit mobile number" },
              })}
              maxLength={10}
              className="admin-input"
              placeholder="10-digit mobile number"
            />
            {errors.mobileNumber && <p className={errorClass}>{errors.mobileNumber.message}</p>}
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              {...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className="admin-input"
              placeholder="email@example.com"
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Assign Flat *</label>
            <select {...register("flat", { required: "Assigning a flat is required" })} className="admin-input">
              <option value="">Select a Flat</option>
              {availableFlats.map((flat) => (
                <option key={flat._id} value={flat._id}>
                  {getFlatLabel(flat)}
                </option>
              ))}
            </select>
            {errors.flat && <p className={errorClass}>{errors.flat.message}</p>}
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Resident Type *</label>
            <select
              {...register("residentType")}
              className={`admin-input ${!hasOwner ? "bg-gray-50 cursor-not-allowed" : ""}`}
              disabled={!hasOwner}
            >
              {!hasOwner ? (
                <option value="Owner">Owner</option>
              ) : (
                <>
                  <option value="Tenant">Tenant</option>
                  <option value="Owner">Transfer Ownership (Change Owner)</option>
                </>
              )}
            </select>
            {!hasOwner && <input type="hidden" {...register("residentType")} value="Owner" />}
            <p className="mt-1 text-[10px] text-gray-400 font-medium">
              {hasOwner 
                ? "This flat already has an owner." 
                : "Flat has no owner assigned. First resident must be the Owner."}
            </p>
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Move In Date</label>
            <input type="date" {...register("moveInDate")} className="admin-input" />
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Profile Image</label>
            <input
              type="file"
              accept="image/*"
              {...register("profileImage")}
              className="admin-input file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-xs file:font-black file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {!isEditMode && (
            <div className="admin-form-group md:col-span-2">
              <label className={labelClass}>Password *</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  pattern: { value: STRONG_PASSWORD_REGEX, message: PASSWORD_HINT },
                })}
                className="admin-input"
                placeholder="Create a strong password"
              />
              {errors.password ? <p className={errorClass}>{errors.password.message}</p> : <p className="mt-1 text-[10px] text-gray-400 font-medium uppercase tracking-tight">{PASSWORD_HINT}</p>}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => navigate("/admin/residents")}
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            {loading ? "Saving..." : isEditMode ? "Update Resident" : "Create Resident"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResidentForm;
