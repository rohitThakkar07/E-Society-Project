import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// ✅ Ensure path is correct (maintenance spelled correctly)
import {
  fetchMaintenanceList,
  deleteMaintenance,
} from "../../../../store/slices/maintenanceSlice";

const STATUS_STYLE = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Overdue: "bg-red-100 text-red-600",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MaintenanceList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const maintenanceState = useSelector((s) => s.maintenance || {});
  const maintenanceData = maintenanceState.list || maintenanceState.records || [];
  const loading = maintenanceState.loading;


  console.log(maintenanceState);
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchMaintenanceList());
  }, [dispatch]);

  // ✅ RELATIONSHIP-AWARE FILTER
  const filtered = useMemo(() => {
  return (maintenanceData || []).filter((item) => {
    // Combine all searchable terms into one string
    const wing = item.flat?.wing || item.resident?.wing || "";
    const flatNo = item.flat?.flatNumber || item.resident?.flatNumber || "";
    const firstName = item.resident?.firstName || "";
    const lastName = item.resident?.lastName || "";
    
    const searchSource = `${wing} ${flatNo} ${firstName} ${lastName}`.toLowerCase();
    const matchSearch = searchSource.includes(search.toLowerCase());

    const matchMonth = monthFilter === "All" || item.month === monthFilter;
    const matchStatus = statusFilter === "All" || item.status === statusFilter;

    return matchSearch && matchMonth && matchStatus;
  });
}, [maintenanceData, search, monthFilter, statusFilter]);


  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this maintenance record?")) {
      dispatch(deleteMaintenance(id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Records</h1>
          <p className="text-sm text-gray-500">Manage invoices and track society collections</p>
        </div>
        <button
          onClick={() => navigate("/admin/maintenance/add")}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 shadow-md transition-all text-sm font-semibold self-start"
        >
          + Create Bill
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by Flat or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="All">All Months</option>
          {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>

        {(search || monthFilter !== "All" || statusFilter !== "All") && (
          <button
            onClick={() => { setSearch(""); setMonthFilter("All"); setStatusFilter("All"); }}
            className="text-xs font-bold text-red-500 hover:underline px-2"
          >
            Clear All
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">#</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Flat & Wing</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Resident</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Due Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="7" className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-full" /></td>
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((item, index) => (
                  <tr key={item._id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-6 py-4 text-xs text-gray-400">{index + 1}</td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {/* Try to get from populated flat object, then fallback to resident's denormalized fields */}
                        {item.flat?.wing || item.resident?.wing || "—"}
                        -
                        {item.flat?.flatNumber || item.resident?.flatNumber || "—"}
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase font-medium">
                        {item.flat?.type || "Flat"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-gray-700 font-medium">
                        {item.resident?.firstName} {item.resident?.lastName}
                      </div>
                      <div className="text-xs text-gray-400">{item.resident?.mobileNumber}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">₹{(item.amount + (item.lateFee || 0)).toLocaleString()}</div>
                      <div className="text-[10px] text-gray-400">{item.month} {item.year}</div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {item.dueDate ? new Date(item.dueDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) : "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[item.status] || "bg-gray-100"}`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/maintenance/${item._id}`)}
                          className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/admin/maintenance/${item._id}/invoice`)}
                          className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                          title="Generate Invoice"
                        >
                          Invoice
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center text-gray-400">
                    <p className="text-lg font-medium">No records found</p>
                    <p className="text-sm">Try adjusting your filters or search terms.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Showing {filtered.length} of {maintenanceData.length} total records
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceList;