import React, { useState } from "react";

const Visitors = () => {
  // 1. Mock data for Visitor Logs
  const [visitors, setVisitors] = useState([
    { id: 1, name: "Amazon Delivery", phone: "+91 9876511111", hostUnit: "A-101", purpose: "Delivery", entryTime: "10:30 AM", exitTime: "10:45 AM", status: "Left" },
    { id: 2, name: "Sunita Devi", phone: "+91 9876522222", hostUnit: "B-205", purpose: "Maid", entryTime: "11:00 AM", exitTime: "-", status: "Inside" },
    { id: 3, name: "Rahul Verma", phone: "+91 9876533333", hostUnit: "C-302", purpose: "Guest", entryTime: "11:45 AM", exitTime: "-", status: "Inside" },
    { id: 4, name: "Urban Company", phone: "+91 9876544444", hostUnit: "A-102", purpose: "Plumber", entryTime: "09:00 AM", exitTime: "10:00 AM", status: "Left" },
  ]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      
      {/* 2. Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Visitor Logs</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Log Visitor
        </button>
      </div>

      {/* 3. The Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 border-b">
              <th className="p-3 font-semibold">Visitor Name</th>
              <th className="p-3 font-semibold">Contact</th>
              <th className="p-3 font-semibold">Visiting Unit</th>
              <th className="p-3 font-semibold">Purpose</th>
              <th className="p-3 font-semibold">Entry / Exit</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((visitor) => (
              <tr key={visitor.id} className="border-b hover:bg-gray-50 transition-colors">
                
                <td className="p-3 text-gray-800 font-medium">{visitor.name}</td>
                <td className="p-3 text-gray-600">{visitor.phone}</td>
                <td className="p-3 font-medium text-blue-600">{visitor.hostUnit}</td>
                <td className="p-3 text-gray-600">{visitor.purpose}</td>
                
                {/* Combined Entry and Exit Times */}
                <td className="p-3 text-sm">
                  <div className="text-green-600 font-medium">In: {visitor.entryTime}</div>
                  <div className="text-gray-500">Out: {visitor.exitTime}</div>
                </td>

                {/* Dynamic styling for Status */}
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    visitor.status === 'Inside' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {visitor.status}
                  </span>
                </td>

                {/* Action Buttons */}
                <td className="p-3 flex gap-3 items-center mt-1">
                  {/* Show a "Mark Exit" button only if they are still inside */}
                  {visitor.status === 'Inside' && (
                    <button className="text-orange-500 hover:text-orange-700 font-medium text-sm border border-orange-200 px-2 py-1 rounded">
                      Mark Exit
                    </button>
                  )}
                  <button className="text-blue-500 hover:text-blue-700 font-medium">Edit</button>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 4. Empty State */}
      {visitors.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No visitors logged today.
        </div>
      )}

    </div>
  );
};

export default Visitors;