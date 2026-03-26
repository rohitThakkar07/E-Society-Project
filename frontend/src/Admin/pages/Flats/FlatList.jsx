import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2, FiEye, FiSearch, FiPlus } from "react-icons/fi";
import { fetchFlats, fetchFlatSummary, deleteFlat } from "../../../store/slices/flatSlice";

const STATUS_STYLE = { 
  Occupied: "bg-green-100 text-green-700", 
  Vacant: "bg-gray-100 text-gray-500", 
  "Under Maintenance": "bg-yellow-100 text-yellow-700" 
};

const OCC_STYLE = { 
  Owner: "bg-blue-100 text-blue-700", 
  Tenant: "bg-purple-100 text-purple-700", 
  Vacant: "bg-gray-100 text-gray-500" 
};

const FlatList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: flats = [], loading, summary, summaryLoading } = useSelector((s) => s.flat) ?? {};
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => { 
    dispatch(fetchFlats()); 
    dispatch(fetchFlatSummary()); 
  }, [dispatch]);

  const filtered = useMemo(() =>
    flats.filter((f) => {
      const matchSearch = f.flatNumber.toLowerCase().includes(search.toLowerCase()) || 
                          (f.owner?.name || "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || f.status === statusFilter;
      return matchSearch && matchStatus;
    }), [flats, search, statusFilter]);

  const handleDelete = (id) => { 
    if (window.confirm("Are you sure you want to delete this flat?")) dispatch(deleteFlat(id)); 
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flat Management</h1>
          <p className="text-sm text-gray-500">Inventory of all wings, floors, and residents.</p>
        </div>
        <button onClick={() => navigate("/admin/flat/add")} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-semibold flex items-center gap-2">
          <FiPlus /> Add Flat
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Flats", val: summary?.total, color: "text-gray-800" },
          { label: "Occupied", val: summary?.occupied, color: "text-green-600" },
          { label: "Vacant", val: summary?.vacant, color: "text-gray-500" },
          { label: "Maintenance", val: summary?.underMaintenance, color: "text-yellow-600" },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{summaryLoading ? "..." : (val ?? 0)}</p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input type="text" placeholder="Search by Flat No. or Owner..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
            <option value="All">All Status</option>
            <option value="Occupied">Occupied</option>
            <option value="Vacant">Vacant</option>
            <option value="Under Maintenance">Maintenance</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-widest border-b">
              <tr>
                <th className="px-6 py-4">Flat No</th>
                <th className="px-6 py-4">Floor/Block</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Area (sqft)</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Parking</th>
                <th className="px-6 py-4">Maint. (₹)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => <tr key={i} className="animate-pulse"><td colSpan="9" className="p-6 bg-gray-50/50"></td></tr>)
              ) : filtered.map((f) => (
                <tr key={f._id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{f.flatNumber}</td>
                  <td className="px-6 py-4 text-gray-600">{f.block ? `${f.block} - ` : ""}Floor {f.floor}</td>
                  <td className="px-6 py-4"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[11px] font-bold">{f.type}</span></td>
                  <td className="px-6 py-4 text-gray-600">{f.area || "—"}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{f.owner?.name || "—"}</div>
                    <div className="text-[11px] text-gray-400">{f.owner?.phone || ""}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{f.parkingSlot || "None"}</td>
                  <td className="px-6 py-4 font-semibold">₹{f.monthlyMaintenance?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_STYLE[f.status]}`}>{f.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => navigate(`/admin/flat/edit/${f._id}`)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><FiEdit size={14} /></button>
                      <button onClick={() => handleDelete(f._id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><FiTrash2 size={14} /></button>
                    </div>
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

export default FlatList;