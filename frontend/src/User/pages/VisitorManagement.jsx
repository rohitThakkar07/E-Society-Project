import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, Plus, X, Search, CheckCircle, XCircle, Clock, Phone, User, Calendar } from "lucide-react";
import { fetchVisitors, createVisitor, approveVisitor, denyVisitor } from "../../store/slices/visitorSlice";

const statusConfig = {
  Pending:  { color: "bg-amber-100 text-amber-700",   icon: <Clock size={12} /> },
  Approved: { color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle size={12} /> },
  Denied:   { color: "bg-red-100 text-red-700",       icon: <XCircle size={12} /> },
  "Checked Out": { color: "bg-slate-100 text-slate-500", icon: <CheckCircle size={12} /> },
};

const VisitorManagement = () => {
  const dispatch = useDispatch();
  const { visitors, loading } = useSelector((s) => s.visitor);
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isGuard = user?.role?.toLowerCase() === "guard";

  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({
    visitorName: "", visitorPhone: "", purpose: "Visit",
    wing: user?.wing || "", flatNumber: user?.flatNumber || "", vehicleNumber: ""
  });

  useEffect(() => { dispatch(fetchVisitors()); }, [dispatch]);

  const filtered = (visitors || []).filter(v => {
    const matchStatus = filter === "All" || v.status === filter;
    const matchSearch = v.visitorName?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    await dispatch(createVisitor(form));
    setShowForm(false);
    setForm({ visitorName: "", visitorPhone: "", purpose: "Visit", wing: user?.wing || "", flatNumber: user?.flatNumber || "", vehicleNumber: "" });
  };

  const todayVisitors = (visitors || []).filter(v => new Date(v.createdAt).toDateString() === new Date().toDateString());
  const pendingCount = (visitors || []).filter(v => v.status === "Pending").length;
  const approvedToday = todayVisitors.filter(v => v.status === "Approved").length;

  const purposes = ["Visit", "Delivery", "Service", "Guest", "Other"];
  const purposeColors = {
    Visit: "bg-blue-50 text-blue-600", Delivery: "bg-amber-50 text-amber-600",
    Service: "bg-violet-50 text-violet-600", Guest: "bg-emerald-50 text-emerald-600", Other: "bg-slate-100 text-slate-500"
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-slate-50 p-6">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users size={20} className="text-violet-500" />
              <h1 className="text-2xl font-bold text-slate-800">Visitor Management</h1>
            </div>
            <p className="text-sm text-slate-400">{todayVisitors.length} visitors today</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition">
            <Plus size={16} /> Add Visitor
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Today's Visitors", value: todayVisitors.length, color: "text-violet-600", bg: "bg-violet-50" },
            { label: "Pending Approval", value: pendingCount, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Approved Today", value: approvedToday, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map(s => (
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
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search visitors..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", "Pending", "Approved", "Denied"].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filter === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* VISITORS TABLE */}
        {loading ? (
          <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-slate-100" />)}</div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {filtered.length ? filtered.map((v, i) => (
              <div key={v._id} onClick={() => setSelected(v)}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition cursor-pointer ${i > 0 ? "border-t border-slate-50" : ""}`}>
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
                  <User size={18} className="text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-800 text-sm">{v.visitorName}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${purposeColors[v.purpose] || purposeColors.Other}`}>{v.purpose}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1 ${statusConfig[v.status]?.color || statusConfig.Pending.color}`}>
                      {statusConfig[v.status]?.icon} {v.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400 flex-wrap">
                    {v.visitorPhone && <span className="flex items-center gap-1"><Phone size={10} />{v.visitorPhone}</span>}
                    {v.wing && <span>Wing {v.wing} • Flat {v.flatNumber}</span>}
                    <span className="flex items-center gap-1"><Calendar size={10} />{new Date(v.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
                {(isAdmin || isGuard) && v.status === "Pending" && (
                  <div className="flex gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={() => dispatch(approveVisitor(v._id))}
                      className="flex items-center gap-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                      <CheckCircle size={13} /> Approve
                    </button>
                    <button onClick={() => dispatch(denyVisitor(v._id))}
                      className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                      <XCircle size={13} /> Deny
                    </button>
                  </div>
                )}
              </div>
            )) : (
              <div className="text-center py-16 text-slate-400">
                <Users size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">No visitors found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-slate-800">Visitor Details</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center">
                <User size={28} className="text-violet-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-lg">{selected.visitorName}</p>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 w-fit mt-1 ${statusConfig[selected.status]?.color}`}>
                  {statusConfig[selected.status]?.icon} {selected.status}
                </span>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: "Phone", value: selected.visitorPhone },
                { label: "Purpose", value: selected.purpose },
                { label: "Wing / Flat", value: `Wing ${selected.wing} • Flat ${selected.flatNumber}` },
                { label: "Vehicle", value: selected.vehicleNumber || "N/A" },
                { label: "Date", value: new Date(selected.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" }) },
              ].map(r => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-slate-400">{r.label}</span>
                  <span className="font-medium text-slate-700">{r.value}</span>
                </div>
              ))}
            </div>
            {(isAdmin || isGuard) && selected.status === "Pending" && (
              <div className="flex gap-3 mt-6">
                <button onClick={() => { dispatch(approveVisitor(selected._id)); setSelected(null); }}
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition">Approve</button>
                <button onClick={() => { dispatch(denyVisitor(selected._id)); setSelected(null); }}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition">Deny</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD VISITOR MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-800">Add Visitor</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Visitor Name</label>
                <input required value={form.visitorName} onChange={e => setForm({ ...form, visitorName: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</label>
                <input value={form.visitorPhone} onChange={e => setForm({ ...form, visitorPhone: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Purpose</label>
                <select value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {purposes.map(p => <option key={p}>{p}</option>)}
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
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Vehicle Number (optional)</label>
                <input value={form.vehicleNumber} onChange={e => setForm({ ...form, vehicleNumber: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-700 transition">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorManagement;