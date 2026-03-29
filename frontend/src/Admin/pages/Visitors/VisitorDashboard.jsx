import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2, FiSearch, FiPlus, FiUser, FiHome, FiClock, FiActivity,FiFileText } from "react-icons/fi";
import { fetchVisitors, deleteVisitor } from "../../../store/slices/visitorSlice";

const STATUS_STYLE = {
  Inside: "bg-green-100 text-green-700",
  Exited: "bg-gray-100 text-gray-500",
};

const VisitorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { visitors = [], loading } = useSelector((state) => state.visitor || {});

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchVisitors());
  }, [dispatch]);

  // 🔥 Stats calculation
  const stats = useMemo(() => ({
    total: visitors.length,
    inside: visitors.filter(v => v.status === "Inside").length,
    exited: visitors.filter(v => v.status === "Exited").length,
  }), [visitors]);

  // 🔥 Filter Logic
  const filtered = useMemo(() =>
    visitors.filter((v) => {
      const matchSearch = v.visitorName?.toLowerCase().includes(search.toLowerCase()) ||
        v.wing?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || v.status === statusFilter;
      return matchSearch && matchStatus;
    }), [visitors, search, statusFilter]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this visitor record?")) {
      dispatch(deleteVisitor(id));
    }
  };
  const formatTime = (date, status) => {
    // If the visitor is still inside, don't show an exit time
    if (!date || status === "Inside") return "—";
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Visitor Management</h1>
          <p className="text-sm text-gray-500">Real-time log of all society entries and security data.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/visitor/reports')}
            className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-50 font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <FiFileText /> Reports
          </button>
          <button
            onClick={() => navigate("/admin/visitor/add")}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <FiPlus /> Add Visitor
          </button>
        </div>
      </div>

      {/* SUMMARY ROW (Same as Flat Table) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Visitors", val: stats.total, color: "text-gray-800", icon: <FiActivity size={14} /> },
          { label: "Currently Inside", val: stats.inside, color: "text-green-600", icon: <FiClock size={14} /> },
          { label: "Total Exited", val: stats.exited, color: "text-gray-500", icon: <FiActivity size={14} /> },
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
              placeholder="Search by Visitor or Resident..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Inside">Inside</option>
            <option value="Exited">Exited</option>
          </select>
        </div>

        {/* TABLE BODY */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-widest border-b">
              <tr>
                <th className="px-6 py-4">Visitor Name</th>
                <th className="px-6 py-4">Resident</th>
                <th className="px-6 py-4">Flat No</th>
                <th className="px-6 py-4">Purpose</th>
                <th className="px-6 py-4">Entry Time</th>
                <th className="px-6 py-4">Exit Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => <tr key={i} className="animate-pulse"><td colSpan="7" className="p-6 bg-gray-50/50"></td></tr>)
              ) : filtered.length > 0 ? (
                filtered.map((v) => (
                  <tr key={v._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <FiUser size={14} />
                        </div>
                        {v.visitorName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {v.visitingResident?.firstName} {v.visitingResident?.lastName || ""}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiHome className="text-indigo-400" size={14} />
                        <span className="font-bold text-indigo-600">{v.flatNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 italic text-[13px]">{v.purpose || "—"}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="text-[12px] font-medium">
                        {new Date(v.entryTime).toLocaleDateString()}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    {/* exit time show */}
                      <td className="px-6 py-4 text-gray-600">
                      {v.status === "Exited" ? (
                        <>
                           <div className="text-[12px] font-medium">
                            {new Date(v.updatedAt).toLocaleDateString()}
                          </div>
                           <div className="text-[11px] text-gray-400">
                            {new Date(v.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-300 italic text-xs tracking-widest">—</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[v.status] || "bg-gray-100"}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => navigate(`/admin/visitor/edit/${v._id}`)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(v._id)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-400">No visitor records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisitorDashboard;