import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardSummary } from "../../../../store/slices/expenseSlice";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import { 
  FiPlus, FiList, FiFileText, FiTrendingDown, 
  FiPieChart, FiActivity, FiArrowRight 
} from "react-icons/fi";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

const ExpenseDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const expenseState = useSelector((s) => s.expense) ?? {};
  const { summary = null, summaryLoading = false } = expenseState;

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  const formatAmount = (v) => `₹${(v ?? 0).toLocaleString()}`;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Financial Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of society expenditures and outflow trends.</p>
        </div>
      </div>

      {/* QUICK ACTIONS - Updated to matching button style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Add Expense", path: "/admin/expense/add", icon: <FiPlus />, color: "bg-blue-600 hover:bg-blue-700" },
          { label: "Expense List", path: "/admin/expense/list", icon: <FiList />, color: "bg-emerald-600 hover:bg-emerald-700" },
          { label: "View Reports", path: "/admin/expense/report", icon: <FiFileText />, color: "bg-indigo-600 hover:bg-indigo-700" },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={() => navigate(btn.path)}
            className={`${btn.color} text-white p-4 rounded-2xl shadow-lg shadow-gray-200 transition-all flex items-center justify-center gap-3 font-bold text-sm active:scale-95`}
          >
            {btn.icon} {btn.label}
          </button>
        ))}
      </div>

      {/* SUMMARY CARDS - Matching Flat Management style */}
      <div className="grid gap-6 sm:grid-cols-2 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
          <div className="p-4 rounded-xl bg-red-50 text-red-600">
             <FiTrendingDown size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Monthly Outflow</p>
            <h2 className="text-3xl font-black text-gray-900">
              {summaryLoading ? "…" : formatAmount(summary?.monthlyExpense)}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
          <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
             <FiActivity size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Annual Total</p>
            <h2 className="text-3xl font-black text-gray-900">
              {summaryLoading ? "…" : formatAmount(summary?.yearlyExpense)}
            </h2>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid gap-6 lg:grid-cols-2 mt-8">
        {/* PIE CHART */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiPieChart className="text-gray-400" />
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Spending by Category</h2>
          </div>
          <div className="h-72">
            {summaryLoading ? (
              <div className="h-full flex items-center justify-center animate-pulse text-gray-400 text-sm">Loading Visuals...</div>
            ) : (summary?.categoryData?.length ?? 0) > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={summary.categoryData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={5}>
                    {summary.categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(v) => formatAmount(v)} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">No data logged.</div>
            )}
          </div>
        </div>

        {/* LINE CHART */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FiActivity className="text-gray-400" />
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Spending Trends</h2>
          </div>
          <div className="h-72">
            {summaryLoading ? (
              <div className="h-full flex items-center justify-center animate-pulse text-gray-400 text-sm">Loading Trends...</div>
            ) : (summary?.monthlyTrend?.length ?? 0) > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(v) => formatAmount(v)} 
                  />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={4} dot={{ r: 6, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">Trend data unavailable.</div>
            )}
          </div>
        </div>
      </div>

      {/* RECENT EXPENSES TABLE */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Recent Transactions</h2>
          <button onClick={() => navigate("/admin/expense/list")} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
            See All <FiArrowRight />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b">
              <tr>
                <th className="px-6 py-4">Expense Item</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(summary?.recentExpenses ?? []).length > 0 ? (
                summary.recentExpenses.map((e) => (
                  <tr 
                    key={e._id} 
                    className="hover:bg-red-50/20 cursor-pointer transition-colors"
                    onClick={() => navigate(`/admin/expense/list`)}
                  >
                    <td className="px-6 py-4 font-bold text-gray-900">{e.title}</td>
                    <td className="px-6 py-4">
                       <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                         {e.category}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-red-600 font-bold">{formatAmount(e.amount)}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {e.date ? new Date(e.date).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      }) : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic">No recent transactions.</td>
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