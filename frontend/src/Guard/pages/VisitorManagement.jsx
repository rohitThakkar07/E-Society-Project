// src/Guard/pages/VisitorManagement.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Users, Plus, Search, CheckCircle, XCircle,
  Clock, MapPin, Key, ShieldCheck, RefreshCw, ChevronRight,
  ChevronLeft, Filter
} from "lucide-react";
import { fetchVisitors, denyVisitor, approveVisitor } from "../../store/slices/visitorSlice";
import { toast } from "react-toastify";

const ACCENT = "#4F6EF7";

const statusConfig = {
  Pending:       { bg: "#FFF8E1", color: "#F59E0B", dot: "#F59E0B" },
  Approved:      { bg: "#E8F5E9", color: "#16A34A", dot: "#16A34A" },
  Denied:        { bg: "#FEE2E2", color: "#DC2626", dot: "#DC2626" },
  Inside:        { bg: "#E3F2FD", color: "#1D4ED8", dot: "#1D4ED8" },
  Exited:        { bg: "#F1F5F9", color: "#64748B", dot: "#94A3B8" },
  "Checked Out": { bg: "#F1F5F9", color: "#64748B", dot: "#94A3B8" },
};

const ROWS_OPTIONS = [10, 20, 50];

const VisitorManagement = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { visitors = [], loading } = useSelector((s) => s.visitor || {});

  const user    = JSON.parse(localStorage.getItem("userData") || "{}");
  const isGuard = ["guard","admin"].includes(user?.role?.toLowerCase());

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp,          setOtp]          = useState("");
  const [verifyingId,  setVerifyingId]  = useState(null);

  const [search,      setSearch]      = useState("");
  const [filter,      setFilter]      = useState("All");
  const [page,        setPage]        = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => { dispatch(fetchVisitors()); }, [dispatch]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error("Enter valid 6-digit OTP"); return; }
    const res = await dispatch(approveVisitor({ id: verifyingId, otp }));
    if (res.meta.requestStatus === "fulfilled") {
      setShowOtpModal(false); setOtp(""); setVerifyingId(null);
    }
  };

  const filtered = useMemo(() =>
    (visitors || []).filter((v) => {
      const matchStatus = filter === "All" || v.status === filter;
      const q = search.toLowerCase();
      const matchSearch =
        v.visitorName?.toLowerCase().includes(q) ||
        v.mobileNumber?.includes(search) ||
        v.wing?.toLowerCase().includes(q) ||
        v.flatNumber?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    }),
    [visitors, filter, search]
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated  = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const StatusBadge = ({ status }) => {
    const sc = statusConfig[status] || statusConfig.Pending;
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: sc.bg, color: sc.color }}>
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sc.dot }} />
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-5 min-h-full" style={{ background: "#F4F5FA" }}>

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Visitor Log</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""} · OTP-verified gate entries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => dispatch(fetchVisitors())}
                  className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-sm"
                  title="Refresh">
            <RefreshCw size={15} className={`text-slate-500 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={() => navigate("/guard/visitor/add")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                  style={{ background: ACCENT }}>
            <Plus size={15} /> New Entry
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search visitor, flat, wing, mobile…"
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-slate-50"
            style={{ "--tw-ring-color": ACCENT + "40" }}
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={14} className="text-slate-400" />
          {["All", "Pending", "Approved", "Inside", "Exited", "Denied"].map((s) => (
            <button key={s}
                    onClick={() => { setFilter(s); setPage(0); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
                    style={filter === s
                      ? { background: ACCENT, color: "#fff", borderColor: ACCENT }
                      : { background: "#F8FAFC", color: "#64748B", borderColor: "#E2E8F0" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid gap-3 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100"
             style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 0.8fr", background: "#F8FAFC" }}>
          <div>Visitor</div>
          <div className="hidden sm:block">Contact</div>
          <div className="hidden sm:block">Unit</div>
          <div className="hidden md:block">Purpose</div>
          <div className="hidden md:block">Time</div>
          <div className="text-center">Status / Action</div>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="p-16 text-center">
            <RefreshCw size={24} className="text-slate-300 animate-spin mx-auto mb-4" />
            <p className="text-slate-400 text-sm">Loading visitors…</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="p-16 text-center">
            <Users size={36} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-sm font-medium">No visitors found for the selected filters.</p>
          </div>
        ) : (
          paginated.map((v) => {
            const sc   = statusConfig[v.status] || statusConfig.Pending;
            const unit = v.visitingResident
              ? `${v.visitingResident.wing}-${v.visitingResident.flatNumber}`
              : `${v.wing || "?"}-${v.flatNumber || "?"}`;

            return (
              <div key={v._id}
                   onClick={() => navigate(`/guard/visitor/${v._id}`)}
                   className="grid gap-3 px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group items-center"
                   style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 0.8fr" }}>
                {/* Visitor */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm"
                       style={{ background: ACCENT }}>
                    {v.visitorName?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{v.visitorName}</p>
                  </div>
                </div>
                {/* Contact */}
                <div className="hidden sm:block text-xs text-slate-500 font-medium">
                  {v.mobileNumber || "—"}
                </div>
                {/* Unit */}
                <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-indigo-600">
                  <MapPin size={11} className="text-indigo-300" />
                  {unit}
                </div>
                {/* Purpose */}
                <div className="hidden md:block">
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase">
                    {v.purpose || "—"}
                  </span>
                </div>
                {/* Time */}
                <div className="hidden md:flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={12} />
                  {new Date(v.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </div>
                {/* Status + Action */}
                <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {isGuard && v.status === "Pending" ? (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => { setVerifyingId(v._id); setShowOtpModal(true); }}
                        title="Verify OTP"
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition"
                        style={{ background: "#E8F5E9", color: "#16A34A" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#C6F6D5"}
                        onMouseLeave={e => e.currentTarget.style.background = "#E8F5E9"}>
                        <ShieldCheck size={15} />
                      </button>
                      <button
                        onClick={() => dispatch(denyVisitor(v._id))}
                        title="Deny"
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition"
                        style={{ background: "#FEE2E2", color: "#DC2626" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#FECACA"}
                        onMouseLeave={e => e.currentTarget.style.background = "#FEE2E2"}>
                        <XCircle size={15} />
                      </button>
                    </div>
                  ) : (
                    <StatusBadge status={v.status} />
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Rows per page:</span>
              <select value={rowsPerPage}
                      onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
                      className="border border-slate-200 rounded-lg px-2 py-1 text-xs bg-white focus:outline-none">
                {ROWS_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <span className="ml-2">
                {page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, filtered.length)} of {filtered.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center disabled:opacity-40 hover:bg-slate-50 transition">
                <ChevronLeft size={15} className="text-slate-600" />
              </button>
              <span className="px-3 py-1 text-xs font-semibold text-slate-600">{page + 1} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center disabled:opacity-40 hover:bg-slate-50 transition">
                <ChevronRight size={15} className="text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
             style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)" }}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                 style={{ background: "#E8F5E9" }}>
              <Key size={28} style={{ color: "#16A34A" }} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Verify OTP</h2>
            <p className="text-sm text-slate-500 mb-6">Enter the 6-digit code from the resident.</p>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input
                required autoFocus
                type="text" maxLength="6" inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • • • •"
                className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 border-2 rounded-2xl focus:outline-none bg-slate-50 transition"
                style={{ borderColor: otp.length === 6 ? "#16A34A" : "#E2E8F0" }}
              />
              <div className="flex gap-3">
                <button type="button"
                        onClick={() => { setShowOtpModal(false); setOtp(""); setVerifyingId(null); }}
                        className="flex-1 py-3 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition">
                  Cancel
                </button>
                <button type="submit" disabled={otp.length !== 6}
                        className="flex-1 py-3 text-sm font-bold text-white rounded-xl shadow-lg transition disabled:opacity-50"
                        style={{ background: "#16A34A" }}>
                  Verify & Allow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorManagement;