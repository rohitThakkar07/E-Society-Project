import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Guards = () => {
  const navigate = useNavigate();
  // 1. Mock data for Security Guards
  const [guards, setGuards] = useState([
    { id: 1, name: "Vikram Singh", phone: "+91 9876500001", shift: "Day", assignedGate: "Main Gate", status: "Active" },
    { id: 2, name: "Rajesh Kumar", phone: "+91 9876500002", shift: "Night", assignedGate: "Gate 2", status: "Active" },
    { id: 3, name: "Suresh Yadav", phone: "+91 9876500003", shift: "Rotating", assignedGate: "Basement Parking", status: "On Leave" },
    { id: 4, name: "Anil Sharma", phone: "+91 9876500004", shift: "Day", assignedGate: "Gate 1", status: "Active" },
  ]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      
      {/* 2. Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Security Guards</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        onClick={
         ()=> navigate("/guards/add")
        }>
          + Add Guard
        </button>
      </div>

      {/* 3. The Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 border-b">
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Contact Number</th>
              <th className="p-3 font-semibold">Shift</th>
              <th className="p-3 font-semibold">Assigned Post</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guards.map((guard) => (
              <tr key={guard.id} className="border-b hover:bg-gray-50 transition-colors">
                
                <td className="p-3 text-gray-800 font-medium">{guard.name}</td>
                <td className="p-3 text-gray-600">{guard.phone}</td>
                
                {/* Dynamic styling for Shifts */}
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    guard.shift === 'Day' ? 'bg-yellow-100 text-yellow-700' : 
                    guard.shift === 'Night' ? 'bg-indigo-100 text-indigo-700' : 
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {guard.shift}
                  </span>
                </td>

                <td className="p-3 text-gray-600">{guard.assignedGate}</td>

                {/* Dynamic styling for Status */}
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    guard.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {guard.status}
                  </span>
                </td>

                {/* Action Buttons */}
                <td className="p-3 flex gap-3">
                  <button className="text-blue-500 hover:text-blue-700 font-medium">Edit</button>
                  <button className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 4. Empty State */}
      {guards.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No security guards found. Click "Add Guard" to register someone.
        </div>
      )}

    </div>
  );
};

export default Guards;