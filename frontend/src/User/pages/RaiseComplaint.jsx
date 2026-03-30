import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wrench, Plus, X, Clock, CheckCircle, AlertCircle, Search } from "lucide-react";
import { fetchComplaints, createComplaint } from "../../store/slices/complaintSlice";
import { fetchResidentById } from "../../store/slices/residentSlice";

const statusConfig = {
  Pending:      { color: "bg-amber-100 text-amber-700",    icon: <Clock size={12} /> },
  "In Progress":{ color: "bg-blue-100 text-blue-700",     icon: <AlertCircle size={12} /> },
  Resolved:     { color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle size={12} /> },
};

const categoryColors = {
  Water:   "bg-blue-50 text-blue-600",
  Electricity: "bg-amber-50 text-amber-600",
  Security:   "bg-red-50 text-red-600",
  Maintenance:       "bg-violet-50 text-violet-600",
  Other:      "bg-slate-100 text-slate-600",
};

const RaiseComplaint = () => {
  const dispatch = useDispatch();

  const { complaints, loading: complaintLoading } = useSelector((s) => s.complaint);

  // FIX: Use profileLoading (not loading) from residentSlice.
  // profileLoading is only ever set by fetchResidentById, so it won't
  // be stuck true because of complaint or list actions.
  const { singleResident, profileLoading: residentLoading } = useSelector((s) => s.resident);

  const user       = JSON.parse(localStorage.getItem("userData") || "{}");
  const residentId = user?.profileId;

  const [showForm, setShowForm] = useState(false);
  const [filter,   setFilter]   = useState("All");
  const [search,   setSearch]   = useState("");

  const [form, setForm] = useState({
    title:       "",
    description: "",
    category:    "Other",
    wing:        "",
    flatNumber:  "",
    attachment:  null,
  });

  useEffect(() => {
    dispatch(fetchComplaints());
    if (residentId) {
      dispatch(fetchResidentById(residentId));
    }
  }, [dispatch, residentId]);

  // Autofill wing + flatNumber from residentSlice once singleResident loads
  useEffect(() => {
    if (!singleResident) return;
    setForm((prev) => ({
      ...prev,
      wing:       singleResident.wing       ?? "",
      flatNumber: singleResident.flatNumber ?? "",
    }));
  }, [singleResident]);

  const filtered = (complaints || []).filter((c) => {
    const matchStatus = filter === "All" || c.status === filter;
    const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleCreate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title",       form.title);
    formData.append("description", form.description);
    formData.append("category",    form.category);
    formData.append("resident",    singleResident?._id);
    if (form.attachment) formData.append("attachment", form.attachment);

    const result = await dispatch(createComplaint(formData));

    if (!result.error) {
      setShowForm(false);
      setForm({
        title:       "",
        description: "",
        category:    "Other",
        wing:        singleResident?.wing       ?? "",
        flatNumber:  singleResident?.flatNumber ?? "",
        attachment:  null,
      });
    }
  };

  const stats = [
    { label: "Total",       value: complaints?.length || 0,                                            color: "text-slate-700",   bg: "bg-slate-50"   },
    { label: "Pending",     value: complaints?.filter((c) => c.status === "Pending").length     || 0,  color: "text-amber-600",   bg: "bg-amber-50"   },
    { label: "In Progress", value: complaints?.filter((c) => c.status === "In Progress").length || 0,  color: "text-blue-600",    bg: "bg-blue-50"    },
    { label: "Resolved",    value: complaints?.filter((c) => c.status === "Resolved").length    || 0,  color: "text-emerald-600", bg: "bg-emerald-50" },
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
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition"
          >
            <Plus size={16} /> Raise Complaint
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
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
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search complaints..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
          </div>
          <div className="flex gap-2">
            {["All", "Pending", "In Progress", "Resolved"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filter === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* LIST */}
        {complaintLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center text-slate-400 text-sm">
                No complaints found
              </div>
            ) : (
              filtered.map((c) => (
                <div key={c._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-800">{c.title}</h3>
                      <p className="text-sm text-slate-400 mt-0.5">{c.description}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Wing {c.resident?.wing ?? "—"} • Flat {c.resident?.flatNumber ?? "—"}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${statusConfig[c.status]?.color}`}>
                      {statusConfig[c.status]?.icon} {c.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* CREATE MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-800">Raise Complaint</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">

                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Brief issue title"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the issue..."
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.keys(categoryColors).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>

                {/* Wing + Flat autofill */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Wing</label>
                    <input
                      value={residentLoading ? "Loading..." : (form.wing || "—")}
                      readOnly
                      className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-100 text-slate-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Flat No.</label>
                    <input
                      value={residentLoading ? "Loading..." : (form.flatNumber || "—")}
                      readOnly
                      className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-100 text-slate-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* ATTACHMENT */}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Attachment (Optional)
                  </label>
                  <div className="mt-1">
                    <label className="w-full cursor-pointer">
                      <div className="flex flex-col items-center justify-center px-4 py-5 border border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                        <svg className="w-6 h-6 mb-2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l-4-4m4 4l4-4" />
                        </svg>
                        <p className="text-xs text-slate-500">
                          {form.attachment ? form.attachment.name : "Click to upload image (max 5MB)"}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        className="hidden"
                        onChange={(e) => setForm({ ...form, attachment: e.target.files[0] || null })}
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={complaintLoading || !singleResident}
                  className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {complaintLoading ? "Submitting..." : "Submit Complaint"}
                </button>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RaiseComplaint;