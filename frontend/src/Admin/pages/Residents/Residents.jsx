// pages/ResidentList.jsx (Using Redux - Clean Version)
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchResidents,
  deleteResident,
  } from "../../../store/slices/residentSlice";

const ResidentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Redux state
  const { residents, loading, error, success } = useSelector(
    (state) => state.resident
  );

  // Fetch residents on component mount
  useEffect(() => {
    dispatch(fetchResidents());
  }, [dispatch]);


  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resident?")) {
      dispatch(deleteResident(id)); // ✅ Toast in slice
    }
  };

  // Filter residents based on search
  const filteredResidents = residents.filter((resident) =>
    resident.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.mobileNumber.includes(searchTerm)
  );

  if (loading && residents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading residents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Residents</h1>
            <p className="text-gray-500 mt-1">
              Manage all residents in the society
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/residents/add")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            + Add Resident
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or mobile number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Residents Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredResidents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">No residents found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Flat
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredResidents.map((resident) => (
                  <tr
                    key={resident._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {resident.firstName} {resident.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {resident.mobileNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {resident.email || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {resident.wing}-{resident.flatNumber}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          resident.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {resident.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => navigate(`/admin/residents/edit/${resident._id}`)}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(resident._id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 font-semibold disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 text-sm font-semibold">Total Residents</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {residents.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 text-sm font-semibold">Active</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {residents.filter((r) => r.status === "Active").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-600 text-sm font-semibold">Inactive</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {residents.filter((r) => r.status === "Inactive").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentList;