import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, TablePagination,
  IconButton, Tooltip, Chip, InputBase, Avatar 
} from "@mui/material";
import { 
  Bell, Search, Calendar, Tag, Plus, X, 
  Eye, Trash2, AlertCircle, Info, Megaphone, DollarSign 
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
  General: { bg: "#f1f5f9", color: "#64748b" },
  Maintenance: { bg: "#fff7ed", color: "#ea580c" },
  Event: { bg: "#eff6ff", color: "#2563eb" },
  Emergency: { bg: "#fef2f2", color: "#dc2626" },
  Finance: { bg: "#ecfdf5", color: "#059669" },
};

const NoticeBoard = () => {
  const dispatch = useDispatch();
  const { list: notices = [], loading } = useSelector((s) => s.notice ?? {});
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const isAdmin = user?.role?.toLowerCase() === "admin";

  // UI State
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "General" });

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => { dispatch(fetchNotices()); }, [dispatch]);

  const categories = ["All", "General", "Maintenance", "Event", "Emergency", "Finance"];

  // Logic: Filtering (Unchanged)
  const filtered = useMemo(() => {
    return (notices || []).filter((n) => {
      const matchSearch = n.title?.toLowerCase().includes(search.toLowerCase());
      const matchCat = filter === "All" || n.category === filter;
      return matchSearch && matchCat;
    });
  }, [notices, search, filter]);

  // Pagination Handlers
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

  return (
    <div className="p-4 sm:p-6 min-h-screen font-sans bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell size={24} className="text-rose-500" />
            <h1 className="text-2xl font-black text-[var(--text)] tracking-tight">Society Notice Board</h1>
          </div>
          <p className="text-sm text-[var(--text-muted)] font-medium">{filtered.length} active announcements</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowForm(true)} 
            className="user-btn-primary px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg active:scale-95"
          >
            <Plus size={18} /> New Notice
          </button>
        )}
      </div>

      {/* SEARCH + FILTER BAR */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-wrap items-center gap-4">
        <div className="p-2 rounded-2xl border shadow-sm flex items-center gap-3 px-4 flex-1 min-w-[min(100%,300px)] bg-[var(--card)] border-[var(--border)]">
          <Search size={18} className="text-[var(--text-muted)]" />
          <InputBase
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full font-medium text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button 
              key={c} 
              onClick={() => { setFilter(c); setPage(0); }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                filter === c 
                ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-md" 
                : "bg-[var(--card)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--accent-soft)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* MUI TABLE CONTAINER */}
      <div className="max-w-6xl mx-auto">
        <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'var(--card)', border: '1px solid', borderColor: 'var(--border)' }} className="rounded-2xl overflow-hidden shadow-sm">
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: 'color-mix(in srgb, var(--accent-bg) 40%, var(--card))' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Notice Details</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Posted On</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800, fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {!loading ? filtered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n) => (
                <TableRow key={n._id} hover>
                  <TableCell>
                    <div className="flex flex-col max-w-md">
                      <span className="font-bold text-[var(--text)] text-sm line-clamp-1">{n.title}</span>
                      <span className="text-xs text-[var(--text-muted)] line-clamp-1 italic">{n.description}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Chip 
                      icon={categoryIcons[n.category] || <Info size={12} />}
                      label={n.category || "General"}
                      size="small"
                      sx={{ 
                        fontWeight: 900, 
                        fontSize: '9px',
                        textTransform: 'uppercase',
                        bgcolor: categoryColors[n.category]?.bg || '#f1f5f9',
                        color: categoryColors[n.category]?.color || '#64748b',
                        borderRadius: '8px',
                        '& .MuiChip-icon': { color: 'inherit' }
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2 text-[var(--text-muted)] font-bold text-[11px]">
                      <Calendar size={13} className="opacity-50" />
                      {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </div>
                  </TableCell>

                  <TableCell align="center">
                    <div className="flex justify-center gap-1">
                      <Tooltip title="View Details">
                        <IconButton 
                          onClick={() => setSelected(n)} 
                          size="small"
                          sx={{ color: '#2563eb', bgcolor: '#eff6ff', borderRadius: '10px', '&:hover': { bgcolor: '#dbeafe' } }}
                        >
                          <Eye size={16} />
                        </IconButton>
                      </Tooltip>
                      {isAdmin && (
                        <Tooltip title="Delete Notice">
                          <IconButton 
                            onClick={() => handleDelete(n._id)} 
                            size="small"
                            sx={{ color: '#ef4444', bgcolor: '#fef2f2', borderRadius: '10px', '&:hover': { bgcolor: '#fee2e2' } }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} sx={{ py: 2, border: 0 }}>
                    <PageLoaderInline message="Loading notices…" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: '1px solid #f1f5f9',
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                fontWeight: 800,
                fontSize: '10px',
                textTransform: 'uppercase',
                color: '#94a3b8'
              }
            }}
          />
        </TableContainer>
      </div>

      {/* DETAIL MODAL (Preserved logic) */}
      {selected && (
        <div className="fixed inset-0 backdrop-blur-sm z-[130] flex items-center justify-center p-4" style={{ background: 'color-mix(in srgb, var(--text) 45%, transparent)' }} onClick={() => setSelected(null)}>
          <div className="rounded-3xl shadow-2xl max-w-lg w-full p-8 border bg-[var(--card)] border-[var(--border)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <Chip 
                label={selected.category} 
                sx={{ 
                  fontWeight: 900, fontSize: '10px', borderRadius: '8px',
                  bgcolor: categoryColors[selected.category]?.bg, color: categoryColors[selected.category]?.color 
                }} 
              />
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-[var(--accent-soft)] rounded-full transition-colors"><X size={20} className="text-[var(--text-muted)]" /></button>
            </div>
            <h2 className="text-2xl font-black text-[var(--text)] mb-4">{selected.title}</h2>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8 p-6 rounded-2xl border italic bg-[var(--accent-bg)] border-[var(--border)]">{selected.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <p className="text-[11px] font-black uppercase text-[var(--text-muted)] flex items-center gap-2 tracking-widest">
                <Calendar size={14} /> Posted on {new Date(selected.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL (Preserved logic) */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm z-[130] flex items-center justify-center p-4" style={{ background: 'color-mix(in srgb, var(--text) 45%, transparent)' }}>
          <div className="rounded-3xl shadow-2xl max-w-md w-full p-8 border bg-[var(--card)] border-[var(--border)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-[var(--text)] uppercase tracking-tight">Post New Notice</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-[var(--accent-soft)] rounded-full transition-colors"><X size={20} className="text-[var(--text-muted)]" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1.5 block ml-1">Title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Notice title..." className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] font-bold bg-[var(--bg)] text-[var(--text)] border-[var(--border)]" />
              </div>
              <div>
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1.5 block ml-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] font-bold bg-[var(--bg)] text-[var(--text)] border-[var(--border)]">
                  {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1.5 block ml-1">Message</label>
                <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Type notice details here..." className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none font-medium bg-[var(--bg)] text-[var(--text)] border-[var(--border)]" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-[var(--text-muted)] bg-[var(--accent-bg)] hover:opacity-90 rounded-2xl transition-all border border-[var(--border)]">Cancel</button>
                <button type="submit" className="flex-1 py-3 user-btn-primary rounded-2xl text-xs shadow-lg">Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default NoticeBoard;