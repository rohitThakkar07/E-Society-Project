import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardSummary, fetchMaintenanceList } from "../../../../store/slices/maintenanceSlice";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
} from "recharts";

const MaintenanceDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { summary, summaryLoading, list } = useSelector((s) => s.maintenance);

  console.log(list);
  useEffect(() => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchMaintenanceList());
  }, [dispatch]);

  // Recent 5 payments from list (Paid ones, sorted newest first)
  const recentPayments = list
    .filter((r) => r.status === "Paid")
    .slice(0, 5);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Maintenance Dashboard</h1>
          <p className="text-gray-500">Overview of maintenance collections</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/maintenance/list")}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm"
          >
            View List
          </button>
          <button
            onClick={() => navigate("/admin/maintenance/add")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            Add Maintenance
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Total Collection</p>
          <h2 className="text-2xl font-bold mt-2 text-green-600">
            {summaryLoading ? "…" : `₹${(summary?.totalCollection || 0).toLocaleString()}`}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Paid This Month</p>
          <h2 className="text-2xl font-bold mt-2 text-blue-600">
            {summaryLoading ? "…" : `₹${(summary?.paidAmount || 0).toLocaleString()}`}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Pending Amount</p>
          <h2 className="text-2xl font-bold mt-2 text-red-600">
            {summaryLoading ? "…" : `₹${(summary?.pendingAmount || 0).toLocaleString()}`}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Total Records</p>
          <h2 className="text-2xl font-bold mt-2">
            {summaryLoading ? "…" : (summary?.totalRecords || 0)}
          </h2>
          <div className="flex gap-2 mt-1">
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
              {summary?.pendingCount || 0} pending
            </span>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              {summary?.overdueCount || 0} overdue
            </span>
          </div>
        </div>

      </div>

      {/* CHART */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Monthly Collection Trend</h2>
        {summary?.monthlyTrend?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={summary.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-sm text-center py-10">No trend data yet.</p>
        )}
      </div>

      {/* RECENT PAYMENTS */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Flat</th>
                <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Month</th>
                <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.length > 0 ? (
                recentPayments.map((r) => (
                  <tr key={r._id} className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/admin/maintenance/${r._id}`)}>
                    <td className="p-3 font-medium">
                      {r.resident?.flatNumber || r.resident?.name || "—"}
                    </td>
                    <td className="p-3">{r.month} {r.year}</td>
                    <td className="p-3">₹{(r.amount + (r.lateFee || 0)).toLocaleString()}</td>
                    <td className="p-3 text-green-600 font-medium">Paid</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-400 text-sm">
                    No payments yet.
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

export default MaintenanceDashboard;