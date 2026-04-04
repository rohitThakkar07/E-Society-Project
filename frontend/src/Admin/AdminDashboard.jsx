import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";

import { fetchDashboardSummary as fetchMaintenanceSummary } from "../store/slices/maintainenceSlice";
import { fetchResidents } from "../store/slices/residentSlice";
import { fetchFlats } from "../store/slices/flatSlice";
import { fetchGuards } from "../store/slices/guardSlice";
import { fetchVisitors, fetchTodayStats } from "../store/slices/visitorSlice";
import { fetchComplaints } from "../store/slices/complaintSlice";
import { fetchBookings } from "../store/slices/facilityBookingSlice";
import { fetchNotices } from "../store/slices/noticeSlice";

// ── Icon helper
const Icon = ({ path, cls = "w-5 h-5" }) => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
  </svg>
);

// ── Stat Card
const StatCard = ({ label, value, icon, iconBg, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4 ${onClick ? "cursor-pointer hover:shadow-md hover:border-blue-100 transition-all" : ""}`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      {icon}
    </div>
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

const fmt = (n) => (n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—");
const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

// ── component ─────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const maintenanceSummary = useSelector((s) => s.maintenance?.summary);
  const maintenanceLoading = useSelector((s) => s.maintenance?.summaryLoading);
  const residents          = useSelector((s) => s.resident?.residents ?? []);
  const flats              = useSelector((s) => s.flat?.list ?? []);
  const guards             = useSelector((s) => s.guard?.guards ?? []);
  const visitors           = useSelector((s) => s.visitor?.visitors ?? []);
  const todayStats         = useSelector((s) => s.visitor?.todayStats ?? {});
  const complaints         = useSelector((s) => s.complaint?.complaints ?? []);
  const bookings           = useSelector((s) => s.booking?.bookings ?? []);
  const notices            = useSelector((s) => s.notice?.list ?? []);

  useEffect(() => {
    dispatch(fetchMaintenanceSummary());
    dispatch(fetchResidents());
    dispatch(fetchFlats());
    dispatch(fetchGuards());
    dispatch(fetchVisitors());
    dispatch(fetchTodayStats());
    dispatch(fetchComplaints());
    dispatch(fetchBookings());
    dispatch(fetchNotices());
  }, [dispatch]);

  const val = (v, loading) => (loading ? "…" : (v ?? 0));
  const todayVisitorCount = todayStats.total ?? visitors.length;
  const latestComplaints  = complaints.slice(0, 3);
  const latestBookings    = bookings.slice(0, 3);
  const latestNotices     = notices.slice(0, 3);
  const chartData         = maintenanceSummary?.monthlyData ?? [];

  return (
    <div>
      {/* ── PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">Society overview & live analytics</p>
      </div>

      {/* ── SECTION: Society Stats */}
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Society Stats</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Residents"
          value={residents.length}
          iconBg="bg-blue-50"
          icon={<Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" cls="w-6 h-6 text-blue-600" />}
          onClick={() => navigate("/admin/residents")}
        />
        <StatCard
          label="Total Flats"
          value={flats.length}
          iconBg="bg-emerald-50"
          icon={<Icon path="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" cls="w-6 h-6 text-emerald-600" />}
          onClick={() => navigate("/admin/flat/list")}
        />
        <StatCard
          label="Total Guards"
          value={guards.length}
          iconBg="bg-purple-50"
          icon={<Icon path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" cls="w-6 h-6 text-purple-600" />}
          onClick={() => navigate("/admin/guards")}
        />
        <StatCard
          label="Today's Visitors"
          value={todayVisitorCount}
          iconBg="bg-amber-50"
          icon={<Icon path="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" cls="w-6 h-6 text-amber-600" />}
          onClick={() => navigate("/admin/visitors")}
        />
      </div>

      {/* ── RECENT ACTIVITIES ROW */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {[
          { title: "Latest Complaints", items: latestComplaints, key: "title,subject,type", link: "/admin/complaints", color: "bg-red-50 text-red-600" },
          { title: "Latest Bookings",   items: latestBookings,   key: "facility.name,facility", link: "/admin/facility-booking/list", color: "bg-blue-50 text-blue-600" },
          { title: "Latest Notices",    items: latestNotices,    key: "title,heading", link: "/admin/notice/list", color: "bg-emerald-50 text-emerald-600" },
        ].map(({ title, items, link, color }) => (
          <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</p>
              <button onClick={() => navigate(link)} className="text-[10px] font-bold text-blue-600 hover:underline">
                See All →
              </button>
            </div>
            <div className="p-4 space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No records yet</p>
              ) : (
                items.map((item) => (
                  <div key={item._id} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${color}`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 leading-tight">
                        {item.title || item.subject || item.type ||
                         (item.facility?.name || item.facility) ||
                         item.heading || "Record"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {formatDate(item.createdAt || item.date || item.bookingDate)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── FINANCE SECTION */}
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Finance</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Records", value: val(maintenanceSummary?.total, maintenanceLoading), iconBg: "bg-slate-100", iconClass: "text-slate-600" },
          { label: "Paid", value: val(maintenanceSummary?.paid, maintenanceLoading), iconBg: "bg-emerald-50", iconClass: "text-emerald-600", sub: maintenanceSummary?.totalCollected ? fmt(maintenanceSummary.totalCollected) : null },
          { label: "Pending", value: val(maintenanceSummary?.pending, maintenanceLoading), iconBg: "bg-amber-50", iconClass: "text-amber-600", sub: maintenanceSummary?.totalPending ? fmt(maintenanceSummary.totalPending) : null },
          { label: "Overdue", value: val(maintenanceSummary?.overdue, maintenanceLoading), iconBg: "bg-red-50", iconClass: "text-red-600" },
        ].map(({ label, value, iconBg, iconClass, sub }) => (
          <div
            key={label}
            onClick={() => navigate("/admin/maintenance/list")}
            className="admin-stat-card cursor-pointer hover:shadow-md hover:border-blue-100 transition-all"
          >
            <p className="admin-stat-label">{label}</p>
            <p className={`admin-stat-value ${iconClass}`}>{value}</p>
            {sub && <p className="text-xs text-slate-400 font-semibold mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      {/* ── CHART */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:col-span-1">
          <p className="text-sm font-bold text-slate-800 mb-1">Monthly Collection</p>
          <p className="text-[11px] text-slate-400 mb-4">Collected vs Pending breakdown</p>
          {maintenanceLoading ? (
            <div className="h-60 flex items-center justify-center text-slate-400 text-sm">Loading…</div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#34D399" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#FBBF24" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => fmt(v)} cursor={{ fill: "rgba(0,0,0,0.02)" }}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Legend verticalAlign="top" height={32} />
                <Bar dataKey="collected" name="Collected" fill="url(#colorPaid)"    barSize={28} radius={[6,6,0,0]} />
                <Bar dataKey="pending"   name="Pending"   fill="url(#colorPending)" barSize={28} radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
              <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              No monthly data available
            </div>
          )}
        </div>

        {/* Welcome card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h2 className="text-xl font-black mb-2">Welcome, Admin 👋</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Manage residents, track visitors, monitor payments, and control all society operations from one place.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: "Residents", value: residents.length },
              { label: "Complaints", value: complaints.length },
              { label: "Notices", value: notices.length },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xl font-black">{value}</p>
                <p className="text-[10px] text-blue-200 font-semibold uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;