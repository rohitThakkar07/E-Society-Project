import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchResidents, deleteResident } from "../../../store/slices/residentSlice";

const ResidentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { residents = [], loading } = useSelector((state) => state.resident);

  useEffect(() => {
    dispatch(fetchResidents());
  }, [dispatch]);

  const filteredResidents = residents.filter((r) =>
    r.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.flatNumber?.includes(searchTerm) ||
    r.mobileNumber?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Residents</h1>
          <button onClick={() => navigate("/admin/residents/add")} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold">+ Add Resident</button>
        </div>

        <input
          type="text"
          placeholder="Search by name, flat number, or mobile..."
          className="w-full px-4 py-3 mb-6 border rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Resident Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Flat Details</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Mobile</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResidents.map((r) => (
                <tr key={r._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{r.firstName} {r.lastName}</p>
                    <p className="text-xs text-gray-400">{r.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-indigo-600">{r.wing}-{r.flatNumber}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{r.residentType}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{r.mobileNumber}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-3">
                    <button onClick={() => navigate(`/admin/residents/edit/${r._id}`)} className="text-indigo-600 hover:underline">Edit</button>
                    <button onClick={() => dispatch(deleteResident(r._id))} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResidentList;