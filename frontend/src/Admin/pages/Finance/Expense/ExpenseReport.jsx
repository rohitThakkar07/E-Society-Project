import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReport } from "../../../../store/slices/expenseSlice";
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const COLORS  = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6"];
const MONTHS  = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];
const thisYear = new Date().getFullYear();
const YEARS    = [thisYear - 1, thisYear, thisYear + 1];

const ExpenseReport = () => {
  const dispatch = useDispatch();

  const expenseState = useSelector((s) => s.expense) ?? {};
  const { report = null, reportLoading = false } = expenseState;

  const [month, setMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [year, setYear] = useState(String(thisYear));

  // Fetch whenever month or year changes
  useEffect(() => {
    dispatch(fetchReport({ month, year }));
  }, [month, year, dispatch]);

  // CSV export — uses real API data
  const exportCSV = () => {
    if (!report?.expenses?.length) return;
    const headers = ["Title", "Category", "Amount", "Date", "Payment Mode"];
    const rows = report.expenses.map((e) => [
      e.title,
      e.category,
      e.amount,
      e.date ? new Date(e.date).toLocaleDateString("en-IN") : "",
      e.paymentMode,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Expense_Report_${month}_${year}.csv`;
    link.click();
  };

  const expenses        = report?.expenses        ?? [];
  const total           = report?.total           ?? 0;
  const categorySummary = report?.categorySummary ?? [];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Report</h1>
          <p className="text-sm text-gray-500">Generate and export monthly expense report</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={expenses.length === 0}
          className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-3 items-center">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-400"
        >
          {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border border-gray-200 px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-400"
        >
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        {reportLoading && (
          <span className="text-sm text-gray-400 flex items-center gap-1.5">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading...
          </span>
        )}
      </div>

      {/* TOTAL CARD */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <p className="text-sm text-gray-500">Total Expense — {month} {year}</p>
        <h2 className="text-2xl font-bold text-red-600 mt-1">
          ₹{total.toLocaleString()}
        </h2>
        <p className="text-xs text-gray-400 mt-1">{expenses.length} record(s)</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* PIE CHART — Category breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
          {reportLoading ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Loading...</div>
          ) : categorySummary.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categorySummary} dataKey="value" nameKey="name" outerRadius={100} label>
                  {categorySummary.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-10">No data for {month} {year}.</p>
          )}
        </div>

        {/* CATEGORY SUMMARY TABLE */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Category Summary</h2>
          {categorySummary.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase text-left">Category</th>
                  <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase text-right">Amount</th>
                  <th className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase text-right">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categorySummary.map((c, i) => (
                  <tr key={c.name}>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-right text-red-600 font-medium">
                      ₹{c.value.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-400 text-xs">
                      {total > 0 ? ((c.value / total) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-sm text-center py-10">No data for {month} {year}.</p>
          )}
        </div>
      </div>

      {/* FULL EXPENSE TABLE */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            All Expenses — {month} {year}
          </h2>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mode</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reportLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[...Array(5)].map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : expenses.length > 0 ? (
              expenses.map((e) => (
                <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-800">{e.title}</td>
                  <td className="px-5 py-3 text-gray-600">{e.category}</td>
                  <td className="px-5 py-3 text-red-600 font-semibold">
                    ₹{(e.amount ?? 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {e.date ? new Date(e.date).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric",
                    }) : "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{e.paymentMode}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-5 py-10 text-center text-gray-400 text-sm">
                  No expenses for {month} {year}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ExpenseReport;