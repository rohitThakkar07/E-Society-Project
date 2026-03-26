import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaff, fetchStaffSummary, deleteStaff } from "../../../store/slices/staffSlice";

const STATUS_STYLE = { Active: "bg-green-100 text-green-700", Inactive: "bg-red-100 text-red-600", "On Leave": "bg-yellow-100 text-yellow-700" };

const StaffList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { list: staff, loading, summary, summaryLoading } = useSelector((s) => s.staff) ?? {};
  const staff = useSelector((s) => s.staff.list ?? []);
  const loading = useSelector((s) => s.staff.loading);
  const summary = useSelector((s) => s.staff.summary);
  const summaryLoading = useSelector((s) => s.staff.summaryLoading);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => { dispatch(fetchStaff()); dispatch(fetchStaffSummary()); }, [dispatch]);

  console.log(staff);
  const filtered = useMemo(() =>
    (staff || []).filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search);
      const matchRole   = roleFilter   === "All" || s.role   === roleFilter;
      const matchStatus = statusFilter === "All" || s.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    }), [staff, search, roleFilter, statusFilter]);

  const handleDelete = (id) => { if (window.confirm("Remove this staff member?")) dispatch(deleteStaff(id)); };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-sm text-gray-500">Manage society staff members</p>
        </div>
        <button onClick={() => navigate("/admin/staff/add")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium self-start">
          + Add Staff
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", val: summaryLoading ? "…" : (summary?.total ?? 0), color: "text-gray-800" },
          { label: "Active", val: summaryLoading ? "…" : (summary?.active ?? 0), color: "text-green-600" },
          { label: "On Leave", val: summaryLoading ? "…" : (summary?.onLeave ?? 0), color: "text-yellow-600" },
          { label: "Inactive", val: summaryLoading ? "…" : (summary?.inactive ?? 0), color: "text-red-600" },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3">
        <input type="text" placeholder="Search by name or phone..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm w-full sm:w-52 outline-none focus:ring-2 focus:ring-blue-500" />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
          <option value="All">All Roles</option>
          {["Cleaner","Electrician","Plumber","Security","Gardener","Lift Operator","Other"].map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
          <option value="All">All Status</option>
          {["Active","Inactive","On Leave"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["#","Name","Role","Phone","Area","Salary","Status","Actions"].map(h => (
                <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i} className="animate-pulse">{[...Array(8)].map((_, j) => <td key={j} className="px-5 py-4"><div className="h-3 bg-gray-100 rounded w-3/4"/></td>)}</tr>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((s, idx) => (
                <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-gray-400 text-xs">{idx + 1}</td>
                  <td className="px-5 py-4 font-medium text-gray-800">{s.name}</td>
                  <td className="px-5 py-4 text-gray-600">{s.role}</td>
                  <td className="px-5 py-4 text-gray-600">{s.phone}</td>
                  <td className="px-5 py-4 text-gray-500">{s.assignedArea || "—"}</td>
                  <td className="px-5 py-4 text-gray-700">{s.salary ? `₹${s.salary.toLocaleString()}` : "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-3">
                      <button onClick={() => navigate(`/admin/staff/${s._id}`)} className="text-blue-600 hover:underline text-sm">View</button>
                      <button onClick={() => navigate(`/admin/staff/edit/${s._id}`)} className="text-yellow-600 hover:underline text-sm">Edit</button>
                      <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:underline text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" className="px-5 py-12 text-center text-gray-400 text-sm">No staff found</td></tr>
            )}
          </tbody>
        </table>
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {(staff||[]).length} staff members
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffList;