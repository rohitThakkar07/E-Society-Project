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
    className={`group relative overflow-hidden bg-white rounded-3xl border border-slate-100 p-6 flex items-center gap-5 transition-all duration-300 ${
      onClick ? "cursor-pointer hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 hover:border-blue-100" : ""
    }`}
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 ${iconBg}`}>
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-500 transition-colors">{label}</p>
      <div className="flex items-baseline gap-1">
        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
    
    {/* Subtle Background Glow on Hover */}
    <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-current opacity-0 group-hover:opacity-[0.03] rounded-full blur-2xl transition-opacity duration-500" />
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ── NEW PREMIUM HEADER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                Management Portal
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Admin <span className="text-blue-600">Dashboard</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2 max-w-md">
              Welcome back! Here's what's happening in your society today.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Icon path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" cls="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Live Status</p>
                <p className="text-sm font-bold text-slate-800">System Healthy</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-0" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-50/50 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl -z-0" />
      </div>

      <div className="space-y-6">
        {/* ── SECTION: Society Stats */}
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-4 h-px bg-slate-200" /> Society Overview
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            { title: "Latest Complaints", items: latestComplaints, link: "/admin/complaints", color: "text-red-600", bg: "bg-red-50", accent: "border-red-100" },
            { title: "Latest Bookings",   items: latestBookings,   link: "/admin/facility-booking/list", color: "text-blue-600", bg: "bg-blue-50", accent: "border-blue-100" },
            { title: "Latest Notices",    items: latestNotices,    link: "/admin/notice/list", color: "text-emerald-600", bg: "bg-emerald-50", accent: "border-emerald-100" },
          ].map(({ title, items, link, color, bg, accent }) => (
            <div key={title} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center">
                <span className={`text-[10px] font-bold ${color} uppercase tracking-wider px-2 py-0.5 rounded-md ${bg}`}>{title}</span>
                <button onClick={() => navigate(link)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors group">
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-4 flex-1">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-6 text-center">
                    <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-3 opacity-40`}>
                       <Icon path="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 4-8-4" cls="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-slate-400">No activity yet</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item._id} className="group flex items-center gap-4 cursor-pointer" onClick={() => navigate(link)}>
                      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-all group-hover:scale-110 ${bg} ${color}`}>
                         <div className="w-2 h-2 rounded-full bg-current" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800 leading-tight truncate">
                          {item.title || item.subject || item.type ||
                           (item.facility?.name || item.facility) ||
                           item.heading || "Record"}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
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

        {/* ── FINANCE & ANALYTICS SECTION ── */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Main Chart Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900">Finance Analytics</h3>
                <p className="text-sm text-slate-400 font-medium mt-1">Maintenance collection tracking</p>
              </div>
              <select className="bg-slate-50 border-none text-[11px] font-bold text-slate-500 rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer">
                <option>Last 6 Months</option>
                <option>Current Year</option>
              </select>
            </div>

            {maintenanceLoading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Analyzing Data...</p>
              </div>
            ) : chartData.length > 0 ? (
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.4} />
                      </linearGradient>
                      <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#94A3B8" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", padding: "12px" }} 
                      formatter={(v) => fmt(v)}
                    />
                    <Bar dataKey="collected" name="Collected" fill="url(#colorPaid)" barSize={24} radius={[6, 6, 0, 0]} />
                    <Bar dataKey="pending" name="Pending" fill="url(#colorPending)" barSize={24} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-300">
                 <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" cls="w-12 h-12 mb-4 opacity-20" />
                 <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No data available for chart</p>
              </div>
            )}
          </div>

          {/* Detailed Stats Column */}
          <div className="grid grid-cols-2 gap-4">
               {[
                  { label: "Total Revenue", value: fmt(maintenanceSummary?.totalCollected || 0), desc: "Current period", color: "text-blue-600", bg: "bg-blue-50", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                  { label: "Pending Dues", value: fmt(maintenanceSummary?.totalPending || 0), desc: "Across all units", color: "text-amber-600", bg: "bg-amber-50", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
                  { label: "Active Polls", value: "3", desc: "Citizen engagement", color: "text-purple-600", bg: "bg-purple-50", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
                  { label: "Maintenance", value: val(maintenanceSummary?.paid, maintenanceLoading), desc: "Payments verified", color: "text-emerald-600", bg: "bg-emerald-50", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
               ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-colors">
                    <div className={`w-10 h-10 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                      <Icon path={stat.icon} cls="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className={`text-xl font-black text-slate-900 leading-none`}>{stat.value}</p>
                      <p className="text-[11px] text-slate-400 mt-2 font-medium">{stat.desc}</p>
                    </div>
                  </div>
               ))}
          </div>
        </div>

        {/* ── FOOTER WELCOME BANNER ── */}
        <div className="relative rounded-3xl p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white overflow-hidden shadow-xl">
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl">👋</div>
                 <div>
                    <h3 className="text-2xl font-black mb-1">Welcome back, Admin!</h3>
                    <p className="text-slate-400 text-sm font-medium">Your society operations are running smoothly. Need any help?</p>
                 </div>
              </div>
              <div className="flex gap-3">
                 <button onClick={() => navigate("/admin/notices")} className="px-5 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-colors">Create Notice</button>
                 <button onClick={() => navigate("/admin/complaints")} className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-colors">View Complaints</button>
              </div>
           </div>
           
           {/* Decorative mesh */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
        </div>
      </div>
    </div>

  );
};

export default AdminDashboard;