// src/Guard/pages/VisitorLog.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search, LogOut, Clock, ChevronRight, RefreshCw, Users, Filter, MapPin
} from "lucide-react";
import { fetchVisitors, markVisitorExit } from "../../store/slices/visitorSlice";
import { PageLoaderInline } from "../../components/PageLoader";

const ACCENT = "#4F6EF7";

const STATUS_CONFIG = {
  Pending:  { bg: "#FFF8E1", color: "#F59E0B", dot: "#F59E0B", label: "Pending"  },
  Approved: { bg: "#E8F5E9", color: "#16A34A", dot: "#16A34A", label: "Approved" },
  Inside:   { bg: "#E3F2FD", color: "#1D4ED8", dot: "#1D4ED8", label: "Inside"   },
  Exited:   { bg: "#F1F5F9", color: "#64748B", dot: "#94A3B8", label: "Exited"   },
  Denied:   { bg: "#FEE2E2", color: "#DC2626", dot: "#DC2626", label: "Denied"   },
};

const PURPOSE_COLORS = {
  Visit:    { bg: "#EEF1FE", color: ACCENT },
  Delivery: { bg: "#FFF8E1", color: "#F59E0B" },
  Service:  { bg: "#F3F0FF", color: "#8B5CF6" },
  Guest:    { bg: "#E8F5E9", color: "#16A34A" },
  Other:    { bg: "#F1F5F9", color: "#64748B" },
};

const VisitorLog = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { visitors = [], loading } = useSelector((s) => s.visitor || {});

  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState(searchParams.get("status") || "All");
  const [dateFilter, setDate]     = useState("");
  const [exitingId, setExitingId] = useState(null);

  useEffect(() => { dispatch(fetchVisitors()); }, [dispatch]);

  const filtered = useMemo(() => {
    return (visitors || []).filter((v) => {
      const matchStatus = statusFilter === "All" || v.status === statusFilter;
      const matchSearch =
        v.visitorName?.toLowerCase().includes(search.toLowerCase()) ||
        v.mobileNumber?.includes(search) ||
        v.flatNumber?.includes(search) ||
        v.wing?.toLowerCase().includes(search.toLowerCase());
      const matchDate = !dateFilter ||
        new Date(v.createdAt).toDateString() === new Date(dateFilter).toDateString();
      return matchStatus && matchSearch && matchDate;
    });
  }, [visitors, search, statusFilter, dateFilter]);

  const handleExit = async (id, e) => {
    e.preventDefault(); e.stopPropagation();
    if (!window.confirm("Mark this visitor as exited?")) return;
    setExitingId(id);
    await dispatch(markVisitorExit(id));
    setExitingId(null);
  };

  return (
    <div className="p-6 space-y-5 min-h-full" style={{ background: "#F4F5FA" }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Gate Log</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""} · real-time gate management
          </p>
        </div>
        <button onClick={() => dispatch(fetchVisitors())}
                className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-sm">
          <RefreshCw size={15} className={`text-slate-500 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search visitor, flat, mobile…"
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={14} className="text-slate-400" />
          {["All", "Pending", "Approved", "Inside", "Exited", "Denied"].map((s) => (
            <button key={s} onClick={() => setStatus(s)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
                    style={statusFilter === s
                      ? { background: ACCENT, color: "#fff", borderColor: ACCENT }
                      : { background: "#F8FAFC", color: "#64748B", borderColor: "#E2E8F0" }}>
              {s}
            </button>
          ))}
        </div>

        <input type="date" value={dateFilter}
               onChange={(e) => setDate(e.target.value)}
               className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 bg-slate-50 focus:outline-none" />
      </div>

      {/* List */}
      {loading ? (
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <PageLoaderInline message="Loading visitors…" className="p-12" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-sm">
          <Users size={36} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 text-sm font-medium">No visitors found for the selected filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100"
               style={{ gridTemplateColumns: "2fr 1.5fr 1.2fr 1fr 1fr", background: "#F8FAFC" }}>
            <div>Visitor</div>
            <div className="hidden sm:block">Unit · Purpose</div>
            <div className="hidden md:block">Entry / Exit</div>
            <div>Status</div>
            <div className="text-center">Action</div>
          </div>

          <div>
            {filtered.map((v) => {
              const sc         = STATUS_CONFIG[v.status] || STATUS_CONFIG.Pending;
              const pc         = PURPOSE_COLORS[v.purpose] || PURPOSE_COLORS.Other;
              const isInside   = v.status === "Inside" || v.status === "Approved";

              return (
                <Link key={v._id} to={`/guard/visitor/${v._id}`}
                      className="grid px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group items-center"
                      style={{ gridTemplateColumns: "2fr 1.5fr 1.2fr 1fr 1fr" }}>

                  {/* Visitor */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm"
                         style={{ background: ACCENT }}>
                      {v.visitorName?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{v.visitorName}</p>
                      <p className="text-xs text-slate-400 sm:hidden">{v.wing}-{v.flatNumber}</p>
                    </div>
                  </div>

                  {/* Unit + Purpose */}
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                      <MapPin size={11} className="text-slate-400" />
                      {v.wing}-{v.flatNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                          style={{ background: pc.bg, color: pc.color }}>
                      {v.purpose}
                    </span>
                  </div>

                  {/* Times */}
                  <div className="hidden md:block">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={11} className="text-slate-400" />
                      {new Date(v.entryTime || v.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    {v.exitTime && (
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <LogOut size={10} />
                        {new Date(v.exitTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
                          style={{ background: sc.bg, color: sc.color }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                      {sc.label}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-center" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    {isInside ? (
                      <button onClick={(e) => handleExit(v._id, e)}
                              disabled={exitingId === v._id}
                              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                              style={{ background: "#FFF3E0", color: "#F59E0B" }}
                              onMouseEnter={e => e.currentTarget.style.background = "#FFE0B2"}
                              onMouseLeave={e => e.currentTarget.style.background = "#FFF3E0"}>
                        <LogOut size={12} />
                        {exitingId === v._id ? "…" : "Exit"}
                      </button>
                    ) : (
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorLog;