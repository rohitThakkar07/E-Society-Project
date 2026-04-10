import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchReport } from "../../../../store/slices/expenseSlice";
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { 
  FiDownload, FiPieChart, FiList, FiCalendar, 
  FiTrendingDown, FiActivity, FiFilter 
} from "react-icons/fi";

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
const thisYear = new Date().getFullYear();
const YEARS = [thisYear - 1, thisYear, thisYear + 1];

const TABS = [
  { label: "Overview",     path: "/admin/expense/dashboard", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label: "All Expenses", path: "/admin/expense/list",      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Reports",      path: "/admin/expense/report",    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
];

const ExpenseReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const expenseState = useSelector((s) => s.expense) ?? {};
  const { report = null, reportLoading = false } = expenseState;

  const [month, setMonth] = useState(new Date().toLocaleString("default", { month: "long" }));
  const [year, setYear] = useState(String(thisYear));

  useEffect(() => {
    dispatch(fetchReport({ month, year }));
  }, [month, year, dispatch]);

 

  const expenses = report?.expenses ?? [];
  const total = report?.total ?? 0;
  const categorySummary = report?.categorySummary ?? [];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Expense Reports</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Visual breakdown and history of society spending.</p>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-6 w-fit flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${location.pathname === tab.path ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* FILTERS & SUMMARY ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Date Filter Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <FiFilter /> Select Period
          </p>
          <div className="flex gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="flex-1 border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 transition-all"
            >
              {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-24 border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500 transition-all"
            >
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* Total Expense Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-red-50 text-red-600">
            <FiTrendingDown size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Outflow</p>
            <p className="text-2xl font-black text-gray-900">₹{total.toLocaleString()}</p>
          </div>
        </div>

        {/* Record Count Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
            <FiList size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Transaction Count</p>
            <p className="text-2xl font-black text-gray-900">{expenses.length} Records</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <FiPieChart className="text-gray-400" />
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Category Breakdown</h2>
          </div>
          <div className="h-72">
            {reportLoading ? (
              <div className="h-full flex items-center justify-center animate-pulse text-gray-400 text-sm">Loading Chart...</div>
            ) : categorySummary.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categorySummary} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={5}>
                    {categorySummary.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(v) => `₹${v.toLocaleString()}`} 
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">No data available for this period.</div>
            )}
          </div>
        </div>

        {/* CATEGORY SUMMARY TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50">
             <h2 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Distribution Details</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categorySummary.map((c, i) => (
                  <tr key={c.name} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3.5 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="font-semibold text-gray-700">{c.name}</span>
                    </td>
                    <td className="px-6 py-3.5 text-right text-red-600 font-bold">
                      ₹{c.value.toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold">
                        {total > 0 ? ((c.value / total) * 100).toFixed(1) : 0}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FULL EXPENSE LIST */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Detailed Log</h2>
          <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">{month} {year}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b">
              <tr>
                <th className="px-6 py-4">Expense Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Transaction Date</th>
                <th className="px-6 py-4">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reportLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="p-8 bg-gray-50/20"></td>
                  </tr>
                ))
              ) : expenses.length > 0 ? (
                expenses.map((e) => (
                  <tr key={e._id} className="hover:bg-red-50/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{e.title}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{e.category}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-red-600 font-bold">
                      ₹{e.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-gray-300" size={14} />
                        {new Date(e.date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-xs font-medium">{e.paymentMode}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">No expenditures recorded for this period.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseReport;
