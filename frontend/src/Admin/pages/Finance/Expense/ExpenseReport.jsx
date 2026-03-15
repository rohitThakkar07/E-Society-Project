import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ExpenseReport = () => {
  const [month, setMonth] = useState("March");
  const [year, setYear] = useState("2026");

  // Dummy Data (Replace with API later)
  const expenses = [
    { id: 1, title: "Lift Repair", category: "Maintenance", amount: 15000, month: "March", year: "2026" },
    { id: 2, title: "Electric Bill", category: "Electricity", amount: 25000, month: "March", year: "2026" },
    { id: 3, title: "Security Salary", category: "Salary", amount: 35000, month: "March", year: "2026" },
    { id: 4, title: "Water Bill", category: "Water", amount: 12000, month: "February", year: "2026" },
  ];

  // Filter Data
  const filteredExpenses = useMemo(() => {
    return expenses.filter(
      (expense) =>
        expense.month === month && expense.year === year
    );
  }, [month, year]);

  // Total Calculation
  const totalExpense = filteredExpenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // Category Summary
  const categorySummary = useMemo(() => {
    const summary = {};
    filteredExpenses.forEach((expense) => {
      if (!summary[expense.category]) {
        summary[expense.category] = 0;
      }
      summary[expense.category] += expense.amount;
    });

    return Object.keys(summary).map((key) => ({
      name: key,
      value: summary[key],
    }));
  }, [filteredExpenses]);

  const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b"];

  // CSV Export
  const exportCSV = () => {
    const headers = ["Title", "Category", "Amount"];
    const rows = filteredExpenses.map((expense) => [
      expense.title,
      expense.category,
      expense.amount,
    ]);

    const csvContent =
      [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Expense_Report_${month}_${year}.csv`;
    link.click();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Expense Report</h1>
          <p className="text-gray-500">Generate monthly expense report</p>
        </div>

        <button
          onClick={exportCSV}
          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Export CSV
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option>January</option>
          <option>February</option>
          <option>March</option>
          <option>April</option>
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option>2025</option>
          <option>2026</option>
        </select>
      </div>

      {/* TOTAL CARD */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <p className="text-gray-500 text-sm">Total Expense</p>
        <h2 className="text-2xl font-bold text-red-600 mt-2">
          ₹{totalExpense.toLocaleString()}
        </h2>
      </div>

      {/* PIE CHART */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Category Breakdown
        </h2>

        {categorySummary.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categorySummary}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {categorySummary.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No data for selected month.</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseReport;