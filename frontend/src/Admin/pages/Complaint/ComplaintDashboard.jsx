import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ComplaintDashboard = () => {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("All");

  // Dummy Data (Replace with API later)
  const complaints = [
    {
      id: 1,
      title: "Water Leakage",
      category: "Maintenance",
      priority: "High",
      status: "Pending",
      resident: "Flat A-101",
    },
    {
      id: 2,
      title: "Noise Complaint",
      category: "Security",
      priority: "Medium",
      status: "In Progress",
      resident: "Flat B-202",
    },
    {
      id: 3,
      title: "Lift Not Working",
      category: "Maintenance",
      priority: "High",
      status: "Resolved",
      resident: "Flat C-303",
    },
  ];

  // Filter Logic
  const filteredComplaints =
    statusFilter === "All"
      ? complaints
      : complaints.filter((c) => c.status === statusFilter);

  // Summary Stats
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Complaint Management</h1>

        <button
          onClick={() => navigate("/admin/complaints/create")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          New Complaint
        </button>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Pending</p>
          <h2 className="text-2xl font-bold text-red-600">{pending}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">In Progress</p>
          <h2 className="text-2xl font-bold text-yellow-600">{inProgress}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Resolved</p>
          <h2 className="text-2xl font-bold text-green-600">{resolved}</h2>
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* COMPLAINT TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Resident</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredComplaints.map((complaint) => (
              <tr
                key={complaint.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">{complaint.title}</td>
                <td className="p-4">{complaint.category}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${complaint.priority === "High"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                      }`}
                  >
                    {complaint.priority}
                  </span>
                </td>
                <td className="p-4">{complaint.resident}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${complaint.status === "Resolved"
                        ? "bg-green-100 text-green-600"
                        : complaint.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                  >
                    {complaint.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() =>
                      navigate(`/admin/complaints/${complaint.id}`)
                    }
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {filteredComplaints.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center text-gray-500"
                >
                  No complaints found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ComplaintDashboard;