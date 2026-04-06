import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TablePagination, IconButton, Tooltip, Chip, InputBase } from "@mui/material";
import {
  Bell,
  Search,
  Calendar,
  Plus,
  X,
  Eye,
  Trash2,
  AlertCircle,
  Info,
  Megaphone,
  DollarSign,
  Sparkles,
  ArrowRight,
  Filter,
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
  General: { bg: "#f1f5f9", color: "#64748b", glow: "rgba(100, 116, 139, 0.18)" },
  Maintenance: { bg: "#fff7ed", color: "#ea580c", glow: "rgba(234, 88, 12, 0.18)" },
  Event: { bg: "#eff6ff", color: "#2563eb", glow: "rgba(37, 99, 235, 0.18)" },
  Emergency: { bg: "#fef2f2", color: "#dc2626", glow: "rgba(220, 38, 38, 0.18)" },
  Finance: { bg: "#ecfdf5", color: "#059669", glow: "rgba(5, 150, 105, 0.18)" },
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  const categories = ["All", "General", "Maintenance", "Event", "Emergency", "Finance"];

  const filtered = useMemo(() => {
    return (notices || []).filter((n) => {
      const text = `${n.title || ""} ${n.description || ""} ${n.content || ""}`.toLowerCase();
      const matchSearch = text.includes(search.toLowerCase());
      const matchCat = filter === "All" || n.category === filter;
      return matchSearch && matchCat;
    });
  }, [notices, search, filter]);

  const paginatedNotices = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const latestNotice = filtered[0];
  const emergencyCount = notices.filter((n) => n.category === "Emergency").length;
  const eventCount = notices.filter((n) => n.category === "Event").length;
  const maintenanceCount = notices.filter((n) => n.category === "Maintenance").length;
  const hasActiveFilters = filter !== "All" || search.trim() !== "";

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const clearFilters = () => {
    setSearch("");
    setFilter("All");
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(244,63,94,0.14),rgba(59,130,246,0.08),rgba(255,255,255,0.02))] p-6 shadow-sm sm:p-8">
          <div className="absolute -right-16 -top-12 h-40 w-40 rounded-full bg-rose-400/10 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] backdrop-blur">
                <Sparkles size={13} className="text-rose-500" />
                Community updates
              </div>
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-2xl bg-rose-500 p-3 text-white shadow-lg shadow-rose-500/20">
                  <Bell size={24} />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl">Society Notice Board</h1>
              </div>
              <p className="max-w-xl text-sm font-medium leading-6 text-[var(--text-muted)] sm:text-base">
                Browse announcements, maintenance alerts, event reminders, and finance updates in a more visual, easier-to-scan board.
              </p>
              {latestNotice && (
                <button
                  type="button"
                  onClick={() => setSelected(latestNotice)}
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[var(--card)] px-4 py-3 text-sm font-black text-[var(--text)] shadow-sm ring-1 ring-[var(--border)] transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="text-[var(--accent)]">Latest:</span>
                  <span className="max-w-[220px] truncate">{latestNotice.title}</span>
                  <ArrowRight size={16} className="text-[var(--accent)]" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Visible", value: filtered.length, tone: "text-sky-600 bg-sky-50" },
                { label: "Emergency", value: emergencyCount, tone: "text-rose-600 bg-rose-50" },
                { label: "Events", value: eventCount, tone: "text-indigo-600 bg-indigo-50" },
                { label: "Maintenance", value: maintenanceCount, tone: "text-amber-600 bg-amber-50" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
                  <div className={`mb-3 inline-flex rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${item.tone}`}>
                    {item.label}
                  </div>
                  <div className="text-2xl font-black text-[var(--text)]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-4 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 shadow-sm">
              <Search size={18} className="text-[var(--text-muted)]" />
              <InputBase
                placeholder="Search title, message, or update type..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="w-full font-medium text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setFilter(c);
                    setPage(0);
                  }}
                  className={`rounded-2xl border px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition-all ${
                    filter === c
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-md"
                      : "border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)] hover:-translate-y-0.5 hover:bg-[var(--accent-soft)]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowForm(true)}
                className="user-btn-primary flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-bold shadow-lg active:scale-95"
              >
                <Plus size={18} /> New Notice
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
              <Filter size={14} />
              <span>{filtered.length} results</span>
              {hasActiveFilters && (
                <>
                  <span className="rounded-full bg-[var(--accent-bg)] px-3 py-1 text-[var(--accent)]">filtered</span>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-full border border-[var(--border)] px-3 py-1 transition-colors hover:bg-[var(--bg)]"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>

            {latestNotice && (
              <p className="text-sm font-semibold text-[var(--text-muted)]">
                Highlighted update:
                <button
                  type="button"
                  onClick={() => setSelected(latestNotice)}
                  className="ml-2 text-[var(--accent)] underline decoration-transparent underline-offset-4 transition hover:decoration-current"
                >
                  {latestNotice.title}
                </button>
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8">
              <PageLoaderInline message="Loading notices..." />
            </div>
          ) : filtered.length > 0 ? (
            <>
              <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-3">
                {paginatedNotices.map((n, index) => {
                  const tone = categoryColors[n.category] || categoryColors.General;
                  return (
                    <article
                      key={n._id}
                      onClick={() => setSelected(n)}
                      className="group relative cursor-pointer overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                      style={{
                        boxShadow: `0 12px 30px -24px ${tone.glow}`,
                        animationDelay: `${index * 80}ms`,
                      }}
                    >
                      <div
                        className="absolute inset-x-0 top-0 h-1.5"
                        style={{ background: `linear-gradient(90deg, ${tone.color}, transparent)` }}
                      />

                      <div className="mb-4 flex items-start justify-between gap-3">
                        <Chip
                          icon={categoryIcons[n.category] || <Info size={12} />}
                          label={n.category || "General"}
                          size="small"
                          sx={{
                            fontWeight: 900,
                            fontSize: "9px",
                            textTransform: "uppercase",
                            bgcolor: tone.bg,
                            color: tone.color,
                            borderRadius: "999px",
                            "& .MuiChip-icon": { color: "inherit" }
                          }}
                        />

                        <div className="flex gap-1">
                          <Tooltip title="View Details">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelected(n);
                              }}
                              size="small"
                              sx={{ color: tone.color, bgcolor: tone.bg, borderRadius: "12px", "&:hover": { opacity: 0.85, bgcolor: tone.bg } }}
                            >
                              <Eye size={16} />
                            </IconButton>
                          </Tooltip>
                          {isAdmin && (
                            <Tooltip title="Delete Notice">
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(n._id);
                                }}
                                size="small"
                                sx={{ color: "#ef4444", bgcolor: "#fef2f2", borderRadius: "12px", "&:hover": { bgcolor: "#fee2e2" } }}
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          <Sparkles size={12} style={{ color: tone.color }} />
                          Notice update
                        </div>
                        <h2 className="text-lg font-black leading-snug text-[var(--text)] line-clamp-2">{n.title}</h2>
                        <p className="min-h-[72px] text-sm leading-relaxed text-[var(--text-muted)] line-clamp-4">
                          {n.description || n.content}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--text-muted)]">
                          <Calendar size={13} className="opacity-50" />
                          {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.18em]" style={{ color: tone.color }}>
                          Open
                          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>

              <TablePagination
                rowsPerPageOptions={[6, 9, 12]}
                component="div"
                count={filtered.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: "1px solid #f1f5f9",
                  ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                    fontWeight: 800,
                    fontSize: "10px",
                    textTransform: "uppercase",
                    color: "#94a3b8"
                  }
                }}
              />
            </>
          ) : (
            <div className="px-6 py-20 text-center text-[var(--text-muted)]">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--accent-bg)]">
                <Bell size={32} className="opacity-60" />
              </div>
              <p className="text-sm font-black uppercase tracking-[0.24em]">No notices found</p>
              <p className="mt-2 text-sm">Try another keyword or clear the current filters.</p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition hover:bg-[var(--bg)]"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ background: "color-mix(in srgb, var(--text) 45%, transparent)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="space-y-3">
                <Chip
                  label={selected.category}
                  sx={{
                    fontWeight: 900,
                    fontSize: "10px",
                    borderRadius: "999px",
                    bgcolor: categoryColors[selected.category]?.bg,
                    color: categoryColors[selected.category]?.color
                  }}
                />
                <h2 className="text-3xl font-black tracking-tight text-[var(--text)]">{selected.title}</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-full p-2 transition-colors hover:bg-[var(--accent-soft)]"
              >
                <X size={20} className="text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="mb-6 rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg)] p-6">
              <p className="text-sm leading-7 text-[var(--text-muted)] whitespace-pre-wrap">
                {selected.description || selected.content}
              </p>
            </div>

            <div className="flex flex-col gap-4 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
                <Calendar size={14} /> Posted on {new Date(selected.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white shadow-md transition hover:opacity-90"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ background: "color-mix(in srgb, var(--text) 45%, transparent)" }}
        >
          <div className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tight text-[var(--text)]">Post New Notice</h2>
              <button onClick={() => setShowForm(false)} className="rounded-full p-2 transition-colors hover:bg-[var(--accent-soft)]">
                <X size={20} className="text-[var(--text-muted)]" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="ml-1 mb-1.5 block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Notice title..."
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm font-bold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
              <div>
                <label className="ml-1 mb-1.5 block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm font-bold text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  {categories.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="ml-1 mb-1.5 block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Type notice details here..."
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm font-medium text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-2xl border border-[var(--border)] bg-[var(--accent-bg)] py-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--text-muted)] transition-all hover:opacity-90"
                >
                  Cancel
                </button>
                <button type="submit" className="user-btn-primary flex-1 rounded-2xl py-3 text-xs shadow-lg">
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
