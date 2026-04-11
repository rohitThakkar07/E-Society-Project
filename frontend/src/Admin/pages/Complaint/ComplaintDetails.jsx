import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  FiArrowLeft, FiAlertCircle, FiClock, 
  FiCheckCircle, FiInfo, FiTag, FiAlertTriangle,
  FiMaximize, FiDownload
} from "react-icons/fi";
import {
  fetchComplaintById,
  updateComplaintStatus,
} from "../../../store/slices/complaintSlice";

const STATUS_STYLE = {
  Pending: "bg-red-100 text-red-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Resolved: "bg-green-100 text-green-700",
};

const PRIORITY_STYLE = {
  High: "bg-rose-50 text-rose-600 border-rose-100",
  Medium: "bg-blue-50 text-blue-600 border-blue-100",
  Low: "bg-gray-50 text-gray-600 border-gray-100",
};

const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:4000";

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleComplaint: complaint, loading } = useSelector(
    (state) => state.complaint || {}
  );

  useEffect(() => {
    dispatch(fetchComplaintById(id));
  }, [id, dispatch]);

  const handleStatusUpdate = (status) => {
    dispatch(updateComplaintStatus({ id, status }));
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-400 font-medium">Fetching complaint details...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="p-12 text-center text-gray-500">Complaint not found.</div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <FiArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Complaint Details</h1>
            <p className="text-sm text-gray-500 font-mono">ID: {complaint._id?.toUpperCase()}</p>
          </div>
        </div>

        <div className="flex gap-3">
          {complaint.status !== "In Progress" && complaint.status !== "Resolved" && (
            <button
              onClick={() => handleStatusUpdate("In Progress")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <FiClock /> Mark In Progress
            </button>
          )}
          {complaint.status !== "Resolved" && (
            <button
              onClick={() => handleStatusUpdate("Resolved")}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <FiCheckCircle /> Mark Resolved
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <FiInfo size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Issue Description</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">{complaint.title}</h2>
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-gray-700 leading-relaxed">
              {complaint.description}
            </div>

            {/* ✅ ATTACHMENT SECTION */}
            {complaint.attachment ? (
              <div className="mt-10 pt-10 border-t border-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <FiMaximize size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Evidence Attachment</span>
                  </div>
                  <a 
                    href={`${BASE_URL}${complaint.attachment}`} 
                    download 
                    className="text-blue-600 hover:underline text-xs font-bold flex items-center gap-1"
                  >
                    <FiDownload size={14}/> Download Original
                  </a>
                </div>

                <div className="relative group max-w-lg rounded-3xl overflow-hidden border-4 border-white shadow-xl ring-1 ring-gray-100">
                  <img 
                    src={`${BASE_URL}${complaint.attachment}`} 
                    alt="Evidence" 
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 cursor-zoom-in"
                    onClick={() => window.open(`${BASE_URL}${complaint.attachment}`, "_blank")}
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3Ctext x='10' y='100' font-size='14' fill='%23999'%3EImage not found%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-xs font-medium">Click to expand</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-10 pt-10 border-t border-gray-50">
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <FiMaximize size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Evidence Attachment</span>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-gray-400">
                  <p>No attachment provided</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b pb-4">Classification</h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 flex items-center gap-2 font-medium">
                  <FiTag className="text-gray-400" /> Category
                </span>
                <span className="font-bold text-gray-900 text-sm bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                  {complaint.category}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 flex items-center gap-2 font-medium">
                  <FiAlertTriangle className="text-gray-400" /> Priority
                </span>
                <span className={`px-3 py-1 rounded-lg text-[11px] font-black border uppercase ${PRIORITY_STYLE[complaint.priority]}`}>
                  {complaint.priority}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 flex items-center gap-2 font-medium">
                  <FiAlertCircle className="text-gray-400" /> Status
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${STATUS_STYLE[complaint.status]}`}>
                  {complaint.status}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Submission Details</p>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-slate-400">Created At</p>
                <p className="text-sm font-bold">{new Date(complaint.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Last Updated</p>
                <p className="text-sm font-bold text-blue-400">{new Date(complaint.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;