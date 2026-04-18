import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2, FiSearch, FiPlus, FiUser, FiHome, FiClock, FiActivity, FiFileText } from "react-icons/fi";
import { fetchVisitors, deleteVisitor } from "../../../store/slices/visitorSlice";

const STATUS_STYLE = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Inside: "bg-green-100 text-green-700 border-green-200",
  Exited: "bg-slate-100 text-slate-500 border-slate-200",
  Denied: "bg-rose-100 text-rose-700 border-rose-200",
};

import { FiShield, FiXCircle, FiKey } from "react-icons/fi";
import { approveVisitor, denyVisitor, updateVisitor, markExit } from "../../../store/slices/visitorSlice";
import { toast } from "react-toastify";

const VisitorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { visitors = [], loading } = useSelector((state) => state.visitor || {});

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingId, setVerifyingId] = useState(null);

  useEffect(() => {
    dispatch(fetchVisitors());
  }, [dispatch]);

  // 🔥 OTP Handle
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("Enter valid 6-digit OTP");

    const res = await dispatch(approveVisitor({ id: verifyingId, otp }));
    if (res.meta.requestStatus === "fulfilled") {
      setShowOtpModal(false);
      setOtp("");
      setVerifyingId(null);
      dispatch(fetchVisitors());
    }
  };

  // 🔥 Stats calculation
  const stats = useMemo(() => ({
    total: visitors.length,
    pending: visitors.filter(v => v.status === "Pending").length,
    inside: visitors.filter(v => ["Inside", "Approved"].includes(v.status)).length,
  }), [visitors]);

  // 🔥 Filter Logic
  const filtered = useMemo(() =>
    visitors.filter((v) => {
      const q = search.toLowerCase();
      const matchSearch = v.visitorName?.toLowerCase().includes(q) ||
        v.wing?.toLowerCase().includes(q) ||
        v.flatNumber?.toLowerCase().includes(q) ||
        v.visitingResident?.firstName?.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || v.status === statusFilter;
      return matchSearch && matchStatus;
    }), [visitors, search, statusFilter]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this visitor record?")) {
      dispatch(deleteVisitor(id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-['Inter',_sans-serif]">
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-3 border border-blue-100">
            <FiActivity size={12} /> Secure Gate Logs
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Visitor Management</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Monitor community entry logs and verify visitor identities.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/visitor/reports')}
            className="group bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl hover:bg-slate-50 font-bold text-sm flex items-center gap-2 transition-all shadow-sm"
          >
            <FiFileText className="text-slate-400 group-hover:text-blue-500 transition-colors" /> Reports
          </button>
          <button
            onClick={() => navigate("/admin/visitor/add")}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <FiPlus /> New Entry
          </button>
        </div>
      </div>

      {/* SUMMARY ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Visitors", val: stats.total, color: "text-slate-800", bg: "bg-blue-500/10", icon: <FiUser size={18} /> },
          { label: "Awaiting Verify", val: stats.pending, color: "text-amber-600", bg: "bg-amber-500/10", icon: <FiClock size={18} /> },
          { label: "Inside society", val: stats.inside, color: "text-emerald-600", bg: "bg-emerald-500/10", icon: <FiActivity size={18} /> },
        ].map(({ label, val, color, bg, icon }) => (
          <div key={label} className="bg-white rounded-3xl shadow-sm p-6 border border-slate-100 flex items-center gap-5">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${bg} ${color}`}>{icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
              <p className={`text-2xl font-black ${color}`}>{loading ? "..." : (val ?? 0)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        {/* SEARCH & FILTER BAR */}
        <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative flex-1 min-w-[280px]">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, flat or wing..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 px-4 py-3 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Inside">Inside</option>
              <option value="Exited">Exited</option>
            </select>
          </div>
        </div>

        {/* TABLE BODY */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
              <tr>
                <th className="px-6 py-2">Visitor</th>
                <th className="px-6 py-2">Resident / Flat</th>
                <th className="px-6 py-2 text-center">Purpose</th>
                <th className="px-6 py-2">Entry Time</th>
                <th className="px-6 py-2 text-center">Status</th>
                <th className="px-6 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                [...Array(5)].map((_, i) => <tr key={i} className="animate-pulse"><td colSpan="6" className="p-4 bg-gray-50/50"></td></tr>)
              ) : filtered.length > 0 ? (
                filtered.map((v) => (
                  <tr key={v._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                          {v.visitorName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-tight">{v.visitorName}</p>
                          <p className="text-xs text-gray-500 leading-tight">{v.mobileNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 leading-tight">{v.wing?.toUpperCase()}-{v.flatNumber}</span>
                        <span className="text-xs text-gray-500 leading-tight">{v.visitingResident?.firstName} {v.visitingResident?.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-2 text-center">
                      <span className="text-[11px] text-gray-600 px-2 py-0.5 bg-gray-100 rounded">{v.purpose || "Visit"}</span>
                    </td>
                    <td className="px-6 py-2">
                      <div className="text-gray-900 font-medium text-sm leading-tight">
                        {v.entryTime ? new Date(v.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                      </div>
                      <div className="text-[11px] text-gray-500 leading-tight">
                        {v.entryTime ? new Date(v.entryTime).toLocaleDateString() : "Pending"}
                      </div>
                    </td>

                    <td className="px-6 py-2">
                      <div className="flex items-center justify-center">
                        {v.status === "Pending" ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => { setVerifyingId(v._id); setShowOtpModal(true); }}
                              className="p-1.5 bg-amber-50 text-amber-600 rounded-md hover:bg-amber-100 transition-colors"
                              title="Verify OTP"
                            >
                              <FiShield size={14} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("Deny entry?")) {
                                  dispatch(denyVisitor(v._id)).then(() => dispatch(fetchVisitors()));
                                }
                              }}
                              className="p-1.5 bg-rose-50 text-rose-600 rounded-md hover:bg-rose-100 transition-colors"
                              title="Deny Entry"
                            >
                              <FiXCircle size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="relative">
                            <select
                              value={v.status}
                              onChange={(e) => {
                                const newStatus = e.target.value;
                                if (window.confirm(`Change status to ${newStatus}?`)) {
                                  if (newStatus === "Exited") {
                                    dispatch(markExit(v._id)).then(() => dispatch(fetchVisitors()));
                                  } else {
                                    dispatch(updateVisitor({ id: v._id, data: { status: newStatus } })).then(() => dispatch(fetchVisitors()));
                                  }
                                }
                              }}
                              className={`appearance-none pl-2 pr-6 py-1 rounded-md text-[11px] font-bold border outline-none cursor-pointer transition-all ${STATUS_STYLE[v.status] || "bg-gray-100"}`}
                            >
                              <option value="Inside">Inside</option>
                              <option value="Exited">Exited</option>
                              <option value="Denied">Denied</option>
                            </select>
                            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                              <FiClock size={10} />
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-2">
                      <div className="flex gap-1.5 justify-center">
                        <button
                          onClick={() => navigate(`/admin/visitor/edit/${v._id}`)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(v._id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FiUser size={48} className="text-slate-200" />
                      <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">No records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/60">
          <div className="w-full max-w-sm rounded-[2.5rem] bg-white p-8 text-center shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-emerald-50 shadow-inner">
              <FiKey size={32} className="text-emerald-600" />
            </div>
            <h2 className="mb-2 text-2xl font-black text-slate-900 tracking-tight">Verify Visitor</h2>
            <p className="mb-8 text-xs font-bold text-slate-400 uppercase tracking-widest">Enter the 6-digit OTP from resident</p>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <input
                required
                autoFocus
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="0 0 0 0 0 0"
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-5 text-center text-4xl font-black tracking-[0.3em] transition-all focus:outline-none focus:border-emerald-500 focus:bg-white"
              />

              <div className="flex gap-4">
                <button type="button" onClick={() => { setShowOtpModal(false); setOtp(""); }} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                <button type="submit" disabled={otp.length !== 6} className="flex-1 bg-emerald-600 text-white rounded-2xl py-4 text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50">Verify Identity</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorDashboard;