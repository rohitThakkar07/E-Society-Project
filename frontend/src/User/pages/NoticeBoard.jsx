import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, Search, Calendar, Tag, ChevronRight, Plus, X } from "lucide-react";
import { fetchNotices, createNotice, deleteNotice } from "../../store/slices/noticeSlice";

const NoticeBoard = () => {
  const dispatch = useDispatch();
  const { list: notices = [], loading } = useSelector((s) => s.notice ?? {});
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const role = user?.role?.toLowerCase();
  const isAdmin = role === "admin";

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "General" });

  useEffect(() => { dispatch(fetchNotices()); }, [dispatch]);

  const categories = ["All", "General", "Maintenance", "Event", "Emergency", "Finance"];
  const categoryColors = {
    General: "bg-slate-100 text-slate-600",
    Maintenance: "bg-orange-100 text-orange-600",
    Event: "bg-blue-100 text-blue-600",
    Emergency: "bg-red-100 text-red-600",
    Finance: "bg-emerald-100 text-emerald-600",
  };

  const filtered = (notices || []).filter((n) => {
    const matchSearch = n.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filter === "All" || n.category === filter;
    return matchSearch && matchCat;
  });

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
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-slate-50 p-6">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bell size={20} className="text-rose-500" />
              <h1 className="text-2xl font-bold text-slate-800">Notice Board</h1>
            </div>
            <p className="text-sm text-slate-400">{filtered.length} notices</p>
          </div>
          {isAdmin && (
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition">
              <Plus size={16} /> New Notice
            </button>
          )}
        </div>

        {/* SEARCH + FILTER */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notices..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === c ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* NOTICES GRID */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-slate-100 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((n) => (
              <div key={n._id} onClick={() => setSelected(n)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-slate-200 transition group">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${categoryColors[n.category] || categoryColors.General}`}>
                    <Tag size={10} className="inline mr-1" />{n.category || "General"}
                  </span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition mt-0.5 shrink-0" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">{n.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 mb-3">{n.description}</p>
                <div className="flex items-center gap-1 text-xs text-slate-300">
                  <Calendar size={11} /> {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
            ))}
            {!filtered.length && (
              <div className="md:col-span-2 text-center py-16 text-slate-400">
                <Bell size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No notices found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${categoryColors[selected.category] || categoryColors.General}`}>
                {selected.category || "General"}
              </span>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">{selected.title}</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">{selected.description}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <Calendar size={11} /> {new Date(selected.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              {isAdmin && (
                <button onClick={() => handleDelete(selected._id)}
                  className="text-xs text-red-500 hover:text-red-700 font-medium border border-red-100 hover:border-red-300 px-3 py-1.5 rounded-lg transition">
                  Delete Notice
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">Create Notice</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Notice title..." className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
                <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Notice details..." className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 transition">Post Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;