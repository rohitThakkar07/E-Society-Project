import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * Guards Component
 * Logic:
 * - Fetches guard list from backend using mobileNumber, fullName, guardId, etc.
 * - Handles status toggle (Active/Inactive) via PUT request.
 * - Handles deletion of guard records.
 */
const Guards = () => {
  const navigate = useNavigate();
  const [guards, setGuards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch All Guards from Backend
  useEffect(() => {
    const fetchGuards = async () => {
      try {
        // Ensure the URL matches your backend route (e.g., http://localhost:4000/api/guards/all)
        const response = await axios.get("http://localhost:4000/api/guard/list");
        const data = response.data.data || response.data;

        if (Array.isArray(data)) {
          setGuards(data);
        } else {
          setGuards([]);
        }
      } catch (error) {
        console.error("Error fetching guards:", error);
        setGuards([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuards();
  }, []);

  // 2. Toggle Guard Status (Active/Inactive)
  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    // Optimistic UI Update: update state immediately
    setGuards((prev) =>
      prev.map((guard) =>
        guard._id === id ? { ...guard, status: newStatus } : guard
      )
    );

    try {
      // API call to update status in DB
      await axios.put(`http://localhost:4000/api/guards/update/${id}`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status. Reverting...");
      // Revert if API fails
      setGuards((prev) =>
        prev.map((guard) =>
          guard._id === id ? { ...guard, status: currentStatus } : guard
        )
      );
    }
  };

  // 3. Delete Guard Record
 const handleDelete = async (id) => {

  try {
    await axios.delete(`http://localhost:4000/api/guard/${id}`);
    setGuards((prev) => prev.filter((guard) => guard._id !== id));

    toast.success("Guard deleted successfully!");
  } catch (error) {
    console.error("Delete failed", error);

    toast.error(
      error.response?.data?.message || "Failed to delete guard record."
    );
  }
};

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Table Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Security Guards
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Monitor shifts, assigned posts, and guard availability.
          </p>
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md"
          onClick={() => navigate("/guards/add")}
        >
          + Add Guard
        </button>
      </div>

      {/* Guards Table Area */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="px-5 py-4">Guard Name & ID</th>
              <th className="px-5 py-4">Contact Info</th>
              <th className="px-5 py-4">Shift Type</th>
              <th className="px-5 py-4">Assigned Post</th>
              <th className="px-5 py-4">Current Status</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500 italic">
                  Loading guards from server...
                </td>
              </tr>
            ) : guards.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-400 font-medium">
                  No Guards Registered in the system.
                </td>
              </tr>
            ) : (
              guards.map((guard) => (
                <tr key={guard._id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* Guard Name and System ID */}
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">
                      {guard.fullName}
                    </div>
                    <div className="text-xs text-indigo-500 font-medium">
                      UID: {guard.guardId}
                    </div>
                  </td>

                  {/* Mobile and Email Address */}
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800">
                      {guard.mobileNumber}
                    </div>
                    <div className="text-xs text-gray-500">
                      {guard.emailAddress || "N/A"}
                    </div>
                  </td>

                  {/* Shift Badge */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        guard.shift === "Day"
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          : "bg-indigo-100 text-indigo-700 border border-indigo-200"
                      }`}
                    >
                      {guard.shift}
                    </span>
                  </td>

                  {/* Static Placeholder for Post */}
                  <td className="px-5 py-4">
                    <span className="text-gray-400 text-xs italic">
                      Main Gate
                    </span>
                  </td>

                  {/* Status Toggle Switch */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`min-w-[70px] text-center px-2 py-1 rounded text-[10px] uppercase font-black ${
                          guard.status === "Active"
                            ? "text-green-700 bg-green-100 border border-green-200"
                            : "text-red-700 bg-red-100 border border-red-200"
                        }`}
                      >
                        {guard.status}
                      </span>

                      <div className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={guard.status === "Active"}
                          onChange={() => handleToggle(guard._id, guard.status)}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </div>
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-5 py-4">
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => navigate(`/guards/edit/${guard._id}`)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="Edit Guard"
                      >
                        <FiEdit size={19} />
                      </button>

                      <button
                        onClick={() => handleDelete(guard._id)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        title="Delete Record"
                      >
                        <FiTrash2 size={19} />
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

export default Guards;