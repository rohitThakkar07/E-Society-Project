import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMaintenanceList ,fetchDashboardSummary} from "../../../../store/slices/maintainenceSlice";

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
} from "recharts";

const MaintenanceDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { summary, summaryLoading, list } = useSelector((s) => s.maintenance);
  
  useEffect(() => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchMaintenanceList());
  }, [dispatch]);

  // Summary mapping from your backend logic
  const stats = [
    { label: "Total Collection", val: `₹${(summary?.totalCollected || 0).toLocaleString()}`, color: "text-green-600" },
    { label: "Total Pending", val: `₹${(summary?.totalPending || 0).toLocaleString()}`, color: "text-red-600" },
    { label: "Overdue Amount", val: `₹${(summary?.totalOverdue || 0).toLocaleString()}`, color: "text-orange-600" },
    { label: "Total Bills", val: summary?.total || 0, color: "text-gray-800" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{s.label}</p>
            <h2 className={`text-2xl font-bold mt-2 ${s.color}`}>{summaryLoading ? "..." : s.val}</h2>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-6">Revenue Trend (Monthly)</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={summary?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="collected" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb" }} />
              <Line type="monotone" dataKey="pending" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default MaintenanceDashboard;