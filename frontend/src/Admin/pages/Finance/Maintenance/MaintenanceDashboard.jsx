import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const MaintenanceDashboard = () => {
    const navigate = useNavigate();
  // Dummy Data (Replace with API later)
  const summary = {
    totalCollection: 250000,
    paidThisMonth: 180000,
    pendingAmount: 70000,
    totalResidents: 120,
  };

  const monthlyData = [
    { month: "Jan", amount: 200000 },
    { month: "Feb", amount: 220000 },
    { month: "Mar", amount: 250000 },
    { month: "Apr", amount: 240000 },
  ];

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
            onClick={() => navigate('/admin/maintenance/list')}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            View List
          </button>

          <button
            onClick={() =>
            {
                console.log("add maintainene")
                 navigate('/admin/maintenance/add')
            }
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
            ₹{summary.totalCollection.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Paid This Month</p>
          <h2 className="text-2xl font-bold mt-2 text-blue-600">
            ₹{summary.paidThisMonth.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Pending Amount</p>
          <h2 className="text-2xl font-bold mt-2 text-red-600">
            ₹{summary.pendingAmount.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Total Residents</p>
          <h2 className="text-2xl font-bold mt-2">
            {summary.totalResidents}
          </h2>
        </div>

      </div>

      {/* CHART SECTION */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Monthly Collection Trend
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* RECENT PAYMENTS */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3">Resident</th>
                <th className="p-3">Month</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">Flat A-101</td>
                <td className="p-3">March</td>
                <td className="p-3">₹2,000</td>
                <td className="p-3 text-green-600 font-medium">Paid</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Flat B-202</td>
                <td className="p-3">March</td>
                <td className="p-3">₹2,000</td>
                <td className="p-3 text-red-600 font-medium">Pending</td>
              </tr>
              <tr>
                <td className="p-3">Flat C-303</td>
                <td className="p-3">March</td>
                <td className="p-3">₹2,000</td>
                <td className="p-3 text-green-600 font-medium">Paid</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default MaintenanceDashboard;