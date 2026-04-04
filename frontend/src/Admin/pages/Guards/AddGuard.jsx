import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createGuard, updateGuard, fetchGuardById, clearSingleGuard } from "../../../store/slices/guardSlice";

/* ── Reusable Field ─────────────────────────────────────────────────────── */
const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{label}</label>
    {children}
    {error && (
      <p className="text-xs text-red-500 font-medium flex items-center gap-1">
        <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error.message}
      </p>
    )}
  </div>
);

/* ── Section ────────────────────────────────────────────────────────────── */
const Section = ({ num, title, children }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">{num}</span>
      <p className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════ */
const AddGuard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = Boolean(id);
  const { singleGuard, loading } = useSelector((s) => s.guard);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    mode: "onBlur",
    defaultValues: { status: "Active" },
  });

  useEffect(() => () => { dispatch(clearSingleGuard()); }, [dispatch]);
  useEffect(() => { if (isEdit) dispatch(fetchGuardById(id)); }, [id, isEdit, dispatch]);
  useEffect(() => {
    if (singleGuard && isEdit) {
      const parts = (singleGuard.name || "").trim().split(" ");
      reset({
        firstName:         parts[0] || "",
        lastName:          parts.slice(1).join(" ") || "",
        mobileNumber:      singleGuard.mobileNumber || "",
        alternativeNumber: singleGuard.alternativeNumber || "",
        emailAddress:      singleGuard.email || "",
        city:              singleGuard.city || "",
        shift:             singleGuard.shift || "",
        idType:            singleGuard.idProofType || "",
        idNumber:          singleGuard.idProofNumber || "",
        joiningDate:       singleGuard.joiningDate ? singleGuard.joiningDate.split("T")[0] : "",
        status:            singleGuard.status || "Active",
      });
    }
  }, [singleGuard, reset, isEdit]);

  const onSubmit = async (data) => {
    data.fullName = `${data.firstName} ${data.lastName}`;
    const fd = new FormData();
    for (const key in data) {
      if (key === "idImage" && data[key]?.length > 0) fd.append("idImage", data[key][0]);
      else fd.append(key, data[key]);
    }
    if (isEdit) {
      const r = await dispatch(updateGuard({ id, formData: fd }));
      if (r.type.endsWith("fulfilled")) setTimeout(() => navigate("/admin/guards"), 1000);
    } else {
      const r = await dispatch(createGuard(fd));
      if (r.type.endsWith("fulfilled")) { reset(); setTimeout(() => navigate("/admin/guards"), 1000); }
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg className="w-10 h-10 animate-spin text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-500 mt-3 text-sm font-medium">Loading guard data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {isEdit ? "Edit Guard" : "Add New Guard"}
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">
          {isEdit ? "Update security personnel information." : "Register a new security personnel into the system."}
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Guard Information</p>
            <p className="text-[11px] text-slate-400">All fields marked * are required</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">

          {/* ── Section 1: Personal Details ── */}
          <Section num="1" title="Personal Details">
            <Field label="First Name *" error={errors.firstName}>
              <input {...register("firstName", { required: "First name is required" })}
                placeholder="e.g. Ramesh"
                className={`admin-input ${errors.firstName ? "admin-input-error" : ""}`} />
            </Field>
            <Field label="Last Name *" error={errors.lastName}>
              <input {...register("lastName", { required: "Last name is required" })}
                placeholder="e.g. Singh"
                className={`admin-input ${errors.lastName ? "admin-input-error" : ""}`} />
            </Field>
            <Field label="City *" error={errors.city}>
              <input {...register("city", { required: "City is required" })}
                placeholder="e.g. Mumbai"
                className={`admin-input ${errors.city ? "admin-input-error" : ""}`} />
            </Field>
          </Section>

          <div className="border-t border-slate-100" />

          {/* ── Section 2: Contact ── */}
          <Section num="2" title="Contact Information">
            <Field label="Mobile Number *" error={errors.mobileNumber}>
              <input type="tel"
                {...register("mobileNumber", {
                  required: "Mobile number is required",
                  pattern: { value: /^[0-9]{10}$/, message: "Must be 10 digits" },
                })}
                placeholder="10-digit number"
                className={`admin-input ${errors.mobileNumber ? "admin-input-error" : ""}`} />
            </Field>
            <Field label="Alternative Number">
              <input type="tel" {...register("alternativeNumber")} placeholder="Optional" className="admin-input" />
            </Field>
            <Field label="Email Address">
              <input type="email" {...register("emailAddress")} placeholder="guard@example.com" className="admin-input" />
            </Field>
          </Section>

          <div className="border-t border-slate-100" />

          {/* ── Section 3: Identity & Employment ── */}
          <Section num="3" title="Identity & Employment">
            <Field label="Shift *" error={errors.shift}>
              <select {...register("shift", { required: "Shift is required" })}
                className={`admin-input ${errors.shift ? "admin-input-error" : ""}`}>
                <option value="">Select Shift</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
              </select>
            </Field>
            <Field label="ID Type *" error={errors.idType}>
              <select {...register("idType", { required: "ID Type is required" })}
                className={`admin-input ${errors.idType ? "admin-input-error" : ""}`}>
                <option value="">Select ID</option>
                <option value="Aadhar Card">Aadhar Card</option>
                 
              </select>
            </Field>
            <Field label="ID Number *" error={errors.idNumber}>
              <input {...register("idNumber", { required: "ID Number is required" })}
                placeholder="Enter ID number"
                className={`admin-input ${errors.idNumber ? "admin-input-error" : ""}`} />
            </Field>
            <Field label="Joining Date *" error={errors.joiningDate}>
              <input type="date"
                {...register("joiningDate", { required: "Joining date is required" })}
                className={`admin-input ${errors.joiningDate ? "admin-input-error" : ""}`} />
            </Field>
            <Field label={isEdit ? "Password (leave blank to keep)" : "Password *"} error={errors.password}>
              <input type="password"
                {...register("password", {
                  required: isEdit ? false : "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                placeholder={isEdit ? "Leave empty to keep current" : "Create a password"}
                className={`admin-input ${errors.password ? "admin-input-error" : ""}`} />
            </Field>
            <Field label="Status">
              <select {...register("status")} className="admin-input">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </Field>
          </Section>

          {/* ── ID Image (full width) ── */}
          <div className="border-t border-slate-100 pt-5">
            <Field label="Upload ID Image">
              <input type="file" accept="image/*" {...register("idImage")}
                className="admin-input file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
            </Field>
          </div>

          {/* ── Actions ── */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2">
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving…</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{isEdit ? "Update Guard" : "Save Guard"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGuard;