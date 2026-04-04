import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wrench, Plus, X, Clock, CheckCircle, AlertCircle, Search, FileUp, TrendingUp } from "lucide-react";
import { fetchComplaints, createComplaint } from "../../store/slices/complaintSlice";

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

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Wrench size={20} className="text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Help Desk</h1>
              <p className="text-sm text-slate-500">Report issues & track complaint status</p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-slate-200`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-600 mt-1 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* TAB NAVIGATION */}
        <div className="bg-white border border-slate-200 rounded-2xl flex p-1.5 mb-8 shadow-sm">
          <button
            onClick={() => setActiveTab("form")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === "form" 
                ? "bg-slate-900 text-white" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Plus size={16} /> New Complaint
          </button>
          <button
            onClick={() => setActiveTab("complaints")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === "complaints" 
                ? "bg-slate-900 text-white" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <TrendingUp size={16} /> My Complaints ({userComplaints.length})
          </button>
        </div>

        {/* TAB 1: COMPLAINT FORM */}
        {activeTab === "form" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Report a Problem</h2>
              <p className="text-sm text-slate-500 mb-6">Tell us what's wrong and we'll help resolve it</p>

              <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
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
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-400"
                      value="Not available"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Flat No.</label>
                    <input
                      readOnly
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-400"
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
                    className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    disabled={complaintLoading || !form.title || !residentId}
                    className="flex-1 py-3 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {complaintLoading ? "Submitting..." : "Submit Complaint"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* TAB 2: MY COMPLAINTS */}
        {activeTab === "complaints" && (
          <div>
            {/* SEARCH + FILTER */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search your complaints..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["All", "Pending", "In Progress", "Resolved"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilter(s)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                        filter === s 
                          ? "bg-slate-900 text-white" 
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                  <div key={i} className="h-28 bg-white rounded-2xl border border-slate-100 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <Wrench size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="font-semibold text-slate-700 mb-1">No complaints found</p>
                <p className="text-sm text-slate-500">Your reported issues will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((c) => (
                  <div key={c._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-slate-900 text-lg">{c.title}</h3>
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
                            src={`http://localhost:4000${c.attachment}`} 
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
                    <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      <p className="text-xs text-slate-600">
                        <strong>Timeline:</strong> Created {new Date(c.createdAt).toLocaleDateString()} 
                        {c.status === "Resolved" && c.resolvedAt && ` • Resolved ${new Date(c.resolvedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default RaiseComplaint;
