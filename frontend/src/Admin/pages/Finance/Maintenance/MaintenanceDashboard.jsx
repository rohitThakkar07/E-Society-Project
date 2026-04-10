import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMaintenanceList, fetchDashboardSummary } from "../../../../store/slices/maintainenceSlice";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

/* ── Sub-nav tabs ─────────────────────────────────────────────────────────── */
const TABS = [
  { label: "Overview",   path: "/admin/maintenance/dashboard", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label: "Records",    path: "/admin/maintenance/list",      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Generate",   path: "/admin/maintenance/generate",  icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
];

const SubNav = ({ navigate, location }) => (
  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-6 w-fit flex-wrap">
    {TABS.map((tab) => {
      const active = location.pathname === tab.path;
      return (
        <button
          key={tab.path}
          onClick={() => navigate(tab.path)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            active ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
          </svg>
          {tab.label}
        </button>
      );
    })}
  </div>
);

/* ── Main Component ───────────────────────────────────────────────────────── */
const MaintenanceDashboard = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();
  const { summary, summaryLoading } = useSelector((s) => s.maintenance);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchMaintenanceList());
  }, [dispatch]);

  const stats = [
    { label: "Total Collection", val: `₹${(summary?.totalCollected || 0).toLocaleString()}`, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Total Pending",    val: `₹${(summary?.totalPending  || 0).toLocaleString()}`, iconBg: "bg-amber-50",   iconColor: "text-amber-600",   icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Overdue Amount",   val: `₹${(summary?.totalOverdue  || 0).toLocaleString()}`, iconBg: "bg-red-50",     iconColor: "text-red-600",     icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
    { label: "Total Bills",      val: summary?.total || 0,                                   iconBg: "bg-blue-50",    iconColor: "text-blue-600",    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Maintenance</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Track society maintenance bills and collections.</p>
        </div>
        <button
          onClick={() => navigate("/admin/maintenance/add")}
          className="admin-btn-primary"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Bill
        </button>
      </div>

      {/* Sub Navigation */}
      <SubNav navigate={navigate} location={location} />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconBg}`}>
              <svg className={`w-6 h-6 ${s.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{s.label}</p>
              <p className="text-xl font-black text-slate-900">{summaryLoading ? "…" : s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <p className="text-sm font-bold text-slate-800 mb-1">Revenue Trend</p>
        <p className="text-[11px] text-slate-400 mb-4">Monthly collected vs pending</p>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={summary?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                formatter={(v) => `₹${Number(v).toLocaleString()}`}
              />
              <Line type="monotone" dataKey="collected" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }} name="Collected" />
              <Line type="monotone" dataKey="pending"   stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: "#ef4444" }} name="Pending" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;