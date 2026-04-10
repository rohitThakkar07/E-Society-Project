import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMaintenanceList,
  deleteMaintenance,
} from "../../../../store/slices/maintainenceSlice";

const STATUS_STYLE = {
  Paid: "bg-green-100 text-green-700",
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

  // ✅ FIXED: correct key from slice
  const { list: maintenanceData = [] } = useSelector(
    (s) => s.maintenance || {}
  );

  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchMaintenanceList());
  }, [dispatch]);

  // ✅ SAFE FILTER
  const filtered = useMemo(() => {
    return (maintenanceData || []).filter((item) => {
      const flat =
        item?.resident?.flatNumber ||
        item?.resident?.name ||
        "";

      const matchSearch = flat
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchMonth =
        monthFilter === "All" || item.month === monthFilter;

      const matchStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchSearch && matchMonth && matchStatus;
    });
  }, [maintenanceData, search, monthFilter, statusFilter]);

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
          <h1 className="text-2xl font-bold text-gray-900">
            Maintenance List
          </h1>
          <p className="text-sm text-gray-500">
            Track and manage payments
          </p>
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
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
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
            onClick={() => {
              setSearch("");
              setMonthFilter("All");
              setStatusFilter("All");
            }}
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
              <th className="px-5 py-3 text-xs">#</th>
              <th className="px-5 py-3 text-xs">Flat</th>
              <th className="px-5 py-3 text-xs">Month / Year</th>
              <th className="px-5 py-3 text-xs">Amount</th>
              <th className="px-5 py-3 text-xs">Due Date</th>
              <th className="px-5 py-3 text-xs">Status</th>
              <th className="px-5 py-3 text-xs text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {filtered.length > 0 ? (
              filtered.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-xs text-gray-400">
                    {index + 1}
                  </td>

                  <td className="px-5 py-4 font-medium">
                    {item?.resident?.flatNumber || "—"}
                  </td>

                  <td className="px-5 py-4">
                    {item.month} {item.year}
                  </td>

                  <td className="px-5 py-4 font-medium">
                    ₹{(item.amount + (item.lateFee || 0)).toLocaleString()}
                  </td>

                  <td className="px-5 py-4">
                    {item.dueDate
                      ? new Date(item.dueDate).toLocaleDateString("en-IN")
                      : "—"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        STATUS_STYLE[item.status] || "bg-gray-100"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() =>
                          navigate(`/admin/maintenance/${item._id}`)
                        }
                        className="text-blue-600 text-sm"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/admin/maintenance/${item._id}/invoice`)
                        }
                        className="text-green-600 text-sm"
                      >
                        Invoice
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-5 py-12 text-center text-gray-400"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* FOOTER */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t text-xs text-gray-400">
            Showing {filtered.length} of {maintenanceData.length} records
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceList;