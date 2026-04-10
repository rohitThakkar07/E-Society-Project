import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlats, fetchFlatSummary, deleteFlat } from "../../../store/slices/flatSlice";

const STATUS_STYLE = { Occupied: "bg-green-100 text-green-700", Vacant: "bg-gray-100 text-gray-500", "Under Maintenance": "bg-yellow-100 text-yellow-700" };
const OCC_STYLE    = { Owner: "bg-blue-100 text-blue-700", Tenant: "bg-purple-100 text-purple-700", Vacant: "bg-gray-100 text-gray-500" };

const FlatList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: flats, loading, summary, summaryLoading } = useSelector((s) => s.flat) ?? {};
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => { dispatch(fetchFlats()); dispatch(fetchFlatSummary()); }, [dispatch]);

  const filtered = useMemo(() =>
    
    (flats || []).filter((f) => {
      const matchSearch = f.flatNumber.toLowerCase().includes(search.toLowerCase()) || (f.owner?.name || "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || f.status === statusFilter;
      const matchType   = typeFilter   === "All" || f.type   === typeFilter;
      return matchSearch && matchStatus && matchType;
    }), [flats, search, statusFilter, typeFilter]);

  const handleDelete = (id) => { if (window.confirm("Delete this flat?")) dispatch(deleteFlat(id)); };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Flat Management</h1><p className="text-sm text-gray-500">Manage all flats and occupancy</p></div>
        <button onClick={() => navigate("/admin/flat/add")} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium self-start">+ Add Flat</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Flats", val: summaryLoading ? "…" : (summary?.total ?? 0), color: "text-gray-800" },
          { label: "Occupied",    val: summaryLoading ? "…" : (summary?.occupied ?? 0), color: "text-green-600" },
          { label: "Vacant",      val: summaryLoading ? "…" : (summary?.vacant ?? 0), color: "text-gray-500" },
          { label: "Maintenance", val: summaryLoading ? "…" : (summary?.underMaintenance ?? 0), color: "text-yellow-600" },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3">
        <input type="text" placeholder="Search by flat no. or owner..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm w-full sm:w-52 outline-none focus:ring-2 focus:ring-blue-500" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
          <option value="All">All Status</option>
          {["Occupied","Vacant","Under Maintenance"].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
          <option value="All">All Types</option>
          {["1BHK","2BHK","3BHK","4BHK","Studio","Penthouse"].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["#","Flat No.","Block/Floor","Type","Owner","Occupancy","Status","Actions"].map(h => <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(4)].map((_, i) => <tr key={i} className="animate-pulse">{[...Array(8)].map((_, j) => <td key={j} className="px-5 py-4"><div className="h-3 bg-gray-100 rounded w-3/4"/></td>)}</tr>)
            ) : filtered.length > 0 ? (
              filtered.map((f, idx) => (
                <tr key={f._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-gray-400 text-xs">{idx + 1}</td>
                  <td className="px-5 py-4 font-semibold text-gray-900">{f.flatNumber}</td>
                  <td className="px-5 py-4 text-gray-600">{[f.block, `Floor ${f.floor}`].filter(Boolean).join(", ")}</td>
                  <td className="px-5 py-4 text-gray-600">{f.type}</td>
                  <td className="px-5 py-4 text-gray-600">{f.owner?.name || "—"}</td>
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${OCC_STYLE[f.occupancyType]}`}>{f.occupancyType}</span></td>
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[f.status]}`}>{f.status}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-3">
                      <button onClick={() => navigate(`/admin/flat/${f._id}`)} className="text-blue-600 hover:underline text-sm">View</button>
                      <button onClick={() => navigate(`/admin/flat/edit/${f._id}`)} className="text-yellow-600 hover:underline text-sm">Edit</button>
                      <button onClick={() => handleDelete(f._id)} className="text-red-500 hover:underline text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" className="px-5 py-12 text-center text-gray-400 text-sm">No flats found</td></tr>
            )}
          </tbody>
        </table>
        {!loading && filtered.length > 0 && <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">Showing {filtered.length} of {(flats||[]).length} flats</div>}
      </div>
    </div>
  );
};

export default FlatList;