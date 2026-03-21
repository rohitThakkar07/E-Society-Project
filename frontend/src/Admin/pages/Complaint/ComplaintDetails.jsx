import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComplaintById,
  updateComplaintStatus,
} from "../../../store/slices/complaintSlice";

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleComplaint: complaint, loading } = useSelector(
    (state) => state.complaint
  );

  // 🔥 Fetch complaint
  useEffect(() => {
    dispatch(fetchComplaintById(id));
  }, [id, dispatch]);

  // 🔥 Update status
  const handleStatusUpdate = (status) => {
    dispatch(updateComplaintStatus({ id, status }));
  };

  if (loading || !complaint) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading complaint...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Complaint Details</h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Back
        </button>
      </div>

      {/* DETAILS */}
      <div className="bg-white rounded-xl shadow p-6 space-y-6">

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <p className="text-gray-500 text-sm">Title</p>
            <p className="font-semibold">{complaint.title}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Category</p>
            <p>{complaint.category}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Priority</p>
            <span className="px-3 py-1 bg-red-100 text-red-600 rounded">
              {complaint.priority}
            </span>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Status</p>
            <span
              className={`px-3 py-1 rounded ${
                complaint.status === "Resolved"
                  ? "bg-green-100 text-green-600"
                  : complaint.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {complaint.status}
            </span>
          </div>

        </div>

        {/* Description */}
        <div>
          <p className="text-gray-500 text-sm mb-2">Description</p>
          <p className="bg-gray-50 p-4 rounded-lg">
            {complaint.description}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 pt-4 border-t">

          {complaint.status !== "In Progress" && (
            <button
              onClick={() => handleStatusUpdate("In Progress")}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
            >
              Mark In Progress
            </button>
          )}

          {complaint.status !== "Resolved" && (
            <button
              onClick={() => handleStatusUpdate("Resolved")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Mark Resolved
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default ComplaintDetails;