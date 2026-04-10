import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, Plus, Search, XCircle,
  Clock, MapPin, Key, ShieldCheck, RefreshCw, ChevronRight,
  ChevronLeft, Filter, Sparkles
} from "lucide-react";
import { fetchVisitors, fetchMyVisitors, denyVisitor, approveVisitor } from "../../store/slices/visitorSlice";
import { toast } from "react-toastify";
import { PageLoaderInline } from "../../components/PageLoader";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visitors = [], myVisitors = [], loading } = useSelector((s) => s.visitor || {});

  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const roleLower = user?.role?.toLowerCase();
  const isGuard = ["guard", "admin"].includes(roleLower);
  const isResident = roleLower === "resident";
  const listSource = isResident ? myVisitors : visitors;

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingId, setVerifyingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (isResident) dispatch(fetchMyVisitors());
    else dispatch(fetchVisitors());
  }, [dispatch, isResident]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }
    const res = await dispatch(approveVisitor({ id: verifyingId, otp }));
    if (res.meta.requestStatus === "fulfilled") {
      setShowOtpModal(false);
      setOtp("");
      setVerifyingId(null);
    }
  };

  const filtered = useMemo(
    () =>
      (listSource || []).filter((v) => {
        const matchStatus = filter === "All" || v.status === filter;
        const q = search.toLowerCase();
        const matchSearch =
          v.visitorName?.toLowerCase().includes(q) ||
          v.mobileNumber?.includes(search) ||
          v.wing?.toLowerCase().includes(q) ||
          v.flatNumber?.toLowerCase().includes(q);
        return matchStatus && matchSearch;
      }),
    [listSource, filter, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const pendingCount = listSource.filter((v) => v.status === "Pending").length;
  const approvedCount = listSource.filter((v) => v.status === "Approved" || v.status === "Inside").length;
  const deniedCount = listSource.filter((v) => v.status === "Denied").length;
  const insideCount = listSource.filter((v) => ["Inside", "Approved"].includes(v.status)).length;

  const StatusBadge = ({ status }) => {
    const sc = statusConfig[status] || statusConfig.Pending;
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: sc.bg, color: sc.color }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: sc.dot }} />
        {status}
      </span>
    );
  };

  return (
    <div className="mt-15 min-h-full space-y-5 bg-[linear-gradient(180deg,#f4f6fb_0%,#eef1f8_100%)] p-4 sm:p-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              <Sparkles size={13} className="text-indigo-500" />
              Secure entry flow
            </div>
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-2xl p-3 text-white shadow-lg" style={{ background: ACCENT }}>
                <Users size={22} />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Visitor Management</h1>
            </div>
            <p className="max-w-xl text-sm font-medium leading-6 text-slate-500">
              {isResident
                ? "Track visitor requests, check who is currently approved, and open full guest details from a friendlier resident dashboard."
                : "Review visitor requests, track entries, and manage OTP-based approvals with a clearer, more interactive dashboard."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Records", value: listSource.length, tone: "bg-slate-100 text-slate-600" },
              { label: "Pending", value: pendingCount, tone: "bg-amber-50 text-amber-600" },
              { label: isResident ? "Inside" : "Approved", value: isResident ? insideCount : approvedCount, tone: "bg-emerald-50 text-emerald-600" },
              { label: "Denied", value: deniedCount, tone: "bg-rose-50 text-rose-600" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 shadow-sm">
                <div className={`mb-3 inline-flex rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${item.tone}`}>{item.label}</div>
                <div className="text-2xl font-black text-slate-900">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""} available in this view
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isResident && (
            <button
              type="button"
              onClick={() => navigate("/gate-logs")}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              View Gate Logs
            </button>
          )}
          <button
            type="button"
            onClick={() => dispatch(isResident ? fetchMyVisitors() : fetchVisitors())}
            className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition hover:bg-slate-50"
            title="Refresh"
          >
            <RefreshCw size={15} className={`text-slate-500 ${loading ? "animate-spin" : ""}`} />
          </button>
          {isGuard && (
            <button
              type="button"
              onClick={() => navigate("/guard/visitor/add")}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black text-white shadow-md transition hover:opacity-90"
              style={{ background: ACCENT }}
            >
              <Plus size={15} /> New entry
            </button>
          )}
        </div>
      </motion.div>

      <div className="flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search visitor, flat, wing, mobile..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": `${ACCENT}40` }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Filter size={14} className="text-slate-400" />
          {["All", "Pending", "Approved", "Inside", "Exited", "Denied"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setFilter(s);
                setPage(0);
              }}
              className="rounded-xl border px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] transition-all"
              style={
                filter === s
                  ? { background: ACCENT, color: "#fff", borderColor: ACCENT }
                  : { background: "#F8FAFC", color: "#64748B", borderColor: "#E2E8F0" }
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isResident ? (
        <div className="grid gap-4 md:grid-cols-2">
          {loading ? (
            <div className="md:col-span-2">
              <PageLoaderInline message="Loading visitors..." className="rounded-[1.75rem] border border-slate-100 bg-white p-12 shadow-md" />
            </div>
          ) : paginated.length === 0 ? (
            <div className="md:col-span-2 rounded-[1.75rem] border border-slate-100 bg-white p-16 text-center shadow-md">
              <Users size={36} className="mx-auto mb-4 text-slate-200" />
              <p className="text-sm font-medium text-slate-400">No visitors found for the selected filters.</p>
            </div>
          ) : (
            paginated.map((v) => {
              let unit = "?-?";
              if (v.visitingResident) {
                const w = v.visitingResident.wing;
                const f = v.visitingResident.flatNumber;
                unit = w && f && String(f).startsWith(w) ? f : `${w || "?"}-${f || "?"}`;
              } else {
                const w = v.wing;
                const f = v.flatNumber;
                unit = w && f && String(f).startsWith(w) ? f : `${w || "?"}-${f || "?"}`;
              }

              return (
                <motion.div
                  key={v._id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate(`/visitors/visitor/${v._id}`)}
                  className="cursor-pointer overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#f8fafc_0%,#ffffff_60%,#eef2ff_100%)] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-base font-black text-white shadow-sm" style={{ background: ACCENT }}>
                          {v.visitorName?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-base font-black text-slate-900">{v.visitorName}</p>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{v.purpose || "Visitor"}</p>
                        </div>
                      </div>
                      <StatusBadge status={v.status} />
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Contact</p>
                        <p className="mt-2 text-sm font-bold text-slate-700">{v.mobileNumber || "-"}</p>
                      </div>
                      <div className="rounded-2xl bg-indigo-50 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-400">Unit</p>
                        <p className="mt-2 text-sm font-bold text-indigo-700">{unit}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-semibold">
                        <Clock size={12} />
                        {new Date(v.createdAt).toLocaleDateString("en-IN")}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-semibold">
                        <MapPin size={12} />
                        {unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-400">Tap to open full visitor details</p>
                      <span className="inline-flex items-center gap-1 text-sm font-black text-indigo-600">
                        Details
                        <ChevronRight size={16} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}

          {!loading && filtered.length > 0 && (
            <div className="md:col-span-2 flex items-center justify-between rounded-[1.5rem] border border-slate-100 bg-white px-5 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Rows per page:</span>
                <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none">
                  {ROWS_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <span className="ml-2">{page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filtered.length)} of {filtered.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white transition hover:bg-slate-50 disabled:opacity-40">
                  <ChevronLeft size={15} className="text-slate-600" />
                </button>
                <span className="px-3 py-1 text-xs font-semibold text-slate-600">{page + 1} / {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white transition hover:bg-slate-50 disabled:opacity-40">
                  <ChevronRight size={15} className="text-slate-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-md">
          <div className="grid gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500 sm:px-5" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 0.8fr" }}>
            <div>Visitor</div>
            <div className="hidden sm:block">Contact</div>
            <div className="hidden sm:block">Unit</div>
            <div className="hidden md:block">Purpose</div>
            <div className="hidden md:block">Time</div>
            <div className="text-center">Status / Action</div>
          </div>

          {loading ? (
            <PageLoaderInline message="Loading visitors..." className="p-12" />
          ) : paginated.length === 0 ? (
            <div className="p-16 text-center">
              <Users size={36} className="mx-auto mb-4 text-slate-200" />
              <p className="text-sm font-medium text-slate-400">No visitors found for the selected filters.</p>
            </div>
          ) : (
            paginated.map((v) => {
              let unit = "?-?";
              if (v.visitingResident) {
                const w = v.visitingResident.wing;
                const f = v.visitingResident.flatNumber;
                unit = w && f && String(f).startsWith(w) ? f : `${w || "?"}-${f || "?"}`;
              } else {
                const w = v.wing;
                const f = v.flatNumber;
                unit = w && f && String(f).startsWith(w) ? f : `${w || "?"}-${f || "?"}`;
              }

              return (
                <motion.div
                  key={v._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => navigate(isResident ? `/visitors/visitor/${v._id}` : `/guard/visitor/${v._id}`)}
                  className="group grid cursor-pointer items-center gap-3 border-b border-slate-100 px-4 py-4 transition-colors last:border-0 hover:bg-slate-50/90 sm:px-5"
                  style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 0.8fr" }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-black text-white shadow-sm" style={{ background: ACCENT }}>
                      {v.visitorName?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800">{v.visitorName}</p>
                    </div>
                  </div>
                  <div className="hidden text-xs font-medium text-slate-500 sm:block">{v.mobileNumber || "-"}</div>
                  <div className="hidden items-center gap-1 text-xs font-semibold text-indigo-600 sm:flex">
                    <MapPin size={11} className="text-indigo-300" />
                    {unit}
                  </div>
                  <div className="hidden md:block">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-slate-500">{v.purpose || "-"}</span>
                  </div>
                  <div className="hidden items-center gap-1 text-xs text-slate-400 md:flex">
                    <Clock size={12} />
                    {new Date(v.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {isGuard && v.status === "Pending" ? (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setVerifyingId(v._id);
                            setShowOtpModal(true);
                          }}
                          title="Verify OTP"
                          className="flex h-8 w-8 items-center justify-center rounded-xl transition"
                          style={{ background: "#E8F5E9", color: "#16A34A" }}
                        >
                          <ShieldCheck size={15} />
                        </button>
                        <button
                          onClick={() => dispatch(denyVisitor(v._id))}
                          title="Deny"
                          className="flex h-8 w-8 items-center justify-center rounded-xl transition"
                          style={{ background: "#FEE2E2", color: "#DC2626" }}
                        >
                          <XCircle size={15} />
                        </button>
                      </div>
                    ) : (
                      <StatusBadge status={v.status} />
                    )}
                  </div>
                </motion.div>
              );
            })
          )}

          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Rows per page:</span>
                <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none">
                  {ROWS_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <span className="ml-2">{page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filtered.length)} of {filtered.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white transition hover:bg-slate-50 disabled:opacity-40">
                  <ChevronLeft size={15} className="text-slate-600" />
                </button>
                <span className="px-3 py-1 text-xs font-semibold text-slate-600">{page + 1} / {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white transition hover:bg-slate-50 disabled:opacity-40">
                  <ChevronRight size={15} className="text-slate-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showOtpModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(8px)" }}>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm rounded-[2rem] bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
              <Key size={26} className="text-emerald-600" />
            </div>
            <h2 className="mb-1 text-xl font-black text-slate-900">Verify OTP</h2>
            <p className="mb-6 text-sm text-slate-500">Enter the 6-digit code from the resident.</p>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input
                required
                autoFocus
                type="text"
                maxLength="6"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="� � � � � �"
                className="w-full rounded-2xl border-2 bg-slate-50 py-4 text-center text-3xl font-black tracking-[0.4em] transition focus:outline-none"
                style={{ borderColor: otp.length === 6 ? "#16A34A" : "#E2E8F0" }}
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowOtpModal(false); setOtp(""); setVerifyingId(null); }} className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200">
                  Cancel
                </button>
                <button type="submit" disabled={otp.length !== 6} className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-black text-white shadow-lg transition disabled:opacity-50">
                  Verify
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VisitorManagement;
