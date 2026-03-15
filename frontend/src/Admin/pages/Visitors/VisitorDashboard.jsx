import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VisitorDashboard = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");

  // Dummy Data (Replace with API later)
  const visitors = [
    {
      id: 1,
      name: "Raj Patel",
      flat: "A-101",
      purpose: "Delivery",
      status: "Checked In",
      entryTime: "10:30 AM",
    },
    {
      id: 2,
      name: "Aman Shah",
      flat: "B-202",
      purpose: "Guest",
      status: "Pending",
      entryTime: "11:00 AM",
    },
    {
      id: 3,
      name: "Kunal Mehta",
      flat: "C-303",
      purpose: "Maintenance",
      status: "Checked Out",
      entryTime: "09:45 AM",
    },
  ];

  // Filter Logic
  const filteredVisitors =
    statusFilter === "All"
      ? visitors
      : visitors.filter((v) => v.status === statusFilter);

  // Stats
  const total = visitors.length;
  const checkedIn = visitors.filter(v => v.status === "Checked In").length;
  const checkedOut = visitors.filter(v => v.status === "Checked Out").length;
  const pending = visitors.filter(v => v.status === "Pending").length;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Visitor Management</h1>

        
          <div className="flex gap-3">
          <button
            onClick={() => navigate('/visitors/reports')}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            View Reports
          </button>

          <button
            onClick={() =>
            {
                console.log("add maintainene")
                 navigate('/visitor/add')
            }
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Visitor
          </button>
        </div>
      
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Visitors</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Checked In</p>
          <h2 className="text-2xl font-bold text-green-600">{checkedIn}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Checked Out</p>
          <h2 className="text-2xl font-bold text-gray-600">{checkedOut}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Pending</p>
          <h2 className="text-2xl font-bold text-yellow-600">{pending}</h2>
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="All">All Status</option>
          <option value="Checked In">Checked In</option>
          <option value="Checked Out">Checked Out</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* VISITOR TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Flat</th>
              <th className="p-4">Purpose</th>
              <th className="p-4">Entry Time</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredVisitors.map((visitor) => (
              <tr key={visitor.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{visitor.name}</td>
                <td className="p-4">{visitor.flat}</td>
                <td className="p-4">{visitor.purpose}</td>
                <td className="p-4">{visitor.entryTime}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      visitor.status === "Checked In"
                        ? "bg-green-100 text-green-600"
                        : visitor.status === "Checked Out"
                        ? "bg-gray-200 text-gray-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {visitor.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => navigate(`/visitors/${visitor.id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {filteredVisitors.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No visitors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default VisitorDashboard;    