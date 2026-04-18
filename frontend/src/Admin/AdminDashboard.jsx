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

// ── Icons ──────────────────────────────────────────────────────────────────
import { 
  FiUsers, FiHome, FiShield, FiUserCheck, 
  FiAlertCircle, FiCalendar, FiFileText, FiActivity, 
  FiDollarSign, FiClock, FiCheckCircle, FiChevronRight
} from "react-icons/fi";

const StatCard = ({ label, value, icon, iconBg, onClick, accent }) => (
  <div
    onClick={onClick}
    className={`group relative overflow-hidden bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col justify-between transition-all duration-300 ${
      onClick ? `cursor-pointer hover:shadow-2xl hover:shadow-${accent}-500/10 hover:-translate-y-1.5 hover:border-${accent}-200` : ""
    }`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${iconBg}`}>
        {icon}
      </div>
      {onClick && (
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-slate-100 group-hover:text-slate-600">
          <FiChevronRight size={16} />
        </div>
      )}
    </div>
    
    <div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 group-hover:text-slate-500 transition-colors">{label}</p>
      <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
    </div>
    
    {/* Subtle Background Glow */}
    <div className={`absolute -bottom-8 -right-8 w-32 h-32 ${iconBg} opacity-0 group-hover:opacity-40 rounded-full blur-[40px] transition-all duration-700`} />
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
    <div className="space-y-8 font-['Inter',_sans-serif]">
      {/* ── NEW PREMIUM HEADER ── */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-10 shadow-sm transition-all hover:shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100 flex items-center gap-2">
                <FiActivity /> Live Status
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
              Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dashboard</span>
            </h1>
            <p className="text-slate-500 font-semibold mt-2.5 max-w-md text-sm">
              Welcome to the central hub. Monitor society health, analytics, and active security protocols.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex items-center gap-5 hover:bg-white hover:shadow-lg transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-[1.2rem] bg-emerald-100 flex items-center justify-center text-emerald-600 relative">
                <FiCheckCircle size={24} />
                <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Health</p>
                <p className="text-base font-black text-slate-800 tracking-tight">Optimal</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl -z-0" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl -z-0" />
      </div>

      <div className="space-y-6">
        {/* ── SECTION: Society Stats */}
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-3">
            <span className="w-8 h-1 rounded-full bg-slate-200" /> Executive summary
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Residents", val: residents.length, icon: <FiUsers size={24}/>, bg: "bg-blue-50 text-blue-600", accent: "blue", link: "/admin/residents" },
            { label: "Total Flats", val: flats.length, icon: <FiHome size={24}/>, bg: "bg-indigo-50 text-indigo-600", accent: "indigo", link: "/admin/flat/list" },
            { label: "Security Guards", val: guards.length, icon: <FiShield size={24}/>, bg: "bg-purple-50 text-purple-600", accent: "purple", link: "/admin/guards" },
            { label: "Today's Visitors", val: todayVisitorCount, icon: <FiUserCheck size={24}/>, bg: "bg-amber-50 text-amber-600", accent: "amber", link: "/admin/visitors" },
          ].map((stat, i) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.val}
              iconBg={stat.bg}
              icon={stat.icon}
              onClick={() => navigate(stat.link)}
              accent={stat.accent}
            />
          ))}
        </div>

        {/* ── RECENT ACTIVITIES ROW */}
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            { title: "Urgent Complaints", items: latestComplaints, link: "/admin/complaints", color: "text-rose-600", bg: "bg-rose-50", icon: <FiAlertCircle size={20} /> },
            { title: "Recent Bookings",   items: latestBookings,   link: "/admin/facility-booking/list", color: "text-blue-600", bg: "bg-blue-50", icon: <FiCalendar size={20} /> },
            { title: "Active Notices",    items: latestNotices,    link: "/admin/notice/list", color: "text-emerald-600", bg: "bg-emerald-50", icon: <FiFileText size={20} /> },
          ].map(({ title, items, link, color, bg, icon }) => (
            <div key={title} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group">
              <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center group-hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${bg} ${color}`}>
                    {icon}
                  </div>
                  <span className={`text-[12px] font-black text-slate-800 uppercase tracking-widest`}>{title}</span>
                </div>
                <button onClick={() => navigate(link)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                  <FiChevronRight size={18} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                </button>
              </div>
              <div className="p-8 space-y-5 flex-1 bg-white">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-6 text-center">
                    <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-4 opacity-50 text-slate-400`}>
                       {icon}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">No recent activity</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item._id} className="group/item flex items-center gap-5 cursor-pointer" onClick={() => navigate(link)}>
                      <div className={`w-12 h-12 rounded-[1.2rem] flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-lg ${bg} ${color}`}>
                         {icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-slate-800 leading-tight truncate group-hover/item:text-blue-600 transition-colors">
                          {item.title || item.subject || item.type ||
                           (item.facility?.name || item.facility) ||
                           item.heading || "Record"}
                        </p>
                        <p className="text-[11px] text-slate-400 font-bold mt-1 tracking-wide flex items-center gap-1.5">
                          <FiClock size={10} /> {formatDate(item.createdAt || item.date || item.bookingDate)}
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
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 hover:shadow-xl transition-all duration-500">
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FiActivity size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Finance Analytics</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1 tracking-widest uppercase">Maintenance Collection</p>
                </div>
              </div>
              <select className="bg-slate-50 border-none text-[11px] font-black text-slate-500 uppercase tracking-widest rounded-xl px-4 py-2.5 focus:ring-0 cursor-pointer outline-none">
                <option>Last 6 Months</option>
                <option>Current Year</option>
              </select>
            </div>

            {maintenanceLoading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Analyzing Data...</p>
              </div>
            ) : chartData.length > 0 ? (
              <div className="h-64 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.4} />
                      </linearGradient>
                      <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#cbd5e1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 800 }} axisLine={false} tickLine={false} dy={12} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 800 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{ borderRadius: "20px", border: "none", boxShadow: "0 20px 40px rgba(0,0,0,0.08)", padding: "16px", fontWeight: "900" }} 
                      formatter={(v) => fmt(v)}
                    />
                    <Bar dataKey="collected" name="Collected" fill="url(#colorPaid)" barSize={20} radius={[8, 8, 8, 8]} />
                    <Bar dataKey="pending" name="Pending" fill="url(#colorPending)" barSize={20} radius={[8, 8, 8, 8]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-300">
                 <FiActivity size={48} className="mb-4 opacity-20" />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">No data available</p>
              </div>
            )}
          </div>

          {/* Detailed Stats Column */}
          <div className="grid grid-cols-2 gap-6">
               {[
                  { label: "Total Revenue", value: fmt(maintenanceSummary?.totalCollected || 0), desc: "Current period", color: "text-blue-600", bg: "bg-blue-50", icon: <FiDollarSign size={24} /> },
                  { label: "Pending Dues", value: fmt(maintenanceSummary?.totalPending || 0), desc: "Across all units", color: "text-amber-600", bg: "bg-amber-50", icon: <FiClock size={24} /> },
                  { label: "Active Polls", value: "3", desc: "Citizen engagement", color: "text-purple-600", bg: "bg-purple-50", icon: <FiActivity size={24} /> },
                  { label: "Maintenance", value: val(maintenanceSummary?.paid, maintenanceLoading), desc: "Payments verified", color: "text-emerald-600", bg: "bg-emerald-50", icon: <FiCheckCircle size={24} /> },
               ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm flex flex-col justify-between group hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className={`text-2xl font-black text-slate-900 tracking-tight leading-none`}>{stat.value}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-bold tracking-wide">{stat.desc}</p>
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