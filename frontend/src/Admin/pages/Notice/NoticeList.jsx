import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2, FiSearch, FiPlus, FiEye, FiBell, FiCalendar, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { fetchNotices, deleteNotice, updateNotice } from "../../../store/slices/noticeSlice";

const PRIORITY_STYLE = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700"
};

const CATEGORY_STYLE = {
  General: "bg-blue-50 text-blue-600",
  Event: "bg-purple-50 text-purple-600",
  Meeting: "bg-indigo-50 text-indigo-600",
  Maintenance: "bg-amber-50 text-amber-600",
  Emergency: "bg-rose-50 text-rose-600",
  Other: "bg-slate-50 text-slate-600"
};

const NoticeList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: notices = [], loading } = useSelector((s) => s.notice) ?? {};

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  const filtered = useMemo(
    () =>
      notices.filter((n) => {
        const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
        const matchCategory = categoryFilter === "All" || n.category === categoryFilter;
        const matchPriority = priorityFilter === "All" || n.priority === priorityFilter;
        return matchSearch && matchCategory && matchPriority;
      }),
    [notices, search, categoryFilter, priorityFilter]
  );

  const handleToggleActive = (notice) => {
    dispatch(updateNotice({ id: notice._id, data: { isActive: !notice.isActive } }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) dispatch(deleteNotice(id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <FiBell className="text-blue-600" /> Notice Board
          </h1>
          <p className="text-sm text-gray-500">Post announcements and important updates for residents.</p>
        </div>
        <button
          onClick={() => navigate("/admin/notice/add")}
          className="admin-btn-primary"
        >
          <FiPlus /> Post Notice
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-50 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Categories</option>
            {["General", "Event", "Meeting", "Maintenance", "Emergency", "Other"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Priorities</option>
            {["High", "Medium", "Low"].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="p-4 md:p-5">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-52 rounded-2xl border border-gray-100 bg-gray-50/70 animate-pulse" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((notice) => (
                <article
                  key={notice._id}
                  className={`rounded-2xl border p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                    notice.isActive ? "bg-white border-gray-100" : "bg-gray-50/80 border-gray-200"
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${CATEGORY_STYLE[notice.category] || CATEGORY_STYLE.Other}`}>
                        {notice.category}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${PRIORITY_STYLE[notice.priority]}`}>
                        {notice.priority}
                      </span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${notice.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      {notice.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="mb-5">
                    <h2 className={`text-lg font-bold leading-snug ${notice.isActive ? "text-gray-900" : "text-gray-500"}`}>
                      {notice.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-3">
                      {notice.content}
                    </p>
                  </div>

                  <div className="mb-5 flex items-center gap-2 text-gray-500">
                    <FiCalendar className="text-gray-400" size={14} />
                    <span className="text-xs font-medium">
                      {new Date(notice.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                    <button
                      onClick={() => navigate(`/admin/notice/${notice._id}`)}
                      className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      title="View"
                    >
                      <FiEye size={14} />
                    </button>
                    <button
                      onClick={() => navigate(`/admin/notice/edit/${notice._id}`)}
                      className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit size={14} />
                    </button>
                    <button
                      onClick={() => handleToggleActive(notice)}
                      className={`p-2 rounded-lg transition-colors ${notice.isActive ? "text-amber-600 bg-amber-50 hover:bg-amber-100" : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"}`}
                      title={notice.isActive ? "Deactivate" : "Activate"}
                    >
                      {notice.isActive ? <FiXCircle size={14} /> : <FiCheckCircle size={14} />}
                    </button>
                    <button
                      onClick={() => handleDelete(notice._id)}
                      className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center text-gray-400">
              <FiBell size={40} className="mx-auto mb-3 opacity-20" />
              No notices found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeList;
