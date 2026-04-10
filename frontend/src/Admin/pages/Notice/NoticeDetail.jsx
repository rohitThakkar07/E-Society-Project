import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNoticeById, deleteNotice } from "../../../store/slices/noticeSlice";

const PRIORITY_STYLE = { High: "bg-red-100 text-red-700", Medium: "bg-yellow-100 text-yellow-700", Low: "bg-green-100 text-green-700" };
const CATEGORY_STYLE = { General: "bg-blue-100 text-blue-700", Event: "bg-purple-100 text-purple-700", Meeting: "bg-indigo-100 text-indigo-700", Maintenance: "bg-yellow-100 text-yellow-700", Emergency: "bg-red-100 text-red-700", Other: "bg-gray-100 text-gray-600" };

const NoticeDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { singleNotice: notice, loading } = useSelector((s) => s.notice) ?? {};

  useEffect(() => { if (id) dispatch(fetchNoticeById(id)); }, [id, dispatch]);

  const handleDelete = async () => {
    if (window.confirm("Delete this notice?")) {
      await dispatch(deleteNotice(id));
      navigate("/admin/notice/list");
    }
  };

  if (loading && !notice) return (
    <div className="p-6 min-h-screen bg-gray-100 flex items-center justify-center">
      <svg className="w-8 h-8 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
    </div>
  );

  if (!notice) return (
    <div className="p-6 text-center text-gray-400">
      <p className="mb-2">Notice not found.</p>
      <button onClick={() => navigate(-1)} className="text-blue-600 underline text-sm">← Go back</button>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Detail</h1>
          <p className="text-sm text-gray-500">View full notice</p>
        </div>
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Back
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className={`h-1.5 ${notice.priority === "High" ? "bg-red-500" : notice.priority === "Medium" ? "bg-yellow-400" : "bg-green-500"}`} />
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_STYLE[notice.category] || "bg-gray-100 text-gray-600"}`}>{notice.category}</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PRIORITY_STYLE[notice.priority]}`}>{notice.priority} Priority</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${notice.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              {notice.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4">{notice.title}</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{notice.content}</p>

          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-6 text-sm text-gray-400">
            <span>Posted: {new Date(notice.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</span>
            {notice.expiresAt && <span>Expires: {new Date(notice.expiresAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</span>}
          </div>
        </div>

        <div className="flex gap-3 px-6 md:px-8 py-5 border-t border-gray-100 bg-gray-50">
          <button onClick={() => navigate(`/admin/notice/edit/${id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold">Edit</button>
          <button onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;