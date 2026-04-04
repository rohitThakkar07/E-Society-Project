// src/Guard/GuardDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Users, LogIn, LogOut, AlertCircle, XCircle,
  CheckCircle, ChevronRight, Clock
} from "lucide-react";
import { fetchVisitors, fetchTodayStats } from "../store/slices/visitorSlice";

const STATUS_COLOR = {
  Pending:  { bg: "#fef3c7", text: "#d97706" },
  Approved: { bg: "#dcfce7", text: "#16a34a" },
  Inside:   { bg: "#dbeafe", text: "#1d4ed8" },
  Exited:   { bg: "#f1f5f9", text: "#64748b" },
  Denied:   { bg: "#fee2e2", text: "#dc2626" },
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
    { label: "Today's Total", value: todayStats.total   ?? 0, icon: Users,       color: "#3b82f6", bg: "#eff6ff" },
    { label: "Pending",       value: todayStats.pending ?? 0, icon: AlertCircle, color: "#f59e0b", bg: "#fffbeb" },
    { label: "Inside Now",    value: todayStats.inside  ?? 0, icon: LogIn,       color: "#10b981", bg: "#f0fdf4" },
    { label: "Exited",        value: todayStats.exited  ?? 0, icon: LogOut,      color: "#6366f1", bg: "#eef2ff" },
    { label: "Denied",        value: todayStats.denied  ?? 0, icon: XCircle,     color: "#ef4444", bg: "#fef2f2" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* PAGE HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
            Welcome, {user?.name?.split(" ")[0] || "Guard"} 👋
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {time.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-3xl font-black text-slate-800 tabular-nums" style={{ fontFamily: "'Fraunces', serif" }}>
            {time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Live</p>
        </div>
      </div>

      <div className="px-6 py-6 max-w-6xl mx-auto space-y-6">

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
                <div style={{ background: s.bg }} className="rounded-xl p-2.5 shrink-0">
                  <Icon size={18} style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-xl font-black text-slate-900 leading-none" style={{ fontFamily: "'Fraunces', serif" }}>
                    {loading ? "—" : s.value}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* RECENT VISITORS — full width */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="font-black text-slate-800 text-lg" style={{ fontFamily: "'Fraunces', serif" }}>
                Recent Visitors
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Latest gate activity</p>
            </div>
            <Link
              to="/guard/visitors"
              className="flex items-center gap-1 text-xs text-blue-600 font-bold hover:text-blue-700 transition"
            >
              View All <ChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Loading…</div>
          ) : recentVisitors.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={36} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-medium">No visitors logged yet today.</p>
              <Link
                to="/guard/visitor/add"
                className="inline-flex items-center gap-1 mt-4 text-blue-600 text-sm font-bold hover:underline"
              >
                Log first visitor →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentVisitors.map((v) => {
                const sc = STATUS_COLOR[v.status] || STATUS_COLOR.Pending;
                return (
                  <Link
                    key={v._id}
                    to={`/guard/visitor/${v._id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition group"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                      {v.visitorName?.[0]?.toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{v.visitorName}</p>
                      <p className="text-xs text-slate-400 font-medium">
                        {v.wing}-{v.flatNumber} · {v.purpose}
                        {v.mobileNumber && ` · ${v.mobileNumber}`}
                      </p>
                    </div>

                    {/* Time */}
                    <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 shrink-0">
                      <Clock size={12} />
                      {new Date(v.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </div>

                    {/* Status badge */}
                    <span
                      className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase shrink-0"
                      style={{ background: sc.bg, color: sc.text }}
                    >
                      {v.status}
                    </span>

                    <ChevronRight size={15} className="text-slate-200 group-hover:text-blue-400 transition shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default GuardDashboard;