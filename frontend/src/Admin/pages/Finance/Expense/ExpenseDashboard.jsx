import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardSummary } from "../../../../store/slices/expenseSlice";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

const ExpenseDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Safe selector fallback — won't crash if reducer not in store yet
  const expenseState    = useSelector((s) => s.expense) ?? {};
  const { summary = null, summaryLoading = false } = expenseState;

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  const formatAmount = (v) => `₹${(v ?? 0).toLocaleString()}`;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Dashboard</h1>
          <p className="text-sm text-gray-500">Track and monitor society expenses</p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => navigate("/admin/expense/add")}
          className="bg-blue-600 text-white p-4 rounded-xl shadow hover:bg-blue-700 transition text-sm font-medium"
        >
          + Add Expense
        </button>
        <button
          onClick={() => navigate("/admin/expense/list")}
          className="bg-green-600 text-white p-4 rounded-xl shadow hover:bg-green-700 transition text-sm font-medium"
        >
          Expense List
        </button>
        <button
          onClick={() => navigate("/admin/expense/report")}
          className="bg-purple-600 text-white p-4 rounded-xl shadow hover:bg-purple-700 transition text-sm font-medium"
        >
          Expense Report
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Monthly Expense</p>
          <h2 className="text-2xl font-bold mt-2 text-red-600">
            {summaryLoading ? "…" : formatAmount(summary?.monthlyExpense)}
          </h2>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Yearly Expense</p>
          <h2 className="text-2xl font-bold mt-2 text-blue-600">
            {summaryLoading ? "…" : formatAmount(summary?.yearlyExpense)}
          </h2>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-2 mt-8">

        {/* PIE — Category breakdown */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Expense by Category</h2>
          {summaryLoading ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Loading...</div>
          ) : (summary?.categoryData?.length ?? 0) > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={summary.categoryData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {summary.categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatAmount(v)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-10">No data for this month.</p>
          )}
        </div>

        {/* LINE — Monthly trend */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Expense Trend</h2>
          {summaryLoading ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Loading...</div>
          ) : (summary?.monthlyTrend?.length ?? 0) > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={summary.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => formatAmount(v)} />
                <Legend />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-10">No trend data yet.</p>
          )}
        </div>

      </div>

      {/* RECENT EXPENSES */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Expenses</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {(summary?.recentExpenses ?? []).length > 0 ? (
                summary.recentExpenses.map((e) => (
                  <tr key={e._id} className="border-b hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => navigate(`/admin/expense/${e._id}`)}>
                    <td className="px-4 py-3 font-medium text-gray-800">{e.title}</td>
                    <td className="px-4 py-3 text-gray-600">{e.category}</td>
                    <td className="px-4 py-3 text-red-600 font-medium">{formatAmount(e.amount)}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {e.date ? new Date(e.date).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      }) : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-400 text-sm">
                    No expenses yet.
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

export default ExpenseDashboard;