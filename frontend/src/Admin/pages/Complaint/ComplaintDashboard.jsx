import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  FiSearch, FiEye, FiAlertCircle, FiClock, 
  FiCheckCircle, FiInbox, FiFilter 
} from "react-icons/fi";
import { fetchComplaints } from "../../../store/slices/complaintSlice";

const STATUS_STYLE = {
  Pending: "bg-red-100 text-red-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Resolved: "bg-green-100 text-green-700",
};

const PRIORITY_STYLE = {
  High: "bg-rose-50 text-rose-600 border-rose-100",
  Medium: "bg-blue-50 text-blue-600 border-blue-100",
  Low: "bg-gray-50 text-gray-600 border-gray-100",
};

const ComplaintDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { complaints = [], loading } = useSelector((state) => state.complaint) ?? {};
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  // 🔥 Stats calculation
  const stats = useMemo(() => ({
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
  }), [complaints]);

  // 🔥 Filter Logic
  const filtered = useMemo(() =>
    complaints.filter((c) => {
      const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase()) || 
                          c.category?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      return matchSearch && matchStatus;
    }), [complaints, search, statusFilter]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Complaint Management</h1>
          <p className="text-sm text-gray-500">Track and resolve resident issues and maintenance requests.</p>
        </div>
      </div>

      {/* SUMMARY ROW (Matching Flat Table) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Issues", val: stats.total, color: "text-gray-800", icon: <FiInbox size={14} /> },
          { label: "Pending", val: stats.pending, color: "text-red-600", icon: <FiAlertCircle size={14} /> },
          { label: "In Progress", val: stats.inProgress, color: "text-yellow-600", icon: <FiClock size={14} /> },
          { label: "Resolved", val: stats.resolved, color: "text-green-600", icon: <FiCheckCircle size={14} /> },
        ].map(({ label, val, color, icon }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-gray-50 ${color}`}>{icon}</div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{loading ? "..." : (val ?? 0)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* SEARCH & FILTER BAR */}
        <div className="p-4 border-b border-gray-50 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Title or Category..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* TABLE BODY */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-widest border-b">
              <tr>
                <th className="px-6 py-4">Complaint Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => <tr key={i} className="animate-pulse"><td colSpan="5" className="p-6 bg-gray-50/50"></td></tr>)
              ) : filtered.length > 0 ? (
                filtered.map((c) => (
                  <tr key={c._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{c.title}</div>
                      <div className="text-[11px] text-gray-400">ID: {c._id.slice(-6).toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[11px] font-bold">
                        {c.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${PRIORITY_STYLE[c.priority] || PRIORITY_STYLE.Low}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[c.status] || "bg-gray-100"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => navigate(`/admin/complaints/${c._id}`)} 
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium">
                    No complaints found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDashboard;