import React from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const ExpenseDashboard = () => {
  const navigate = useNavigate();

  const summary = {
    monthlyExpense: 180000,
    yearlyExpense: 2100000,
  };

  const categoryData = [
    { name: "Electricity", value: 50000 },
    { name: "Water", value: 20000 },
    { name: "Security Salary", value: 70000 },
    { name: "Maintenance Work", value: 40000 },
  ];

  const monthlyTrend = [
    { month: "Jan", expense: 150000 },
    { month: "Feb", expense: 170000 },
    { month: "Mar", expense: 180000 },
    { month: "Apr", expense: 160000 },
  ];

  const recentExpenses = [
    { title: "Lift Repair", category: "Maintenance", amount: 15000, date: "05-03-2026" },
    { title: "Electric Bill", category: "Electricity", amount: 25000, date: "02-03-2026" },
    { title: "Security Salary", category: "Salary", amount: 35000, date: "01-03-2026" },
  ];

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Expense Dashboard</h1>
        <p className="text-gray-500">Track and monitor society expenses</p>
      </div>

      {/* ✅ QUICK ACTION BUTTONS */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => navigate("/expense/add")}
          className="bg-blue-600 text-white p-4 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Add Expense
        </button>

        <button
          onClick={() => navigate("/expense/list")}
          className="bg-green-600 text-white p-4 rounded-lg shadow hover:bg-green-700 transition"
        >
          Expense List
        </button>

        <button
          onClick={() => navigate("/expense/report")}
          className="bg-purple-600 text-white p-4 rounded-lg shadow hover:bg-purple-700 transition"
        >
          Expense Report
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Total Monthly Expense</p>
          <h2 className="text-2xl font-bold mt-2 text-red-600">
            ₹{summary.monthlyExpense.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Total Yearly Expense</p>
          <h2 className="text-2xl font-bold mt-2 text-blue-600">
            ₹{summary.yearlyExpense.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="grid gap-6 lg:grid-cols-2 mt-8">

        {/* PIE CHART */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Expense by Category
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Monthly Expense Trend
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="expense" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT EXPENSES */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Expenses</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {recentExpenses.map((expense, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{expense.title}</td>
                  <td className="p-3">{expense.category}</td>
                  <td className="p-3 text-red-600 font-medium">
                    ₹{expense.amount.toLocaleString()}
                  </td>
                  <td className="p-3">{expense.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ExpenseDashboard;