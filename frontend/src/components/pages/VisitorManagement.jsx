import React, { useState } from "react";

const VisitorManagement = () => {
  const [visitors, setVisitors] = useState([
    {
      id: 1,
      name: "Ramesh Kumar",
      purpose: "Guest",
      flat: "A-302",
      time: "10:30 AM",
      status: "Pending",
    },
    {
      id: 2,
      name: "Amazon Delivery",
      purpose: "Delivery",
      flat: "B-104",
      time: "12:15 PM",
      status: "Approved",
    },
    {
      id: 3,
      name: "Electrician",
      purpose: "Maintenance",
      flat: "C-210",
      time: "02:00 PM",
      status: "Rejected",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: newStatus } : v
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-600 text-white";
      case "Rejected":
        return "bg-red-600 text-white";
      default:
        return "bg-yellow-400 text-black";
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-12 px-4">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold">
          Visitor Management
        </h2>
        <p className="text-gray-500">
          Approve or deny visitor entries and track records.
        </p>
      </div>

      {/* ADD VISITOR CARD */}
      <div className="bg-white shadow rounded p-6 mb-8">
        <h4 className="font-bold text-lg mb-4">New Visitor Entry</h4>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            placeholder="Visitor Name"
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Purpose"
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Flat No."
            className="border rounded px-3 py-2"
          />
          <button className="bg-blue-600 text-white rounded px-4 py-2">
            Add Entry
          </button>
        </div>
      </div>

      {/* VISITOR TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border text-left">Name</th>
              <th className="p-3 border text-left">Purpose</th>
              <th className="p-3 border text-left">Flat</th>
              <th className="p-3 border text-left">Time</th>
              <th className="p-3 border text-left">Status</th>
              <th className="p-3 border text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {visitors.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="p-3 border">{v.name}</td>
                <td className="p-3 border">{v.purpose}</td>
                <td className="p-3 border">{v.flat}</td>
                <td className="p-3 border">{v.time}</td>

                <td className="p-3 border">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      v.status
                    )}`}
                  >
                    {v.status}
                  </span>
                </td>

                <td className="p-3 border space-x-2">
                  <button
                    onClick={() => updateStatus(v.id, "Approved")}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(v.id, "Rejected")}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VisitorManagement;