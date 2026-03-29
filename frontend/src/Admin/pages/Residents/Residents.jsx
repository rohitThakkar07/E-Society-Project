import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiSearch, FiPlus, FiUser, FiHome, FiPhone } from "react-icons/fi";
import { fetchResidents, deleteResident } from "../../../store/slices/residentSlice";

const STATUS_STYLE = { 
  Active: "bg-green-100 text-green-700", 
  Inactive: "bg-gray-100 text-gray-500" 
};

const TYPE_STYLE = { 
  Owner: "bg-blue-100 text-blue-700", 
  Tenant: "bg-purple-100 text-purple-700" 
};

const ResidentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { residents = [], loading } = useSelector((state) => state.resident);

  useEffect(() => {
    dispatch(fetchResidents());
  }, [dispatch]);

  const filteredResidents = useMemo(() =>
    residents.filter((r) =>
      r.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.flatNumber?.includes(searchTerm) ||
      r.mobileNumber?.includes(searchTerm)
    ), [residents, searchTerm]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this resident?")) {
      dispatch(deleteResident(id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resident Management</h1>
          <p className="text-sm text-gray-500">Manage all society members, owners, and tenants.</p>
        </div>
        <button 
          onClick={() => navigate("/admin/residents/add")} 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-semibold flex items-center gap-2 transition-all shadow-sm"
        >
          <FiPlus /> Add Resident
        </button>
      </div>

      {/* SEARCH SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[300px]">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Name, Flat No, or Mobile..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
            />
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-widest border-b">
              <tr>
                <th className="px-6 py-4">Resident Name</th>
                <th className="px-6 py-4">Flat Details</th>
                <th className="px-6 py-4">Resident Type</th>
                <th className="px-6 py-4">Mobile</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="p-6 bg-gray-50/50"></td>
                  </tr>
                ))
              ) : filteredResidents.length > 0 ? (
                filteredResidents.map((r) => (
                  <tr key={r._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                           <FiUser size={14} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{r.firstName} {r.lastName}</div>
                          <div className="text-[11px] text-gray-400">{r.email || "No Email"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiHome className="text-indigo-400" size={14} />
                        <span className="font-bold text-indigo-600">
                          {r.wing ? `${r.wing} - ` : ""}{r.flatNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[11px] font-bold ${TYPE_STYLE[r.residentType] || "bg-gray-100"}`}>
                        {r.residentType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 font-medium">
                        <FiPhone className="text-gray-400" size={12} />
                        {r.mobileNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_STYLE[r.status] || "bg-gray-100"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => navigate(`/admin/residents/edit/${r._id}`)} 
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(r._id)} 
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-400">
                    No residents found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResidentList;