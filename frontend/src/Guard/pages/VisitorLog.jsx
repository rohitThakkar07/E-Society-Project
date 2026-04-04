// src/Guard/pages/VisitorLog.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search, LogOut, Clock, ChevronRight, RefreshCw, Users
} from "lucide-react";
import { fetchVisitors, markVisitorExit } from "../../store/slices/visitorSlice";

const STATUS_CONFIG = {
  Pending:  { bg: "#fef3c7", color: "#d97706", label: "Pending"  },
  Approved: { bg: "#dcfce7", color: "#16a34a", label: "Approved" },
  Inside:   { bg: "#dbeafe", color: "#1d4ed8", label: "Inside"   },
  Exited:   { bg: "#f1f5f9", color: "#64748b", label: "Exited"   },
  Denied:   { bg: "#fee2e2", color: "#dc2626", label: "Denied"   },
};

const PURPOSE_COLORS = {
  Visit:    "bg-blue-50 text-blue-600",
  Delivery: "bg-amber-50 text-amber-600",
  Service:  "bg-violet-50 text-violet-600",
  Guest:    "bg-emerald-50 text-emerald-600",
  Other:    "bg-slate-100 text-slate-500",
};

const VisitorLog = () => {
  const dispatch = useDispatch();
  const [searchParams]  = useSearchParams();
  const { visitors = [], loading } = useSelector((s) => s.visitor || {});

  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState(searchParams.get("status") || "All");
  const [dateFilter, setDate]       = useState("");
  const [exitingId, setExitingId]   = useState(null);

  useEffect(() => {
    dispatch(fetchVisitors());
  }, [dispatch]);

  const filtered = useMemo(() => {
    return (visitors || []).filter((v) => {
      const matchStatus = statusFilter === "All" || v.status === statusFilter;
      const matchSearch =
        v.visitorName?.toLowerCase().includes(search.toLowerCase()) ||
        v.mobileNumber?.includes(search) ||
        v.flatNumber?.includes(search) ||
        v.wing?.toLowerCase().includes(search.toLowerCase());
      const matchDate = !dateFilter || new Date(v.createdAt).toDateString() === new Date(dateFilter).toDateString();
      return matchStatus && matchSearch && matchDate;
    });
  }, [visitors, search, statusFilter, dateFilter]);

  const handleExit = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Mark this visitor as exited?")) return;
    setExitingId(id);
    await dispatch(markVisitorExit(id));
    setExitingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <div className="bg-white border-b border-slate-100 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Fraunces', serif" }}>
              Gate Log
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {filtered.length} record{filtered.length !== 1 ? 's' : ''} · real-time gate management
            </p>
          </div>
          <button
            onClick={() => dispatch(fetchVisitors())}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            title="Refresh"
          >
            <RefreshCw size={16} className="text-slate-600" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* FILTERS */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-5 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search visitor, flat, mobile…"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {["All", "Pending", "Approved", "Inside", "Exited", "Denied"].map((s) => (
              <button key={s} onClick={() => setStatus(s)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  statusFilter === s
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
            <RefreshCw size={24} className="text-slate-300 animate-spin mx-auto mb-4" />
            <p className="text-slate-400 text-sm">Loading visitors…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
            <Users size={32} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-sm font-medium">No visitors found for the selected filters.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-50">
              {filtered.map((v) => {
                const sc = STATUS_CONFIG[v.status] || STATUS_CONFIG.Pending;
                const isInside = v.status === "Inside" || v.status === "Approved";
                const purposeClass = PURPOSE_COLORS[v.purpose] || PURPOSE_COLORS.Other;

                return (
                  <Link key={v._id} to={`/guard/visitor/${v._id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition group cursor-pointer"
                  >
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                      {v.visitorName?.[0]?.toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-bold text-slate-800 truncate">{v.visitorName}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${purposeClass}`}>
                          {v.purpose}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{v.wing}-{v.flatNumber}</span>
                        <span>·</span>
                        <span>{v.mobileNumber}</span>
                        {v.vehicleNumber && (
                          <><span>·</span><span className="font-mono">{v.vehicleNumber}</span></>
                        )}
                      </div>
                    </div>

                    {/* Time */}
                    <div className="hidden md:block text-right min-w-[90px]">
                      <div className="flex items-center gap-1 justify-end text-xs text-slate-400">
                        <Clock size={12} />
                        {new Date(v.entryTime || v.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      {v.exitTime && (
                        <div className="flex items-center gap-1 justify-end text-xs text-slate-300 mt-0.5">
                          <LogOut size={11} />
                          {new Date(v.exitTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <span className="text-[10px] font-black px-3 py-1.5 rounded-full min-w-[70px] text-center"
                      style={{ background: sc.bg, color: sc.color }}
                    >
                      {sc.label}
                    </span>

                    {/* Exit Button */}
                    {isInside && (
                      <button
                        onClick={(e) => handleExit(v._id, e)}
                        disabled={exitingId === v._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-xs font-bold transition"
                      >
                        <LogOut size={13} />
                        {exitingId === v._id ? "…" : "Exit"}
                      </button>
                    )}

                    <ChevronRight size={16} className="text-slate-200 group-hover:text-blue-400 transition flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorLog;