import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiEdit, FiSearch, FiPlus, FiUser, FiPhone,
  FiLogIn, FiLogOut, FiMapPin, FiActivity, FiClock
} from "react-icons/fi";
import { fetchVisitors, updateVisitorStatus } from "../../../store/slices/visitorSlice";

const STATUS_STYLE = {
  Inside: "bg-green-100 text-green-700",
  Exited: "bg-gray-100 text-gray-500",
};

const Visitors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { list: visitors = [], loading } = useSelector((state) => state.visitor || {});

  useEffect(() => {
    dispatch(fetchVisitors());
  }, [dispatch]);

  const filteredVisitors = useMemo(() =>
    visitors.filter((v) =>
      v.visitorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.flatNumber?.includes(searchTerm) ||
      v.mobileNumber?.includes(searchTerm)
    ), [visitors, searchTerm]);

  const handleMarkExit = (id) => {
    if (window.confirm("Are you sure this visitor has exited?")) {
      dispatch(updateVisitorStatus({ id, status: "Exited", exitTime: new Date() }));
    }
  };

  const formatTime = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION - Same as FlatList */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Visitor Management</h1>
          <p className="text-sm text-gray-500">Real-time log of all society entries and exits.</p>
        </div>
        <button
          onClick={() => navigate("/admin/visitors/add")}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <FiPlus /> Log Visitor
        </button>
      </div>

      {/* TABLE CONTAINER - Same as FlatList */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* SEARCH BAR - Same as FlatList */}
        <div className="p-4 border-b border-gray-50 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[300px]">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Visitor Name, Flat, or Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
            />
          </div>
        </div>

        {/* TABLE BODY - Identical structure to FlatList */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-widest border-b">
              <tr>
                <th className="px-6 py-4">Visitor Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Visiting Unit</th>
                <th className="px-6 py-4">Entry Time</th>
                <th className="px-6 py-4">Exit Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="7" className="p-6 bg-gray-50/50"></td>
                  </tr>
                ))
              ) : filteredVisitors.length > 0 ? (
                filteredVisitors.map((v) => (
                  <tr key={v._id} className="hover:bg-blue-50/30 transition-colors">

                    {/* Visitor Name (Bold like Flat No) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <FiUser size={14} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{v.visitorName}</div>
                          <div className="text-[11px] text-gray-400">{v.purpose || "General"}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact (Medium grey) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 font-medium">
                        <FiPhone className="text-gray-400" size={12} />
                        {v.mobileNumber}
                      </div>
                    </td>

                    {/* Unit (Bold Blue like Wing-Flat) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-indigo-400" size={14} />
                        <span className="font-bold text-indigo-600">
                          {v.flatNumber}
                        </span>
                      </div>
                    </td>

                    {/* Entry Time (Green Accent) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <FiLogIn size={13} />
                        {formatTime(v.entryTime)}
                      </div>
                    </td>

                    {/* Exit Time (Grey/Amber) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <FiLogOut size={13} />
                        {formatTime(v.exitTime)}
                      </div>
                    </td>

                    {/* Status Badge (Uppercase Bold text-[10px]) */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[v.status] || STATUS_STYLE.Exited}`}>
                        {v.status}
                      </span>
                    </td>

                    {/* Action Buttons (Square with Backgrounds) */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        {v.status === "Inside" && (
                          <button
                            onClick={() => handleMarkExit(v._id)}
                            className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                            title="Mark Exit"
                          >
                            <FiClock size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/admin/visitors/edit/${v._id}`)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    No visitor records found.
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

export default Visitors;