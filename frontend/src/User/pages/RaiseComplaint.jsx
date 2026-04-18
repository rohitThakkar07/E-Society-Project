import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import {
  Wrench,
  Plus,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  ChevronRight,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  Filter,
  Image as ImageIcon,
  Activity,
} from "lucide-react";
import { fetchComplaints } from "../../store/slices/complaintSlice";
import { ListSkeleton } from "../../components/PageLoader";

const filePublicOrigin = () => {
  const u = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return u.replace(/\/api\/?$/, "");
};

const statusConfig = {
  Pending: { color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: <Clock size={14} />, label: "Pending" },
  "In Progress": { color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: <AlertCircle size={14} />, label: "In Progress" },
  Resolved: { color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: <CheckCircle size={14} />, label: "Resolved" },
  Rejected: { color: "bg-rose-500/10 text-rose-500 border-rose-500/20", icon: <X size={14} />, label: "Rejected" },
};

const categoryColors = {
  Water: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Electricity: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Security: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  Maintenance: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  Other: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

const RaiseComplaint = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { complaints, loading: complaintLoading } = useSelector((s) => s.complaint || {});

  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const residentId = user?.profileId || user?.resident?._id || user?.residentId || user?._id || user?.id || "";

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  // Original Logic for ID detection
  const userComplaints = useMemo(() => {
    return (complaints || []).filter((c) => {
      const complaintResidentId =
        c.resident?._id ||
        c.resident?.profileId ||
        c.resident?.id ||
        c.residentId ||
        c.resident;

      return String(complaintResidentId || "") === String(residentId || "");
    });
  }, [complaints, residentId]);

  const filtered = useMemo(() => {
    return userComplaints.filter((c) => {
      const matchStatus = filter === "All" || c.status === filter;
      const query = search.toLowerCase();
      const matchSearch =
        c.title?.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query) ||
        c.category?.toLowerCase().includes(query);
      return matchStatus && matchSearch;
    });
  }, [userComplaints, filter, search]);

  const stats = useMemo(() => [
    { label: "Total", value: userComplaints?.length || 0, color: "text-indigo-500", bg: "bg-indigo-500/5", glow: "rgba(99,102,241,0.2)" },
    { label: "Pending", value: userComplaints?.filter((c) => c.status === "Pending").length || 0, color: "text-amber-500", bg: "bg-amber-500/5", glow: "rgba(245,158,11,0.2)" },
    { label: "In Progress", value: userComplaints?.filter((c) => c.status === "In Progress").length || 0, color: "text-blue-500", bg: "bg-blue-500/5", glow: "rgba(59,130,246,0.2)" },
    { label: "Resolved", value: userComplaints?.filter((c) => c.status === "Resolved").length || 0, color: "text-emerald-500", bg: "bg-emerald-500/5", glow: "rgba(16,185,129,0.2)" },
  ], [userComplaints]);

  const listAnim = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemAnim = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  const activeStatus = statusConfig[selectedComplaint?.status];

  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="user-page-mesh min-h-screen bg-[var(--bg)] p-4 text-[var(--text)] transition-all duration-500 sm:p-8"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .stats-glow { transition: all 0.4s ease; }
        .stats-glow:hover { transform: translateY(-5px); }
      `}</style>

      <div className="relative z-[1] mx-auto max-w-6xl mt-4">

        {/* --- MAIN HERO HEADER --- */}
        <div className="mb-4">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--card)] p-1 shadow-md">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-[60px]" />

            <div className="grid gap-3 p-4 lg:p-5 lg:grid-cols-[1fr_auto]">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-0.5 text-[8px] font-black uppercase tracking-widest text-indigo-500">
                  <Sparkles size={10} className="animate-pulse" />
                  Resident Support Desk
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 shrink-0">
                    <Wrench size={24} />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-[var(--text)] leading-none">Help Desk</h1>
                    <p className="mt-1.5 text-[11px] lg:text-xs font-medium text-[var(--text-muted)] opacity-75 max-w-md">Report and track society issues in real-time.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => navigate("/raise-complaint/new")}
                  className="group flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-700 hover:-translate-y-0.5 shadow-md shadow-indigo-600/20 active:scale-95 w-full lg:w-auto justify-center"
                >
                  <Plus size={14} /> Create Ticket
                  <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div
         
          className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((s) => (
            <button
              key={s.label}
             
             
              onClick={() => setFilter(s.label === "Total" ? "All" : s.label)}
              className={`${s.bg} group relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] p-5 text-left transition-all hover:border-indigo-500/20 shadow-sm`}
            >
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)] opacity-60">{s.label}</p>
              <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <ChevronRight size={16} className={s.color} />
              </div>
            </button>
          ))}
        </div>

        {/* --- FILTER & SEARCH BAR --- */}
        <div className="mb-6 rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-indigo-600 transition-colors" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] py-3 pl-11 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-600/30 transition-all"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {["All", "Pending", "In Progress", "Resolved"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`rounded-xl px-4 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95 ${filter === s
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "bg-[var(--bg)] text-[var(--text-muted)] border border-[var(--border)] hover:border-indigo-600/30"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-5">
            <div className="flex items-center gap-2 rounded-full bg-[var(--bg)] px-4 py-1.5 border border-[var(--border)] text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
              <Filter size={12} /> Results: {filtered.length}
            </div>
            {filter !== "All" && (
              <span className="rounded-full bg-orange-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-orange-500 border border-orange-500/20">
                Filter: {filter}
              </span>
            )}
          </div>
        </div>

        {/* --- COMPLAINTS LIST --- */}
        {complaintLoading ? (
          <ListSkeleton rows={4} rowClassName="h-40 rounded-[2.5rem]" />
        ) : filtered.length === 0 ? (
          <div className="rounded-[3rem] border-2 border-dashed border-[var(--border)] bg-[var(--card)] py-28 text-center transition-all">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[var(--bg)]">
              <Wrench size={48} className="text-[var(--text-muted)] opacity-20" />
            </div>
            <p className="text-xl font-black uppercase tracking-widest text-[var(--text-muted)] opacity-50">No tickets found</p>
            <button onClick={() => { setFilter("All"); setSearch(""); }} className="mt-4 text-xs font-bold text-orange-500 underline underline-offset-4">Reset all filters</button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filtered.map((c, idx) => (
              <div
                key={c._id}
               
                onClick={() => setSelectedComplaint(c)}
                className="group cursor-pointer relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:border-indigo-500/30"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <h3 className="text-xl font-black text-[var(--text)] group-hover:text-orange-500 transition-colors">{c.title}</h3>
                      <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border ${statusConfig[c.status]?.color}`}>
                        {c.status === "Pending" && <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />}
                        {statusConfig[c.status]?.label}
                      </div>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-[var(--text-muted)] opacity-80 line-clamp-2">
                      {c.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <span className={`rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border ${categoryColors[c.category] || "border-[var(--border)]"}`}>
                        {c.category}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        <Clock size={14} className="text-orange-500" /> {new Date(c.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      {c.attachment && (
                        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/20">
                          <ImageIcon size={12} /> Attached
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end md:border-l border-[var(--border)] md:pl-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-[var(--bg)] border border-[var(--border)] group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all duration-300">
                      <ChevronRight size={28} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- COMPLAINT DETAIL MODAL --- */}
        
          {selectedComplaint && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
              <div
               
               
               
                className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[3rem] border border-[var(--border)] bg-[var(--card)] shadow-2xl"
              >
                <div className="flex h-full flex-col">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-[var(--border)] bg-gradient-to-r from-[var(--bg)] to-[var(--card)] px-8 py-6">
                    <div className="space-y-1">
                      <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500">
                        <MessageSquare size={14} /> Ticket ID: #{selectedComplaint._id.slice(-6)}
                      </p>
                      <h2 className="text-3xl font-black tracking-tight text-[var(--text)]">{selectedComplaint.title}</h2>
                    </div>
                    <button
                      onClick={() => setSelectedComplaint(null)}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-3 text-[var(--text-muted)] transition-all hover:bg-rose-500 hover:text-white"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="overflow-y-auto p-8 scrollbar-hide">
                    <div className="grid gap-6 md:grid-cols-3 mb-8">
                      <div className={`rounded-3xl border p-5 ${activeStatus?.color}`}>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
                        <div className="mt-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
                          {activeStatus?.icon} {selectedComplaint.status}
                        </div>
                      </div>
                      <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Category</p>
                        <p className="mt-3 text-sm font-black uppercase tracking-widest">{selectedComplaint.category}</p>
                      </div>
                      <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Last Updated</p>
                        <p className="mt-3 text-sm font-black uppercase tracking-widest">
                          {new Date(selectedComplaint.updatedAt || selectedComplaint.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg)] p-8">
                        <h4 className="mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-orange-500">Subject Description</h4>
                        <p className="text-base font-medium leading-8 text-[var(--text-muted)] whitespace-pre-wrap">{selectedComplaint.description}</p>
                      </div>

                      {selectedComplaint.attachment && (
                        <div className="space-y-4">
                          <h4 className="ml-4 text-[10px] font-black uppercase tracking-[0.25em] text-orange-500">Attachment Proof</h4>
                          <div className="overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-black/10">
                            <img
                              src={selectedComplaint.attachment?.startsWith("http") ? selectedComplaint.attachment : `${filePublicOrigin()}${selectedComplaint.attachment}`}
                              alt="Complaint proof"
                              className="max-h-[500px] w-full object-contain"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg)] p-6">
                        <div className="flex flex-col gap-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest sm:flex-row sm:items-center sm:justify-between">
                          <p>Ticket Opened: {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                          {selectedComplaint.status === "Resolved" && (
                            <p className="text-emerald-500">Resolution Date: {new Date(selectedComplaint.resolvedAt).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="border-t border-[var(--border)] bg-[var(--bg)] px-8 py-6 flex justify-end">
                    <button
                      onClick={() => setSelectedComplaint(null)}
                      className="rounded-2xl bg-indigo-600 px-10 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                      Close Overview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        
      </div>
    </div>
  );
};

export default RaiseComplaint;