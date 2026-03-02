import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState({
    id,
    title: "Water Leakage",
    category: "Maintenance",
    priority: "High",
    description: "Water leaking from bathroom ceiling.",
    resident: "Flat A-101",
    status: "Pending",
    assignedTo: "Unassigned",
  });

  const updateStatus = (newStatus) => {
    setComplaint({ ...complaint, status: newStatus });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Complaint Details</h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Back
        </button>
      </div>

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
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm">
              {complaint.priority}
            </span>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Resident</p>
            <p>{complaint.resident}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Assigned To</p>
            <p>{complaint.assignedTo}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Status</p>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
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

        <div>
          <p className="text-gray-500 text-sm mb-2">Description</p>
          <p className="bg-gray-50 p-4 rounded-lg">
            {complaint.description}
          </p>
        </div>

        {/* Admin Actions */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            onClick={() => updateStatus("In Progress")}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
          >
            Mark In Progress
          </button>

          <button
            onClick={() => updateStatus("Resolved")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Mark Resolved
          </button>
        </div>

      </div>
    </div>
  );
};

export default ComplaintDetails;