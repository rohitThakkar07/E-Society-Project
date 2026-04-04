// src/Guard/GuardDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Users, LogIn, LogOut, Clock, ChevronRight,
  UserCheck, ClipboardList, Search, TrendingUp,
  AlertCircle, CheckCircle2, XCircle
} from "lucide-react";
import { fetchVisitors, fetchTodayStats } from "../store/slices/visitorSlice";

const ACCENT = "#4F6EF7";

const STATUS_COLOR = {
  Pending: { bg: "#FFF8E1", text: "#F59E0B", dot: "#F59E0B" },
  Approved: { bg: "#E8F5E9", text: "#16A34A", dot: "#16A34A" },
  Inside: { bg: "#E3F2FD", text: "#1D4ED8", dot: "#1D4ED8" },
  Exited: { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" },
  Denied: { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
};

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

  const recentVisitors = [...(visitors || [])].slice(0, 8);

  const stats = [
    { label: "Today's Total", value: todayStats.total ?? 0, icon: Users, color: ACCENT, bg: "#EEF1FE", trend: "+12%" },
    { label: "Pending", value: todayStats.pending ?? 0, icon: AlertCircle, color: "#F59E0B", bg: "#FFF8E1", trend: null },
    { label: "Inside Now", value: todayStats.inside ?? 0, icon: LogIn, color: "#10B981", bg: "#E8F5E9", trend: null },
    { label: "Exited", value: todayStats.exited ?? 0, icon: LogOut, color: "#6366F1", bg: "#EEF2FF", trend: null },
    { label: "Denied", value: todayStats.denied ?? 0, icon: XCircle, color: "#EF4444", bg: "#FEE2E2", trend: null },
  ];

  const quickActions = [
    { label: "New Visitor", icon: UserCheck, to: "/guard/visitor/add", color: ACCENT, bg: "#EEF1FE" },
    { label: "Visitor Log", icon: Users, to: "/guard/visitors", color: "#10B981", bg: "#E8F5E9" },
    { label: "Gate Log", icon: ClipboardList, to: "/guard/gate-log", color: "#8B5CF6", bg: "#F3F0FF" },
    { label: "Search Resident", icon: Search, to: "/guard/search-resident", color: "#F59E0B", bg: "#FFF8E1" },
  ];

  return (
    <div className="p-6 space-y-6 min-h-full" style={{ background: "#F4F5FA" }}>

      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, <span style={{ color: ACCENT }}>{user?.name?.split(" ")[0] || "Guard"}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {time.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end bg-white rounded-2xl px-5 py-3 shadow-sm border border-slate-100">
          <p className="text-2xl font-black text-slate-800 tabular-nums">
            {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Live Clock</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label}
              className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: s.bg }}>
                  <Icon size={17} style={{ color: s.color }} />
                </div>
                {s.trend && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <TrendingUp size={11} /> {s.trend}
                  </span>
                )}
              </div>
              <p className="text-2xl font-black text-slate-800">{loading ? "—" : s.value}</p>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.to} to={a.to}
                className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-center gap-2.5 text-center group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: a.bg }}>
                  <Icon size={22} style={{ color: a.color }} />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                  {a.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Visitors */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
          <div>
            <h2 className="font-bold text-slate-800">Recent Visitors</h2>
            <p className="text-xs text-slate-400 mt-0.5">Latest gate activity</p>
          </div>
          <Link to="/guard/visitors"
            className="flex items-center gap-1 text-xs font-semibold transition-colors"
            style={{ color: ACCENT }}>
            View All <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading…</div>
        ) : recentVisitors.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={36} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-medium">No visitors logged yet today.</p>
            <Link to="/guard/visitor/add"
              className="inline-flex items-center gap-1 mt-4 text-sm font-semibold hover:underline"
              style={{ color: ACCENT }}>
              Log first visitor →
            </Link>
          </div>
        ) : (
          <div>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400"
              style={{ background: "#F8FAFC" }}>
              <div className="col-span-4">Visitor</div>
              <div className="col-span-3 hidden sm:block">Unit · Purpose</div>
              <div className="col-span-3 hidden md:block">Time</div>
              <div className="col-span-5 sm:col-span-2">Status</div>
            </div>
            {recentVisitors.map((v) => {
              const sc = STATUS_COLOR[v.status] || STATUS_COLOR.Pending;
              return (
                <Link key={v._id} to={`/guard/visitor/${v._id}`}
                  className="grid grid-cols-12 gap-2 px-5 py-3.5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group items-center">
                  {/* Visitor */}
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0"
                      style={{ background: ACCENT }}>
                      {v.visitorName?.[0]?.toUpperCase()}
                    </div>
                    <p className="text-sm font-semibold text-slate-800 truncate">{v.visitorName}</p>
                  </div>
                  {/* Unit */}
                  <div className="col-span-3 hidden sm:flex items-center gap-1 text-xs text-slate-500">
                    <span className="font-semibold text-slate-600">{v.wing}-{v.flatNumber}</span>
                    <span className="text-slate-300">·</span>
                    <span>{v.purpose}</span>
                  </div>
                  {/* Time */}
                  <div className="col-span-3 hidden md:flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={12} />
                    {new Date(v.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {/* Status */}
                  <div className="col-span-5 sm:col-span-2 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: sc.bg, color: sc.text }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                      {v.status}
                    </span>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors hidden sm:block" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuardDashboard;