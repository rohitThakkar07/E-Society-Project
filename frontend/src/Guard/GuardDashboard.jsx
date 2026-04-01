// src/Guard/pages/GuardDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Shield, Users, Clock, LogIn, LogOut, Bell, Search,
  TrendingUp, CheckCircle, XCircle, AlertCircle, ArrowRight,
  ChevronRight, UserCheck, Activity
} from "lucide-react";
import { fetchVisitors, fetchTodayStats } from "../store/slices/visitorSlice";

const GuardDashboard = () => {
  const dispatch = useDispatch();
  const { visitors = [], todayStats = {}, loading } = useSelector((s) => s.visitor || {});
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    dispatch(fetchVisitors());
    dispatch(fetchTodayStats());
    const t = setInterval(() => {
      setTime(new Date());
      dispatch(fetchTodayStats());
    }, 30000);
    return () => clearInterval(t);
  }, [dispatch]);

  const recentVisitors = [...(visitors || [])].slice(0, 6);

  const statusColor = {
    Pending:  { bg: "#fef3c7", text: "#d97706", dot: "#f59e0b" },
    Approved: { bg: "#dcfce7", text: "#16a34a", dot: "#22c55e" },
    Inside:   { bg: "#dbeafe", text: "#1d4ed8", dot: "#3b82f6" },
    Exited:   { bg: "#f1f5f9", text: "#64748b", dot: "#94a3b8" },
    Denied:   { bg: "#fee2e2", text: "#dc2626", dot: "#ef4444" },
  };

  const quickActions = [
    { label: "New Visitor Entry",   to: "/guard/visitor/add",    icon: UserCheck,  color: "#3b82f6", bg: "#eff6ff" },
    { label: "Gate Log",            to: "/guard/gate-log",       icon: Activity,   color: "#10b981", bg: "#f0fdf4" },
    { label: "Search Resident",     to: "/guard/search-resident",icon: Search,     color: "#8b5cf6", bg: "#f5f3ff" },
    { label: "Pending Approvals",   to: "/guard/visitors?status=Pending", icon: AlertCircle, color: "#f59e0b", bg: "#fffbeb" },
  ];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="min-h-screen bg-slate-50">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:wght@800;900&display=swap');`}</style>

      {/* TOP BAR */}
      <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <span className="text-slate-500 text-sm font-semibold">Guard Panel</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
            Welcome, {user?.name?.split(" ")[0] || "Guard"}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-slate-800" style={{ fontFamily: "'Fraunces', serif" }}>
            {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="text-xs text-slate-400 font-semibold">
            {time.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "short" })}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Today's Total",  value: todayStats.total   ?? 0, icon: Users,        color: "#3b82f6", bg: "#eff6ff" },
            { label: "Pending",        value: todayStats.pending ?? 0, icon: AlertCircle,  color: "#f59e0b", bg: "#fffbeb" },
            { label: "Inside Now",     value: todayStats.inside  ?? 0, icon: LogIn,        color: "#10b981", bg: "#f0fdf4" },
            { label: "Exited",         value: todayStats.exited  ?? 0, icon: LogOut,       color: "#6366f1", bg: "#eef2ff" },
            { label: "Denied",         value: todayStats.denied  ?? 0, icon: XCircle,      color: "#ef4444", bg: "#fef2f2" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm">
                <div style={{ background: s.bg, borderRadius: "12px", padding: "10px" }}>
                  <Icon size={20} style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
                    {loading ? "—" : s.value}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* QUICK ACTIONS */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h2 className="font-black text-slate-800 mb-5 text-lg" style={{ fontFamily: "'Fraunces', serif" }}>
              Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <Link key={a.to} to={a.to}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition group"
                  >
                    <div style={{ background: a.bg, borderRadius: "10px", padding: "10px" }}>
                      <Icon size={18} style={{ color: a.color }} />
                    </div>
                    <span className="flex-1 text-sm font-bold text-slate-700">{a.label}</span>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-400 transition" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RECENT VISITORS */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-black text-slate-800 text-lg" style={{ fontFamily: "'Fraunces', serif" }}>
                Recent Visitors
              </h2>
              <Link to="/guard/visitors" className="text-xs text-blue-600 font-bold flex items-center gap-1">
                View All <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400 text-sm">Loading…</div>
            ) : recentVisitors.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No visitors yet today.</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentVisitors.map((v) => {
                  const sc = statusColor[v.status] || statusColor.Pending;
                  return (
                    <Link key={v._id} to={`/guard/visitor/${v._id}`}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {v.visitorName?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{v.visitorName}</p>
                        <p className="text-xs text-slate-400">
                          {v.wing}-{v.flatNumber} · {v.purpose}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className="inline-block text-[10px] font-black px-2.5 py-1 rounded-full uppercase"
                          style={{ background: sc.bg, color: sc.text }}
                        >
                          {v.status}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {new Date(v.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardDashboard;