import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Residents = () => {
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/resident/list");
        const data = response.data.data || response.data;

        if (Array.isArray(data)) {
          setResidents(data);
        } else {
          setResidents([]);
        }
      } catch (error) {
        console.error("Error fetching residents:", error);
        setResidents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResidents();
  }, []);

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    setResidents((prev) =>
      prev.map((resident) =>
        resident._id === id ? { ...resident, status: newStatus } : resident
      )
    );

    try {
      await axios.put(`http://localhost:4000/api/resident/update/${id}`, {
        status: newStatus,
      });
    } catch (error) {
      alert("Failed to update status on the server. Reverting change.");
      setResidents((prev) =>
        prev.map((resident) =>
          resident._id === id ? { ...resident, status: currentStatus } : resident
        )
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resident?")) return;

    try {
      await axios.delete(`http://localhost:4000/api/resident/delete/${id}`);
      setResidents((prev) => prev.filter((resident) => resident._id !== id));
    } catch (error) {
      alert("Failed to delete resident.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}  
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Residents List</h2>
          <p className="text-sm text-gray-500 mt-1">Manage society residents, their flats, and access status.</p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
          onClick={() => navigate("add")}
        >
          + Add Resident
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="px-5 py-4 font-semibold">Resident Info</th>
              <th className="px-5 py-4 font-semibold">Contact Details</th>
              <th className="px-5 py-4 font-semibold">Flat Details</th>
              <th className="px-5 py-4 font-semibold">Emergency</th>
              <th className="px-5 py-4 font-semibold">Move-In</th>
              <th className="px-5 py-4 font-semibold">Type</th>
              <th className="px-5 py-4 font-semibold">Status / Access</th>
              <th className="px-5 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-500">
                  <div className="flex justify-center items-center gap-2">
                    <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                    Loading residents...
                  </div>
                </td>
              </tr>
            ) : residents.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-12 bg-gray-50/50">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-lg font-medium text-gray-700 mb-1">No Residents Found</span>
                    <span className="text-sm text-gray-400">Click "Add Resident" to register someone.</span>
                  </div>
                </td>
              </tr>
            ) : (
              residents.map((resident) => (
                <tr
                  key={resident._id}
                  className="hover:bg-blue-50/30 transition-colors duration-200 align-middle"
                >
                  {/* Grouped 1: Resident Info */}
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">
                      {resident.firstName} {resident.lastName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {resident.gender || "N/A"} • DOB: {formatDate(resident.dateOfBirth)}
                    </div>
                  </td>

                  {/* Grouped 2: Contact Details */}
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800">{resident.mobileNumber}</div>
                    <div className="text-xs text-gray-500 mt-1">{resident.email || "N/A"}</div>
                  </td>

                  {/* Grouped 3: Flat Details */}
                  <td className="px-5 py-4">
                    <div className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md mb-1">
                      {resident.wing}-{resident.flatNumber}
                    </div>
                    <div className="text-xs text-gray-500">
                      Floor {resident.floorNumber || "-"} • {resident.flatType || "-"}
                    </div>
                  </td>

                  {/* Grouped 4: Emergency */}
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800">{resident.emergencyContactName || "N/A"}</div>
                    <div className="text-xs text-gray-500 mt-1">{resident.emergencyContactNumber || "N/A"}</div>
                  </td>

                  {/* Move-In Date */}
                  <td className="px-5 py-4 text-gray-600 font-medium">
                    {formatDate(resident.moveInDate)}
                  </td>

                  {/* Type Badge */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        resident.residentType === "Owner"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {resident.residentType}
                    </span>
                  </td>

                  {/* Status & Access Combined */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          resident.status === "Active"
                            ? "text-green-700 bg-green-100"
                            : "text-red-700 bg-red-100"
                        }`}
                      >
                        {resident.status}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={resident.status === "Active"}
                          onChange={() => handleToggle(resident._id, resident.status)}
                        />
                        <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-200"></div>
                        <div className="absolute left-[2px] top-[2px] w-4 h-4 bg-white rounded-full transition-transform duration-200 transform peer-checked:translate-x-full shadow-sm"></div>
                      </label>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex gap-3 justify-center">
                      <button 
                        onClick={() => navigate(`/residents/edit/${resident._id}`)}
                        className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(resident._id)}
                        className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-800 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Residents;