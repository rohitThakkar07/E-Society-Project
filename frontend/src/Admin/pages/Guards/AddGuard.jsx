import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createGuard, updateGuard, fetchGuardById, clearSingleGuard } from "../../../store/slices/guardSlice";

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const PASSWORD_HINT = "Use 8+ characters with uppercase, lowercase, number, and special character.";
const labelClass = "admin-label";
const errorClass = "mt-1 text-[10px] font-bold text-red-500 uppercase tracking-tight";

const AddGuard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = Boolean(id);
  const { singleGuard, loading } = useSelector((state) => state.guard);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: { status: "Active", monthlySalary: 0 },
  });

  useEffect(() => () => {
    dispatch(clearSingleGuard());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit) dispatch(fetchGuardById(id));
  }, [id, isEdit, dispatch]);

  useEffect(() => {
    if (singleGuard && isEdit) {
      const parts = (singleGuard.name || "").trim().split(" ");
      reset({
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        mobileNumber: singleGuard.mobileNumber || "",
        alternativeNumber: singleGuard.alternativeNumber || "",
        emailAddress: singleGuard.email || "",
        city: singleGuard.city || "",
        shift: singleGuard.shift || "",
        idType: singleGuard.idProofType || "",
        idNumber: singleGuard.idProofNumber || "",
        joiningDate: singleGuard.joiningDate ? singleGuard.joiningDate.split("T")[0] : "",
        status: singleGuard.status || "Active",
        monthlySalary: singleGuard.monthlySalary || 0,
      });
    }
  }, [singleGuard, reset, isEdit]);

  const onSubmit = async (data) => {
    data.fullName = `${data.firstName} ${data.lastName}`.trim();

    const formData = new FormData();
    for (const key in data) {
      if (key === "idImage" && data[key]?.length > 0) {
        formData.append("idImage", data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    }

    if (isEdit) {
      const result = await dispatch(updateGuard({ id, formData }));
      if (result.type.endsWith("fulfilled")) navigate("/admin/guards");
      return;
    }

    const result = await dispatch(createGuard(formData));
    if (result.type.endsWith("fulfilled")) navigate("/admin/guards");
  };

  if (loading && isEdit) {
    return <div className="text-center p-6">Loading guard...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit" : "Add"} Guard</h1>
          <p className="text-sm text-gray-500">
            {isEdit ? "Update" : "Create"} guard details in the same style as the event form.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <div className="admin-form-group">
            <label className={labelClass}>First Name *</label>
            <input {...register("firstName", { required: "First name is required" })} className="admin-input" placeholder="e.g. Ramesh" />
            {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Last Name *</label>
            <input {...register("lastName", { required: "Last name is required" })} className="admin-input" placeholder="e.g. Singh" />
            {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>City *</label>
            <input {...register("city", { required: "City is required" })} className="admin-input" placeholder="e.g. Mumbai" />
            {errors.city && <p className={errorClass}>{errors.city.message}</p>}
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Shift *</label>
            <select {...register("shift", { required: "Shift is required" })} className="admin-input">
              <option value="">Select Shift</option>
              <option value="Day">Day</option>
              <option value="Night">Night</option>
            </select>
            {errors.shift && <p className={errorClass}>{errors.shift.message}</p>}
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Mobile Number *</label>
            <input
              type="tel"
              {...register("mobileNumber", {
                required: "Mobile number is required",
                pattern: { value: /^[0-9]{10}$/, message: "Must be 10 digits" },
              })}
              className="admin-input"
              placeholder="10-digit number"
            />
            {errors.mobileNumber && <p className={errorClass}>{errors.mobileNumber.message}</p>}
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Alternative Number</label>
            <input type="tel" {...register("alternativeNumber")} className="admin-input" placeholder="Optional" />
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Email Address</label>
            <input type="email" {...register("emailAddress")} className="admin-input" placeholder="guard@example.com" />
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>ID Type *</label>
            <select {...register("idType", { required: "ID Type is required" })} className="admin-input">
              <option value="">Select ID</option>
              <option value="Aadhar Card">Aadhar Card</option>
            </select>
            {errors.idType && <p className={errorClass}>{errors.idType.message}</p>}
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>ID Number *</label>
            <input {...register("idNumber", { required: "ID Number is required" })} className="admin-input" placeholder="Enter ID number" />
            {errors.idNumber && <p className={errorClass}>{errors.idNumber.message}</p>}
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Joining Date *</label>
            <input type="date" {...register("joiningDate", { required: "Joining date is required" })} className="admin-input" />
            {errors.joiningDate && <p className={errorClass}>{errors.joiningDate.message}</p>}
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Status</label>
            <select {...register("status")} className="admin-input">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Monthly Salary (₹)</label>
            <input 
              type="number" 
              {...register("monthlySalary")} 
              className="admin-input" 
              placeholder="e.g. 15000" 
            />
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>{isEdit ? "Password (leave blank to keep)" : "Password *"}</label>
            <input
              type="password"
              {...register("password", {
                required: isEdit ? false : "Password is required",
                validate: (value) => !value || STRONG_PASSWORD_REGEX.test(value) || PASSWORD_HINT,
              })}
              className="admin-input"
              placeholder={isEdit ? "Leave empty to keep current" : "Create a strong password"}
            />
            {errors.password ? <p className={errorClass}>{errors.password.message}</p> : <p className="mt-1 text-[10px] text-gray-400 font-medium uppercase tracking-tight">{PASSWORD_HINT}</p>}
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Upload ID Image</label>
            <input
              type="file"
              accept="image/*"
              {...register("idImage")}
              className="admin-input file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-xs file:font-black file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => navigate("/admin/guards")}
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            {loading ? "Saving..." : isEdit ? "Update Guard" : "Create Guard"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGuard;
