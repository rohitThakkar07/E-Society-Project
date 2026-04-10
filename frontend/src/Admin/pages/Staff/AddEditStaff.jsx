import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createStaff, updateStaff, fetchStaffById } from "../../../store/slices/staffSlice";

const AddEditStaff = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { singleStaff, loading } = useSelector((s) => s.staff) ?? {};
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => { if (isEdit && id) dispatch(fetchStaffById(id)); }, [id, isEdit, dispatch]);
  useEffect(() => {
    if (singleStaff && isEdit) {
      reset({
        name: singleStaff.name, role: singleStaff.role, phone: singleStaff.phone,
        email: singleStaff.email, address: singleStaff.address, salary: singleStaff.salary,
        assignedArea: singleStaff.assignedArea, status: singleStaff.status,
        joiningDate: singleStaff.joiningDate?.split("T")[0] || "",
      });
    }
  }, [singleStaff, isEdit, reset]);

  const onSubmit = async (data) => {
  const payload = {
    ...data,
    fullName: data.name || data.fullName, // map correctly
    salary: data.salary ? Number(data.salary) : undefined,
    joiningDate: data.joiningDate
      ? new Date(data.joiningDate).toISOString()
      : undefined,
  };

  const res = isEdit
    ? await dispatch(updateStaff({ id, data: payload }))
    : await dispatch(createStaff(payload));

  if (res.type.endsWith("fulfilled")) navigate("/admin/staff/list");
};

  const inp = (err) => `w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500 ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`;
  const lbl = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
  const Err = ({ e }) => e ? <p className="mt-1 text-xs text-red-500">{e.message}</p> : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-start justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">{isEdit ? "Edit Staff" : "Add Staff"}</h1>
          <p className="text-sm text-gray-400">{isEdit ? "Update staff details" : "Add a new staff member"}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400" />
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-5">

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={lbl}>Full Name *</label>
                <input {...register("name", { required: "Name is required" })} placeholder="e.g. Ramesh Kumar" className={inp(errors.name)} />
                <Err e={errors.name} />
              </div>
              <div>
                <label className={lbl}>Role *</label>
                <select {...register("role", { required: "Role is required" })} className={inp(errors.role)}>
                  <option value="">Select role</option>
                  {["Cleaner", "Electrician", "Plumber", "Security", "Gardener", "Lift Operator", "Other"].map(r => <option key={r}>{r}</option>)}
                </select>
                <Err e={errors.role} />
              </div>
              <div>
                <label className={lbl}>Status</label>
                <select {...register("status")} className={inp(false)}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Phone *</label>
                <input {...register("phone", { required: "Phone is required" })} placeholder="10-digit number" className={inp(errors.phone)} />
                <Err e={errors.phone} />
              </div>
              <div>
                <label className={lbl}>Email</label>
                <input type="email" {...register("email")} placeholder="optional" className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Salary (₹)</label>
                <input type="number" {...register("salary")} placeholder="e.g. 12000" className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Joining Date</label>
                <input type="date" {...register("joiningDate")} className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Assigned Area</label>
                <input {...register("assignedArea")} placeholder="e.g. Block A Ground Floor" className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Address</label>
                <input {...register("address")} placeholder="Residential address" className={inp(false)} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => navigate(-1)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button type="submit" disabled={loading}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg flex items-center gap-2">
                {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Saving...</> : isEdit ? "Update Staff" : "Add Staff"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditStaff;