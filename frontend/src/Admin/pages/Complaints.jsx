import React, { useState } from "react";

const Complaints = () => {
  // 1. Mock data for Complaints and Service Requests
  const [complaints, setComplaints] = useState([
    { id: "CMP-101", unit: "A-101", category: "Plumbing", subject: "Leaking pipe in master bathroom", date: "15 Feb 2026", status: "Pending" },
    { id: "CMP-102", unit: "C-302", category: "Electrical", subject: "Corridor light not working", date: "14 Feb 2026", status: "In Progress" },
    { id: "CMP-103", unit: "B-205", category: "Security", subject: "Unauthorized parking in my spot", date: "12 Feb 2026", status: "Resolved" },
    { id: "CMP-104", unit: "A-102", category: "Maintenance", subject: "Garbage not collected today", date: "15 Feb 2026", status: "Pending" },
  ]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      
      {/* 2. Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Complaints & Requests</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Raise Complaint
        </button>
      </div>

      {/* 3. The Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 border-b">
              <th className="p-3 font-semibold">Ticket ID</th>
              <th className="p-3 font-semibold">Unit</th>
              <th className="p-3 font-semibold">Category</th>
              <th className="p-3 font-semibold">Subject</th>
              <th className="p-3 font-semibold">Date Raised</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id} className="border-b hover:bg-gray-50 transition-colors">
                
                <td className="p-3 text-gray-800 font-medium text-sm">{complaint.id}</td>
                <td className="p-3 font-medium text-blue-600">{complaint.unit}</td>
                <td className="p-3 text-gray-600">{complaint.category}</td>
                
                {/* Truncate long subjects so they don't break the table layout */}
                <td className="p-3 text-gray-800 max-w-xs truncate" title={complaint.subject}>
                  {complaint.subject}
                </td>
                
                <td className="p-3 text-gray-600 text-sm">{complaint.date}</td>

                {/* Dynamic styling for Status */}
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                    complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {complaint.status}
                  </span>
                </td>

                {/* Action Buttons */}
                <td className="p-3 flex gap-3 items-center">
                  {/* Provide a quick action to resolve pending tickets */}
                  {complaint.status !== 'Resolved' && (
                    <button className="text-green-600 hover:text-green-800 font-medium text-sm border border-green-200 px-2 py-1 rounded">
                      Mark Resolved
                    </button>
                  )}
                  <button className="text-blue-500 hover:text-blue-700 font-medium ml-2">View</button>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 4. Empty State */}
      {complaints.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Hooray! No pending complaints.
        </div>
      )}

    </div>
  );
};

export default Complaints;