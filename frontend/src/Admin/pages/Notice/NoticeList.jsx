import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotices, deleteNotice, updateNotice } from "../../../store/slices/noticeSlice";

const PRIORITY_STYLE = { High: "bg-red-100 text-red-700", Medium: "bg-yellow-100 text-yellow-700", Low: "bg-green-100 text-green-700" };
const CATEGORY_STYLE = { General: "bg-blue-100 text-blue-700", Event: "bg-purple-100 text-purple-700", Meeting: "bg-indigo-100 text-indigo-700", Maintenance: "bg-yellow-100 text-yellow-700", Emergency: "bg-red-100 text-red-700", Other: "bg-gray-100 text-gray-600" };

const NoticeList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: notices, loading } = useSelector((s) => s.notice) ?? {};
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => { dispatch(fetchNotices()); }, [dispatch]);

  const filtered = useMemo(() =>
    (notices || []).filter((n) => {
      const matchSearch   = n.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "All" || n.category === categoryFilter;
      const matchPriority = priorityFilter === "All" || n.priority === priorityFilter;
      return matchSearch && matchCategory && matchPriority;
    }), [notices, search, categoryFilter, priorityFilter]);

  const handleToggleActive = (notice) => {
    dispatch(updateNotice({ id: notice._id, data: { isActive: !notice.isActive } }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this notice?")) dispatch(deleteNotice(id));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Board</h1>
          <p className="text-sm text-gray-500">Manage society announcements and notices</p>
        </div>
        <button onClick={() => navigate("/admin/notice/add")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium self-start">
          + Post Notice
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3">
        <input type="text" placeholder="Search notices..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm w-full sm:w-52 outline-none focus:ring-2 focus:ring-blue-500" />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
          <option value="All">All Categories</option>
          {["General","Event","Meeting","Maintenance","Emergency","Other"].map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
          <option value="All">All Priorities</option>
          {["High","Medium","Low"].map(p => <option key={p}>{p}</option>)}
        </select>
        {(search || categoryFilter !== "All" || priorityFilter !== "All") && (
          <button onClick={() => { setSearch(""); setCategoryFilter("All"); setPriorityFilter("All"); }}
            className="text-xs text-red-500 border border-red-100 bg-red-50 px-3 py-2 rounded-lg">Clear</button>
        )}
      </div>

      <div className="grid gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))
        ) : filtered.length > 0 ? (
          filtered.map((notice) => (
            <div key={notice._id}
              className={`bg-white rounded-xl shadow-sm border p-5 transition-all ${notice.isActive ? "border-gray-100" : "border-gray-200 opacity-60"}`}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_STYLE[notice.category] || "bg-gray-100 text-gray-600"}`}>{notice.category}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PRIORITY_STYLE[notice.priority]}`}>{notice.priority}</span>
                    {!notice.isActive && <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">Inactive</span>}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">{notice.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{notice.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notice.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    {notice.expiresAt && ` · Expires ${new Date(notice.expiresAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => navigate(`/admin/notice/${notice._id}`)}
                    className="text-blue-600 hover:underline text-sm">View</button>
                  <button onClick={() => navigate(`/admin/notice/edit/${notice._id}`)}
                    className="text-yellow-600 hover:underline text-sm">Edit</button>
                  <button onClick={() => handleToggleActive(notice)}
                    className={`text-sm ${notice.isActive ? "text-gray-500" : "text-green-600"} hover:underline`}>
                    {notice.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => handleDelete(notice._id)}
                    className="text-red-500 hover:underline text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400">
            <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">No notices found</p>
          </div>
        )}
      </div>
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-400 mt-4 text-center">Showing {filtered.length} of {(notices||[]).length} notices</p>
      )}
    </div>
  );
};

export default NoticeList;