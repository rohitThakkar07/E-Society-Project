import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaffById, deleteStaff } from "../../../store/slices/staffSlice";

const STATUS_STYLE = { Active: "bg-green-100 text-green-700", Inactive: "bg-red-100 text-red-600", "On Leave": "bg-yellow-100 text-yellow-700" };
const Field = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
    <p className="font-medium text-gray-800">{value || "—"}</p>
  </div>
);

const StaffDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { singleStaff: staff, loading } = useSelector((s) => s.staff) ?? {};

  useEffect(() => { if (id) dispatch(fetchStaffById(id)); }, [id, dispatch]);

  const handleDelete = async () => {
    if (window.confirm("Remove this staff member?")) {
      await dispatch(deleteStaff(id));
      navigate("/admin/staff/list");
    }
  };

  if (loading && !staff) return <div className="p-6 flex items-center justify-center min-h-screen"><svg className="w-8 h-8 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg></div>;
  if (!staff) return <div className="p-6 text-center text-gray-400"><p className="mb-2">Staff not found.</p><button onClick={() => navigate(-1)} className="text-blue-600 underline text-sm">← Go back</button></div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">Staff Details</h1><p className="text-sm text-gray-500">View staff member info</p></div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Back
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400" />
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold flex-shrink-0">
              {staff.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{staff.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">{staff.role}</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLE[staff.status]}`}>{staff.status}</span>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
            <Field label="Phone"        value={staff.phone} />
            <Field label="Email"        value={staff.email} />
            <Field label="Assigned Area" value={staff.assignedArea} />
            <Field label="Salary"       value={staff.salary ? `₹${staff.salary.toLocaleString()}` : null} />
            <Field label="Joining Date" value={staff.joiningDate ? new Date(staff.joiningDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : null} />
            <Field label="Address"      value={staff.address} />
          </div>
        </div>
        <div className="flex gap-3 px-6 md:px-8 py-5 border-t border-gray-100 bg-gray-50">
          <button onClick={() => navigate(`/admin/staff/edit/${id}`)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold">Edit</button>
          <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default StaffDetail;