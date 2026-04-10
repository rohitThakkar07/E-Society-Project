import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Chip, InputBase } from "@mui/material";
import {
  Bell,
  Search,
  Calendar,
  Plus,
  X,
  AlertCircle,
  Info,
  Megaphone,
  DollarSign,
  Sparkles,
  ArrowRight,
  Filter,
  Trash2,
} from "lucide-react";
import { fetchNotices, createNotice, deleteNotice } from "../../store/slices/noticeSlice";
import { PageLoaderInline } from "../../components/PageLoader";

const categoryIcons = {
  General: <Info size={14} />,
  Maintenance: <Plus size={14} />,
  Event: <Megaphone size={14} />,
  Emergency: <AlertCircle size={14} />,
  Finance: <DollarSign size={14} />,
};

const categoryColors = {
  General:     { bg: "rgba(148,163,184,0.1)", color: "#94a3b8", glow: "rgba(148,163,184,0.3)" },
  Maintenance: { bg: "rgba(245,158,11,0.1)",  color: "#f59e0b", glow: "rgba(245,158,11,0.3)" },
  Event:       { bg: "rgba(99,102,241,0.1)",   color: "#6366f1", glow: "rgba(99,102,241,0.3)" },
  Emergency:   { bg: "rgba(239,68,68,0.1)",    color: "#ef4444", glow: "rgba(239,68,68,0.4)" },
  Finance:     { bg: "rgba(16,185,129,0.1)",   color: "#10b981", glow: "rgba(16,185,129,0.3)" },
};

const NoticeBoard = () => {
  const dispatch = useDispatch();
  const { list: notices = [], loading } = useSelector((s) => s.notice ?? {});
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "General" });

  useEffect(() => { dispatch(fetchNotices()); }, [dispatch]);

  const categories = ["All", "General", "Maintenance", "Event", "Emergency", "Finance"];

  const filtered = useMemo(() => {
    return (notices || []).filter((n) => {
      const text = `${n.title || ""} ${n.description || ""} ${n.content || ""}`.toLowerCase();
      const matchSearch = text.includes(search.toLowerCase());
      const matchCat = filter === "All" || n.category === filter;
      return matchSearch && matchCat;
    });
  }, [notices, search, filter]);

  const latestNotice = filtered[0];
  const emergencyCount = notices.filter((n) => n.category === "Emergency").length;
  const eventCount = notices.filter((n) => n.category === "Event").length;
  const maintenanceCount = notices.filter((n) => n.category === "Maintenance").length;
  const hasActiveFilters = filter !== "All" || search.trim() !== "";

  const handleCreate = async (e) => {
    e.preventDefault();
    await dispatch(createNotice(form));
    setShowForm(false);
    setForm({ title: "", description: "", category: "General" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this notice?")) {
      await dispatch(deleteNotice(id));
      setSelected(null);
    }
  };

  const clearFilters = () => { setSearch(""); setFilter("All"); };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-all duration-300 sm:p-4 md:p-8">
      <div className="mx-auto max-w-7xl m-12">

        {/* Header Hero */}
        <section className="group relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm transition-all duration-500 hover:shadow-[0_20px_50px_rgba(244,63,94,0.1)]">
          <div className="absolute -right-16 -top-12 h-64 w-64 rounded-full bg-rose-400/10 blur-[100px] transition-all group-hover:bg-rose-400/20" />
          <div className="absolute left-1/4 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-sky-400/5 blur-[80px]" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-[var(--text-muted)] backdrop-blur">
                <Sparkles size={14} className="text-rose-500 animate-pulse" />
                Live Notice Board
              </div>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-xl shadow-rose-500/30 group-hover:scale-110 transition-transform duration-500">
                  <Bell size={30} className="group-hover:animate-ring" />
                </div>
                <h1 className="text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">Notice Board</h1>
              </div>
              <p className="max-w-xl text-sm font-medium leading-relaxed text-[var(--text-muted)] opacity-80">
                Stay updated with the latest community announcements, emergency alerts, and upcoming events.
              </p>

              {latestNotice && (
                <button
                  type="button"
                  onClick={() => setSelected(latestNotice)}
                  className="group/latest mt-6 inline-flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-5 py-3.5 text-sm font-black text-[var(--text)] shadow-sm transition-all hover:-translate-y-1 active:scale-95"
                >
                  <span className="text-rose-500">LATEST:</span>
                  <span className="max-w-[200px] truncate">{latestNotice.title}</span>
                  <ArrowRight size={16} className="text-rose-500 group-hover/latest:translate-x-1 transition-transform" />
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Visible",    value: filtered.length,  tone: "text-sky-500" },
                { label: "Emergency",  value: emergencyCount,   tone: "text-rose-500" },
                { label: "Events",     value: eventCount,       tone: "text-indigo-500" },
                { label: "Alerts",     value: maintenanceCount, tone: "text-amber-500" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-5 transition-all hover:-translate-y-1.5 hover:shadow-lg">
                  <div className={`mb-2 text-[9px] font-black uppercase tracking-widest ${item.tone}`}>{item.label}</div>
                  <div className="text-2xl font-black text-[var(--text)]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <div className="mt-8 flex flex-col gap-6 rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6 transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-5 py-4 shadow-sm transition-all focus-within:ring-2 focus-within:ring-rose-500/50">
              <Search size={20} className="text-[var(--text-muted)]" />
              <InputBase
                placeholder="Search notices, updates or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full font-bold text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2.5">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-90 ${
                    filter === c
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                      : "bg-[var(--bg)] text-[var(--text-muted)] border border-[var(--border)] hover:border-rose-500/50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-rose-600 hover:-translate-y-0.5 active:scale-95"
              >
                <Plus size={18} /> New Notice
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
              <Filter size={16} />
              <span>{filtered.length} Announcements</span>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="rounded-full bg-rose-500/10 px-4 py-1.5 text-rose-500 transition hover:bg-rose-500/20">
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notice Grid — all filtered results, no pagination */}
        <div className="mt-8">
          {loading ? (
            <div className="rounded-[2.5rem] bg-[var(--card)] p-20">
              <PageLoaderInline message="Syncing with society board..." />
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((n, index) => {
                const tone = categoryColors[n.category] || categoryColors.General;
                return (
                  <article
                    key={n._id}
                    onClick={() => setSelected(n)}
                    className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-7 transition-all duration-500 hover:-translate-y-2"
                    style={{
                      boxShadow: `0 20px 40px -15px ${tone.glow}`,
                      animation: `fadeUp 0.5s ease forwards ${index * 0.08}s`,
                      opacity: 0,
                    }}
                  >
                    {/* Category accent line */}
                    <div
                      className="absolute inset-x-0 top-0 h-1.5 opacity-60 transition-opacity group-hover:opacity-100"
                      style={{ background: `linear-gradient(90deg, ${tone.color}, transparent)` }}
                    />

                    <div className="mb-6 flex items-start justify-between">
                      <Chip
                        icon={categoryIcons[n.category] || <Info size={12} />}
                        label={n.category}
                        sx={{
                          fontWeight: 900,
                          fontSize: "9px",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          bgcolor: tone.bg,
                          color: tone.color,
                          borderRadius: "14px",
                          "& .MuiChip-icon": { color: "inherit" },
                        }}
                      />
                      {isAdmin && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(n._id); }}
                          className="rounded-xl bg-rose-500/10 p-2.5 text-rose-500 transition-all hover:bg-rose-500 hover:text-white"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-60">
                        <Sparkles size={12} style={{ color: tone.color }} />
                        Posted on Board
                      </div>
                      <h2 className="text-xl font-black leading-tight text-[var(--text)] group-hover:text-rose-500 transition-colors line-clamp-2">
                        {n.title}
                      </h2>
                      <p className="text-sm leading-relaxed text-[var(--text-muted)] opacity-80 line-clamp-3">
                        {n.description || n.content}
                      </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-5">
                      <div className="flex items-center gap-2 text-[11px] font-black text-[var(--text-muted)]">
                        <Calendar size={14} className="opacity-50" />
                        {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                      </div>
                      <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest" style={{ color: tone.color }}>
                        Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[3rem] border-2 border-dashed border-[var(--border)] bg-[var(--card)] py-28 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[var(--bg)] text-[var(--text-muted)] opacity-30">
                <Bell size={48} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-widest text-[var(--text)]">Silence in the Hall</h3>
              <p className="mt-2 text-[var(--text-muted)]">No notices match your current search or filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-md"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-[3rem] border border-[var(--border)] bg-[var(--card)] shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="mb-6 flex items-start justify-between">
                <div className="space-y-3">
                  <Chip
                    label={selected.category}
                    sx={{
                      fontWeight: 900,
                      fontSize: "10px",
                      bgcolor: categoryColors[selected.category]?.bg,
                      color: categoryColors[selected.category]?.color,
                      borderRadius: "12px",
                    }}
                  />
                  <h2 className="text-3xl font-black text-[var(--text)]">{selected.title}</h2>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-2xl bg-[var(--bg)] p-3 text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-8 min-h-[200px] rounded-[2rem] border border-[var(--border)] bg-[var(--bg)] p-8 leading-relaxed text-[var(--text-muted)]">
                {selected.description || selected.content}
              </div>

              <div className="flex items-center justify-between border-t border-[var(--border)] pt-6">
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
                  <Calendar size={16} />
                  {new Date(selected.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                </p>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-2xl bg-rose-500 px-8 py-3 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 backdrop-blur-md"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="w-full max-w-md rounded-[3rem] border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden animate-scaleUp">
            <div className="p-8">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-black text-[var(--text)] uppercase tracking-tight">Post Update</h2>
                <button onClick={() => setShowForm(false)} className="rounded-2xl bg-[var(--bg)] p-2 text-[var(--text-muted)] hover:text-rose-500">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-2">Subject</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-5 py-4 text-sm font-bold text-[var(--text)] focus:ring-2 focus:ring-rose-500 outline-none transition-all"
                    placeholder="Enter notice title..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-2">Tag Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-5 py-4 text-sm font-bold text-[var(--text)] focus:ring-2 focus:ring-rose-500 outline-none appearance-none"
                  >
                    {categories.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-2">Full Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-5 py-4 text-sm font-medium text-[var(--text)] focus:ring-2 focus:ring-rose-500 outline-none resize-none transition-all"
                    placeholder="Type announcement details..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 rounded-2xl border border-[var(--border)] py-4 text-[11px] font-black uppercase tracking-widest text-[var(--text-muted)] transition hover:bg-[var(--bg)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-rose-500 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all"
                  >
                    Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-scaleUp { animation: scaleUp 0.3s cubic-bezier(0.22,1,0.36,1) forwards; }
        @keyframes ring {
          0%,50%,100% { transform: rotate(0); }
          10%  { transform: rotate(15deg); }
          20%  { transform: rotate(-15deg); }
          30%  { transform: rotate(10deg); }
          40%  { transform: rotate(-10deg); }
        }
        .group:hover .group-hover\\:animate-ring { animation: ring 1s ease-in-out; }
      `}</style>
    </div>
  );
};

export default NoticeBoard;