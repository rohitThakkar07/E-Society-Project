import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Wrench, Plus, X, Clock, CheckCircle, AlertCircle, Search, FileUp, TrendingUp } from "lucide-react";
import { fetchComplaints, createComplaint } from "../../store/slices/complaintSlice";

const filePublicOrigin = () => {
  const u = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return u.replace(/\/api\/?$/, "");
};

const statusConfig = {
  Pending:      { color: "bg-amber-100 text-amber-700",    icon: <Clock size={14} />, label: "Pending" },
  "In Progress":{ color: "bg-blue-100 text-blue-700",     icon: <AlertCircle size={14} />, label: "In Progress" },
  Resolved:     { color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle size={14} />, label: "Resolved" },
  Rejected:     { color: "bg-red-100 text-red-700",        icon: <X size={14} />, label: "Rejected" },
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

  const user       = JSON.parse(localStorage.getItem("userData") || "{}");
  const residentId = user?._id || user?.profileId || user?.id;

  const [activeTab, setActiveTab] = useState("form");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title:       "",
    description: "",
    category:    "Other",
    attachment:  null,
    attachmentPreview: null,
  });

  useEffect(() => {
    dispatch(fetchComplaints());
    // Don't fetch resident - form works without it and avoids "not found" errors
    // Users can still submit complaints with just their resident ID from auth
  }, [dispatch]);

  // Filter to show only current user's complaints
  const userComplaints = (complaints || []).filter((c) => {
    const complaintResidentId = c.resident?._id || c.resident;
    return complaintResidentId === residentId;
  });

  const filtered = userComplaints.filter((c) => {
    const matchStatus = filter === "All" || c.status === filter;
    const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ 
        ...form, 
        attachment: file,
        attachmentPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!residentId) {
      alert("Error: Unable to identify user. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("title",       form.title);
    formData.append("description", form.description);
    formData.append("category",    form.category);
    formData.append("resident",    residentId);
    if (form.attachment) formData.append("attachment", form.attachment);

    const result = await dispatch(createComplaint(formData));

    if (result.type.endsWith("fulfilled")) {
      // Reset form
      setForm({
        title:       "",
        description: "",
        category:    "Other",
        attachment:  null,
        attachmentPreview: null,
      });
      // Switch to complaints tab
      setTimeout(() => setActiveTab("complaints"), 1000);
    }
  };

  const stats = [
    { label: "Total",       value: userComplaints?.length || 0,                                            color: "text-slate-700",   bg: "bg-slate-50"   },
    { label: "Pending",     value: userComplaints?.filter((c) => c.status === "Pending").length     || 0,  color: "text-amber-600",   bg: "bg-amber-50"   },
    { label: "In Progress", value: userComplaints?.filter((c) => c.status === "In Progress").length || 0,  color: "text-blue-600",    bg: "bg-blue-50"    },
    { label: "Resolved",    value: userComplaints?.filter((c) => c.status === "Resolved").length    || 0,  color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  const listAnim = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemAnim = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="user-page-mesh min-h-screen bg-[var(--bg)] text-[var(--text)] p-4 sm:p-6 transition-colors duration-300">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div className="relative z-[1] mx-auto max-w-5xl">
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-orange-500/15">
              <Wrench size={22} className="text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[var(--text)]">Help desk</h1>
              <p className="text-sm text-[var(--text-muted)]">Report issues and track status</p>
            </div>
          </div>
        </motion.div>

        {/* STATS */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={listAnim}
          className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={itemAnim}
              className={`${s.bg} rounded-md border border-[var(--border)] p-4 shadow-sm transition hover:shadow-md`}
            >
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="mt-1 text-xs font-semibold text-[var(--text-muted)]">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* TAB NAVIGATION */}
        <div className="mb-8 flex rounded-md border border-[var(--border)] bg-[var(--card)] p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold transition ${
              activeTab === "form"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--text-muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--text)]"
            }`}
          >
            <Plus size={16} /> New
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("complaints")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold transition ${
              activeTab === "complaints"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--text-muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--text)]"
            }`}
          >
            <TrendingUp size={16} /> My list ({userComplaints.length})
          </button>
        </div>

        {/* TAB 1: COMPLAINT FORM */}
        {activeTab === "form" && (
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-md border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8"
            >
              <h2 className="mb-1 text-2xl font-black text-[var(--text)]">Report a problem</h2>
              <p className="mb-6 text-sm text-[var(--text-muted)]">Describe the issue — we&apos;ll route it to the right team.</p>

              <div className="mb-6 rounded-md border border-[var(--border)] bg-[var(--accent-bg)] p-4">
                <p className="text-sm text-slate-600 font-semibold">
                  ℹ️ Please provide issue details. Your resident information will be retrieved from your account.
                </p>
              </div>

              <form onSubmit={handleCreate} className="space-y-5">

                {/* TITLE */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Issue Title</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g., Water leakage in bathroom"
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                  />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the issue in detail..."
                    className="w-full resize-none rounded-md border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                  />
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-orange-500/40"
                  >
                    {Object.keys(categoryColors).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* WING + FLAT - Auto-filled */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Wing</label>
                    <input
                      readOnly
                      className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm bg-slate-50 text-slate-400"
                      value="Not available"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Flat No.</label>
                    <input
                      readOnly
                      className="w-full px-4 py-3 border border-[var(--border)] rounded-xl text-sm bg-slate-50 text-slate-400"
                      value="Not available"
                    />
                  </div>
                </div>

                {/* IMAGE ATTACHMENT */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                    <FileUp size={14} className="inline mr-1" /> Attach Image (Optional)
                  </label>
                  <div className="space-y-3">
                    <label className="w-full cursor-pointer block">
                      <div className="flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-slate-100 hover:border-orange-300 transition">
                        <svg className="w-10 h-10 mb-2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path d="M12 16.5v-9m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33A3 3 0 0116.5 19.5H6.75Z" />
                        </svg>
                        <p className="text-xs font-semibold text-slate-700">
                          {form.attachmentPreview ? "📸 " + form.attachment?.name : "Click to upload image"}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">JPG, PNG up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    
                    {/* IMAGE PREVIEW */}
                    {form.attachmentPreview && (
                      <div className="relative">
                        <img 
                          src={form.attachmentPreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-xl border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, attachment: null, attachmentPreview: null })}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setForm({
                        title: "",
                        description: "",
                        category: "Other",
                        attachment: null,
                        attachmentPreview: null,
                      });
                    }}
                    className="flex-1 rounded-md border border-[var(--border)] py-3 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)]"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={complaintLoading || !form.title || !residentId}
                    className="flex-1 rounded-md bg-orange-600 py-3 text-sm font-bold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {complaintLoading ? "Submitting..." : "Submit Complaint"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}

        {/* TAB 2: MY COMPLAINTS */}
        {activeTab === "complaints" && (
          <div>
            {/* SEARCH + FILTER */}
            <div className="mb-6 rounded-md border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search your complaints..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["All", "Pending", "In Progress", "Resolved"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilter(s)}
                      className={`rounded-md px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
                        filter === s 
                          ? "bg-[var(--accent)] text-white" 
                          : "bg-[var(--accent-bg)] text-[var(--text)] hover:bg-[var(--accent-soft)]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* COMPLAINTS LIST */}
            {complaintLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-[var(--card)] rounded-2xl border border-[var(--border)] animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm">
                <Wrench size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="font-semibold text-slate-700 mb-1">No complaints found</p>
                <p className="text-sm text-slate-500">Your reported issues will appear here</p>
              </div>
            ) : (
              <motion.div initial="hidden" animate="show" variants={listAnim} className="space-y-4">
                {filtered.map((c) => (
                  <motion.div
                    key={c._id}
                    variants={itemAnim}
                    className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--card)] shadow-sm transition hover:shadow-md"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-[var(--text)] text-lg">{c.title}</h3>
                            <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${statusConfig[c.status]?.color}`}>
                              {statusConfig[c.status]?.icon} 
                              {statusConfig[c.status]?.label}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-3 leading-relaxed">{c.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                            <span>
                              <strong className={`px-2.5 py-1 rounded-lg inline-block ${categoryColors[c.category]}`}>
                                {c.category}
                              </strong>
                            </span>
                            <span>📅 {new Date(c.createdAt).toLocaleDateString("en-IN")}</span>
                            {c.updatedAt && c.updatedAt !== c.createdAt && (
                              <span>✏️ Updated {new Date(c.updatedAt).toLocaleDateString("en-IN")}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* IMAGE ATTACHMENT PREVIEW */}
                      {c.attachment && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <img 
                            src={c.attachment?.startsWith("http") ? c.attachment : `${filePublicOrigin()}${c.attachment}`}
                            alt="Complaint" 
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                            className="w-full max-h-64 object-cover rounded-xl border border-slate-200"
                          />
                        </div>
                      )}
                    </div>

                    {/* STATUS TIMELINE */}
                    <div className="flex items-center gap-2 border-t border-[var(--border)] bg-[var(--accent-bg)] px-5 py-3">
                      <Clock size={14} className="text-slate-400" />
                      <p className="text-xs text-slate-600">
                        <strong>Timeline:</strong> Created {new Date(c.createdAt).toLocaleDateString()}
                        {c.status === "Resolved" && c.resolvedAt && ` • Resolved ${new Date(c.resolvedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default RaiseComplaint;
