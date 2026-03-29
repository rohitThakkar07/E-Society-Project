import React, { useEffect, useState, useMemo } from "react";
import { FiEdit, FiTrash2, FiSearch, FiPlus, FiUser, FiPhone, FiMapPin, FiClock, FiShield } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGuards,
  deleteGuard,
  updateGuardStatus,
} from "../../../store/slices/guardSlice";

const STATUS_STYLE = {
  Active: "bg-green-50 text-green-700 border-green-100",
  Inactive: "bg-red-50 text-red-700 border-red-100",
};

const SHIFT_STYLE = {
  Day: "bg-amber-50 text-amber-700 border-amber-100",
  Night: "bg-indigo-50 text-indigo-700 border-indigo-100",
};

const Guards = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const { guards = [], loading } = useSelector((state) => state.guard);

  useEffect(() => {
    dispatch(fetchGuards());
  }, [dispatch]);

  // Optimized Filtering
  const filteredGuards = useMemo(() =>
    guards.filter((g) =>
      `${g.name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.mobileNumber?.includes(searchTerm) ||
      g.shift?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [guards, searchTerm]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this guard?")) {
      dispatch(deleteGuard(id));
    }
  };

  const handleToggle = (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    dispatch(updateGuardStatus({ id, status: newStatus }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <FiShield className="text-blue-600" /> Security Personnel
          </h1>
          <p className="text-sm text-gray-500">Monitor shifts, assigned posts, and real-time status.</p>
        </div>
        <button
          onClick={() => navigate("/admin/guards/add")}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <FiPlus /> Add Guard
        </button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID or shift..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b">
              <tr>
                <th className="px-6 py-4">Guard Details</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Shift</th>
                <th className="px-6 py-4">Assigned Post</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="p-8 bg-gray-50/30"></td>
                  </tr>
                ))
              ) : filteredGuards.length > 0 ? (
                filteredGuards.map((guard) => (
                  <tr key={guard._id} className="hover:bg-blue-50/30 transition-colors">
                    
                    {/* Guard Identity */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                          <FiUser size={16} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{guard.name}</div>
                          <div className="text-[10px] text-blue-500 font-mono font-bold tracking-tighter">
                            UID: {guard.guardId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2 font-medium">
                        <FiPhone className="text-slate-400" size={12} />
                        {guard.mobileNumber}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{guard.email || "internal@society.com"}</div>
                    </td>

                    {/* Shift Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiClock className="text-slate-400" size={14} />
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${SHIFT_STYLE[guard.shift] || "bg-gray-50"}`}>
                          {guard.shift}
                        </span>
                      </div>
                    </td>

                    {/* Assigned Post */}
                    <td className="px-6 py-4 text-gray-500 italic text-xs">
                      <div className="flex items-center gap-2">
                        <FiMapPin size={12} /> Main Entry Gate
                      </div>
                    </td>

                    {/* ✅ STATUS COLUMN (FIXED) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <span className={`min-w-[80px] text-center py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_STYLE[guard.status]}`}>
                          {guard.status}
                        </span>
                        
                        <label className="relative inline-flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={guard.status === "Active"}
                            onChange={() => handleToggle(guard._id, guard.status)}
                          />
                          <div className="w-8 h-4 bg-gray-200 rounded-full peer 
                                          peer-checked:bg-blue-600 
                                          after:content-[''] 
                                          after:absolute after:top-[2px] after:left-[2px] 
                                          after:bg-white after:rounded-full after:h-3 after:w-3 
                                          after:transition-all peer-checked:after:translate-x-4">
                          </div>
                        </label>
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => navigate(`/admin/guards/edit/${guard._id}`)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(guard._id)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-400 font-medium">
                    No security personnel records found.
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

export default Guards;