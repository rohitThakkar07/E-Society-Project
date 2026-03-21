import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMaintenanceList, deleteMaintenance } from "../../../../store/slices/maintenanceSlice";

const STATUS_STYLE = {
  Paid:    "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Overdue: "bg-red-100 text-red-600",
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const MaintenanceList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list: maintenanceData, loading } = useSelector((s) => s.maintenance);

  const [search,      setSearch]      = useState("");
  const [monthFilter, setMonthFilter] = useState("All");
  const [statusFilter,setStatusFilter]= useState("All");

  useEffect(() => {
    dispatch(fetchMaintenanceList());
  }, [dispatch]);

  const filtered = useMemo(() =>
    maintenanceData.filter((item) => {
      // resident is populated { flatNumber, name }
      const flat = item.resident?.flatNumber || item.resident?.name || "";
      const matchSearch = flat.toLowerCase().includes(search.toLowerCase());
      const matchMonth  = monthFilter  === "All" || item.month  === monthFilter;
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      return matchSearch && matchMonth && matchStatus;
    }),
  [maintenanceData, search, monthFilter, statusFilter]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this maintenance record?")) {
      dispatch(deleteMaintenance(id));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance List</h1>
          <p className="text-sm text-gray-500">Track and manage payments</p>
        </div>
        <button
          onClick={() => navigate("/admin/maintenance/add")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium self-start"
        >
          + Add Maintenance
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by flat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm w-full sm:w-52 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Months</option>
          {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>
        {(search || monthFilter !== "All" || statusFilter !== "All") && (
          <button
            onClick={() => { setSearch(""); setMonthFilter("All"); setStatusFilter("All"); }}
            className="text-xs text-red-500 border border-red-100 bg-red-50 px-3 py-2 rounded-lg"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Flat</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Month / Year</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-gray-400 text-xs">{index + 1}</td>
                  {/* resident is populated object */}
                  <td className="px-5 py-4 font-medium text-gray-800">
                    {item.resident?.flatNumber || item.resident?.name || "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{item.month} {item.year}</td>
                  <td className="px-5 py-4 text-gray-700 font-medium">
                    ₹{(item.amount + (item.lateFee || 0)).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {item.dueDate ? new Date(item.dueDate).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                    }) : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[item.status] || "bg-gray-100 text-gray-500"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`/admin/maintenance/${item._id}`)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/admin/maintenance/${item._id}/invoice`)}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Invoice
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-5 py-12 text-center text-gray-400 text-sm">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {maintenanceData.length} records
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceList;