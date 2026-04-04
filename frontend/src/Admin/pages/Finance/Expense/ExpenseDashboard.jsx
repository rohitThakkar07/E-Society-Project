import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardSummary } from "../../../../store/slices/expenseSlice";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

/* ── Sub-nav tabs ─────────────────────────────────────────────────────────── */
const TABS = [
  { label: "Overview",     path: "/admin/expense/dashboard", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label: "All Expenses", path: "/admin/expense/list",      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Add Expense",  path: "/admin/expense/add",       icon: "M12 4v16m8-8H4" },
  { label: "Reports",      path: "/admin/expense/report",    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
];

const SubNav = ({ navigate, location }) => (
  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-6 w-fit flex-wrap">
    {TABS.map((tab) => {
      const active = location.pathname === tab.path;
      return (
        <button
          key={tab.path}
          onClick={() => navigate(tab.path)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            active ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          }`}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
          </svg>
          {tab.label}
        </button>
      );
    })}
  </div>
);

/* ── Main Component ───────────────────────────────────────────────────────── */
const ExpenseDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const expenseState = useSelector((s) => s.expense) ?? {};
  const { summary = null, summaryLoading = false } = expenseState;

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  const fmt = (v) => `₹${(v ?? 0).toLocaleString()}`;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Expense</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Overview of society expenditures and outflow trends.</p>
        </div>
        <button onClick={() => navigate("/admin/expense/add")} className="admin-btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Expense
        </button>
      </div>

      {/* Sub Navigation */}
      <SubNav navigate={navigate} location={location} />

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Monthly Outflow</p>
            <p className="text-2xl font-black text-slate-900">{summaryLoading ? "…" : fmt(summary?.monthlyExpense)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Annual Total</p>
            <p className="text-2xl font-black text-slate-900">{summaryLoading ? "…" : fmt(summary?.yearlyExpense)}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-5 lg:grid-cols-2 mb-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-sm font-bold text-slate-800 mb-1">Spending by Category</p>
          <p className="text-[11px] text-slate-400 mb-4">Distribution of expenses</p>
          <div className="h-64">
            {summaryLoading ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm animate-pulse">Loading…</div>
            ) : (summary?.categoryData?.length ?? 0) > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={summary.categoryData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={5}>
                    {summary.categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                    formatter={(v) => fmt(v)}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data logged.</div>
            )}
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-sm font-bold text-slate-800 mb-1">Spending Trends</p>
          <p className="text-[11px] text-slate-400 mb-4">Monthly expense pattern</p>
          <div className="h-64">
            {summaryLoading ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm animate-pulse">Loading…</div>
            ) : (summary?.monthlyTrend?.length ?? 0) > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} dy={10} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                    formatter={(v) => fmt(v)}
                  />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={{ r: 5, fill: "#ef4444", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">Trend data unavailable.</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center">
          <p className="text-sm font-bold text-slate-800">Recent Transactions</p>
          <button onClick={() => navigate("/admin/expense/list")} className="text-xs font-bold text-blue-600 hover:underline">See All →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Expense Item</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(summary?.recentExpenses ?? []).length > 0 ? (
                summary.recentExpenses.map((e) => (
                  <tr key={e._id} className="cursor-pointer" onClick={() => navigate("/admin/expense/list")}>
                    <td className="font-semibold text-slate-900">{e.title}</td>
                    <td><span className="admin-badge admin-badge-gray">{e.category}</span></td>
                    <td className="text-red-600 font-bold">{fmt(e.amount)}</td>
                    <td className="text-slate-400 text-xs">{e.date ? new Date(e.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-slate-400 py-10 italic">No recent transactions.</td>
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