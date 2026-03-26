import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wrench, Plus, X, Clock, CheckCircle, AlertCircle, Search, ChevronDown } from "lucide-react";
import { fetchComplaints, createComplaint, updateComplaintStatus } from "../../store/slices/complaintSlice";

const statusConfig = {
  Pending:    { color: "bg-amber-100 text-amber-700",   icon: <Clock size={12} /> },
  "In Progress": { color: "bg-blue-100 text-blue-700",  icon: <AlertCircle size={12} /> },
  Resolved:   { color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle size={12} /> },
};

const categoryColors = {
  Plumbing:    "bg-blue-50 text-blue-600",
  Electrical:  "bg-amber-50 text-amber-600",
  Cleaning:    "bg-green-50 text-green-600",
  Security:    "bg-red-50 text-red-600",
  Lift:        "bg-violet-50 text-violet-600",
  Other:       "bg-slate-100 text-slate-600",
};

const RaiseComplaint = () => {
  const dispatch = useDispatch();
  const { complaints, loading } = useSelector((s) => s.complaint);
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", description: "", category: "Other", wing: user?.wing || "", flatNumber: user?.flatNumber || "" });

  useEffect(() => { dispatch(fetchComplaints()); }, [dispatch]);

  const filtered = (complaints || []).filter(c => {
    const matchStatus = filter === "All" || c.status === filter;
    const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    await dispatch(createComplaint(form));
    setShowForm(false);
    setForm({ title: "", description: "", category: "Other", wing: user?.wing || "", flatNumber: user?.flatNumber || "" });
  };

  const stats = [
    { label: "Total", value: complaints?.length || 0, color: "text-slate-700", bg: "bg-slate-50" },
    { label: "Pending", value: complaints?.filter(c => c.status === "Pending").length || 0, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "In Progress", value: complaints?.filter(c => c.status === "In Progress").length || 0, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Resolved", value: complaints?.filter(c => c.status === "Resolved").length || 0, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-slate-50 p-6">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Wrench size={20} className="text-orange-500" />
              <h1 className="text-2xl font-bold text-slate-800">Help Desk</h1>
            </div>
            <p className="text-sm text-slate-400">Track and manage your complaints</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition">
            <Plus size={16} /> Raise Complaint
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* SEARCH + FILTER */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search complaints..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
          </div>
          <div className="flex gap-2">
            {["All", "Pending", "In Progress", "Resolved"].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* COMPLAINTS LIST */}
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse" />)}</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(c => (
              <div key={c._id} onClick={() => setSelected(c)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-slate-200 transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${categoryColors[c.category] || categoryColors.Other}`}>{c.category}</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 ${statusConfig[c.status]?.color || statusConfig.Pending.color}`}>
                        {statusConfig[c.status]?.icon} {c.status}
                      </span>
                      {c.wing && <span className="text-xs text-slate-400">Wing {c.wing} • Flat {c.flatNumber}</span>}
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">{c.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-1">{c.description}</p>
                  </div>
                  <p className="text-xs text-slate-300 shrink-0">{new Date(c.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
              </div>
            ))}
            {!filtered.length && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 text-slate-400">
                <Wrench size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No complaints found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${categoryColors[selected.category] || categoryColors.Other}`}>{selected.category}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 ${statusConfig[selected.status]?.color}`}>
                  {statusConfig[selected.status]?.icon} {selected.status}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">{selected.title}</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">{selected.description}</p>
            {(selected.wing || selected.flatNumber) && (
              <p className="text-xs text-slate-400 mb-4">Wing {selected.wing} • Flat {selected.flatNumber}</p>
            )}
            <p className="text-xs text-slate-300 mb-5">{new Date(selected.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            {isAdmin && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Update Status</label>
                <div className="flex gap-2 flex-wrap">
                  {["Pending", "In Progress", "Resolved"].map(s => (
                    <button key={s} onClick={() => { dispatch(updateComplaintStatus({ id: selected._id, status: s })); setSelected(null); }}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${selected.status === s ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">Raise Complaint</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Brief issue title" className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {Object.keys(categoryColors).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Wing</label>
                  <input value={form.wing} onChange={e => setForm({ ...form, wing: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Flat No.</label>
                  <input value={form.flatNumber} onChange={e => setForm({ ...form, flatNumber: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
                <textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the issue in detail..." className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 transition">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaiseComplaint;