import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const Residents = () => {
  const navigate = useNavigate();
  const [residents, setResidents] = useState([
    { id: 1, name: "Rahul Sharma", unit: "A-101", contact: "+91 9876543210", type: "Owner", status: "Active" },
    { id: 2, name: "Priya Patel", unit: "B-205", contact: "+91 8765432109", type: "Tenant", status: "Active" },
    { id: 3, name: "Amit Kumar", unit: "C-302", contact: "+91 7654321098", type: "Owner", status: "Inactive" },
    { id: 4, name: "Neha Gupta", unit: "A-102", contact: "+91 6543210987", type: "Tenant", status: "Active" },
  ]);

  // Toggle Function
  const handleToggle = (id) => {
    setResidents((prev) =>
      prev.map((resident) =>
        resident.id === id
          ? {
            ...resident,
            status: resident.status === "Active" ? "Inactive" : "Active",
          }
          : resident
      )
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Residents List</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors" onClick={()=>navigate("/residents/add")}>
          + Add Resident
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 border-b">
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Unit/Flat</th>
              <th className="p-3 font-semibold">Contact</th>
              <th className="p-3 font-semibold">Type</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Access</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {residents.map((resident) => (
              <tr key={resident.id} className="border-b hover:bg-gray-50 transition-colors">

                <td className="p-3 font-medium text-gray-800">{resident.name}</td>
                <td className="p-3 text-gray-600">{resident.unit}</td>
                <td className="p-3 text-gray-600">{resident.contact}</td>

                {/* Owner / Tenant Badge */}
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${resident.type === "Owner"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-orange-100 text-orange-700"
                    }`}>
                    {resident.type}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${resident.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}>
                    {resident.status}
                  </span>
                </td>

                {/* Toggle Switch */}
                <td className="p-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={resident.status === "Active"}
                      onChange={() => handleToggle(resident.id)}
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-200"></div>
                    <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-200 transform peer-checked:translate-x-full shadow-sm"></div>
                  </label>
                </td>

                {/* Actions */}
                <td className="p-3 flex gap-4 items-center">

                  {/* Edit Icon */}
                  <button className="text-blue-500 hover:text-blue-700 transition-colors">
                    <FiEdit size={18} />
                  </button>

                  {/* Delete Icon */}
                  <button className="text-red-500 hover:text-red-700 transition-colors">
                    <FiTrash2 size={18} />
                  </button>

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {residents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No residents found. Click "Add Resident" to get started.
        </div>
      )}
    </div>
  );
};

export default Residents;