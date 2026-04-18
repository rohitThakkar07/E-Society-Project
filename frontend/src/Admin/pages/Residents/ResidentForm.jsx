import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchResidentById, createResident, updateResident } from "../../../store/slices/residentSlice";
import { fetchFlats } from "../../../store/slices/flatSlice";

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const PASSWORD_HINT = "Use 8+ characters with uppercase, lowercase, number, and special character.";
const inputClass =
  "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1";
const errorClass = "mt-1 text-xs text-red-500";

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
    defaultValues: { status: "Active", residentType: "Owner", twoWheelers: 0, fourWheelers: 0 },
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

  const twoWheelers = watch("twoWheelers") || 0;
  const fourWheelers = watch("fourWheelers") || 0;

  const calculateParkingCharge = () => {
    const extra2W = Math.max(0, parseInt(twoWheelers) - 2);
    const extra4W = Math.max(0, parseInt(fourWheelers) - 1);
    return (extra2W * 1500) + (extra4W * 3000);
  };

  const parkingCharge = calculateParkingCharge();

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
        parkingSlot: singleResident.parkingSlot || "",
        twoWheelers: singleResident.twoWheelers || 0,
        fourWheelers: singleResident.fourWheelers || 0,
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
    
    // Parking info
    formData.append("parkingSlot", data.parkingSlot || "");
    formData.append("twoWheelers", data.twoWheelers || 0);
    formData.append("fourWheelers", data.fourWheelers || 0);
    formData.append("parkingCharge", parkingCharge);

    // Denormalized fields
    formData.append("wing", selectedFlat.wing || selectedFlat.block);
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
            {isEditMode ? "Update" : "Create"} resident details in the same style as the event form.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name *</label>
            <input
              type="text"
              {...register("firstName", { required: "First name is required" })}
              className={inputClass}
              placeholder="Enter first name"
            />
            {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Last Name</label>
            <input type="text" {...register("lastName")} className={inputClass} placeholder="Enter last name" />
          </div>

          <div>
            <label className={labelClass}>Mobile Number *</label>
            <input
              type="text"
              {...register("mobileNumber", {
                required: "Mobile number is required",
                pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit mobile number" },
              })}
              maxLength={10}
              className={inputClass}
              placeholder="10-digit mobile number"
            />
            {errors.mobileNumber && <p className={errorClass}>{errors.mobileNumber.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              {...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={inputClass}
              placeholder="email@example.com"
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Assign Flat *</label>
            <select {...register("flat", { required: "Assigning a flat is required" })} className={inputClass}>
              <option value="">Select a Flat</option>
              {availableFlats.map((flat) => (
                <option key={flat._id} value={flat._id}>
                  {getFlatLabel(flat)}
                </option>
              ))}
            </select>
            {errors.flat && <p className={errorClass}>{errors.flat.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Resident Type *</label>
            <select
              {...register("residentType")}
              className={`${inputClass} ${!hasOwner ? "bg-gray-100 cursor-not-allowed" : ""}`}
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
            <p className="mt-1 text-[10px] text-gray-500">
              {hasOwner 
                ? "This flat already has an owner (Transferring ownership will replace the previous owner record)." 
                : "Flat has no owner assigned. First resident must be the Owner."}
            </p>
          </div>

          <div>
            <label className={labelClass}>Move In Date</label>
            <input type="date" {...register("moveInDate")} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Profile Image</label>
            <input
              type="file"
              accept="image/*"
              {...register("profileImage")}
              className="w-full px-3 py-2 border rounded-lg file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Parking Section */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Parking & Vehicles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Parking Slot (Wing)</label>
              <select {...register("parkingSlot")} className={inputClass}>
                <option value="">Select Wing</option>
                <option value="WING A">WING A</option>
                <option value="WING B">WING B</option>
                <option value="WING C">WING C</option>
                <option value="WING D">WING D</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Two Wheelers (Max 2 free)</label>
              <input type="number" {...register("twoWheelers")} className={inputClass} min="0" />
            </div>

            <div>
              <label className={labelClass}>Four Wheelers (Max 1 free)</label>
              <input type="number" {...register("fourWheelers")} className={inputClass} min="0" />
            </div>
          </div>

          {parkingCharge > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <div className="flex justify-between items-center text-blue-800">
                <span className="font-medium text-sm">Estimated Extra Parking Fee:</span>
                <span className="font-bold text-lg">₹{parkingCharge}</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                This involves an extra charge of ₹1500 per extra 2-wheeler and ₹3000 per extra 4-wheeler (One-time fee).
              </p>
            </div>
          )}

          <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">Parking Rules & Conditions</h4>
            <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
              <li>Each flat is allotted 2 FREE two-wheeler slots and 1 FREE four-wheeler slot.</li>
              <li>Extra 2-wheeler (beyond 2) will incur a one-time fee of ₹1500.</li>
              <li>Extra 4-wheeler (beyond 1) will incur a one-time fee of ₹3000.</li>
              <li>Charges are added to the first month's bill only.</li>
              <li>Parking slots are subejct to availability in the selected Wing.</li>
            </ul>
          </div>
        </div>

        {!isEditMode && (
          <div>
            <label className={labelClass}>Password *</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                pattern: { value: STRONG_PASSWORD_REGEX, message: PASSWORD_HINT },
              })}
              className={inputClass}
              placeholder="Create a strong password"
            />
            {errors.password ? <p className={errorClass}>{errors.password.message}</p> : <p className="mt-1 text-xs text-gray-500">{PASSWORD_HINT}</p>}
          </div>
        )}

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
