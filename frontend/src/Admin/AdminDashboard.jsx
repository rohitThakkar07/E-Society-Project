import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";

import { fetchStaffSummary } from "../store/slices/staffSlice";
import { fetchDashboardSummary as fetchMaintenanceSummary } from "../store/slices/maintainenceSlice";

// ── helper 
const Card = ({ label, value, color = "text-gray-800", onClick, sub }) => (
  <div
    onClick={onClick}
    className={`bg-white p-5 rounded-xl shadow hover:shadow-lg transition ${onClick ? "cursor-pointer" : ""}`}
  >
    <p className="text-gray-500 text-sm">{label}</p>
    <h2 className={`text-2xl font-bold mt-2 ${color}`}>{value}</h2>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const fmt = (n) => (n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—");

// ── component ────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  // ── selectors ──────────────────────────────────────────────────────────────
  const staffSummary      = useSelector((s) => s.staff?.summary);
  const staffLoading      = useSelector((s) => s.staff?.summaryLoading);

  const maintenanceSummary = useSelector((s) => s.maintenance?.summary);
  const maintenanceLoading = useSelector((s) => s.maintenance?.summaryLoading);

  // ── fetch on mount ─────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchStaffSummary());
    dispatch(fetchMaintenanceSummary());
  }, [dispatch]);

  // ── derived values ─────────────────────────────────────────────────────────
  const val = (v, loading) => (loading ? "…" : (v ?? 0));

  // Chart: maintenance monthly collection vs expenses
  // maintenanceSummary.monthlyData should be [{month, collected, expenses}]
  // Fall back to empty array so the chart renders without crashing
  const chartData = maintenanceSummary?.monthlyData ?? [];

  // Role breakdown for staff mini-chart
  const roleData = staffSummary?.byRole
    ? Object.entries(staffSummary.byRole).map(([role, count]) => ({ role, count }))
    : [];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1">
        <main className="p-6">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Society Overview & Analytics</p>
          </div>

          {/* ── STAFF CARDS ─────────────────────────────────────────────────── */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Staff
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card
              label="Total Staff"
              value={val(staffSummary?.total, staffLoading)}
              onClick={() => navigate("/admin/staff/list")}
            />
            <Card
              label="Active"
              value={val(staffSummary?.active, staffLoading)}
              color="text-green-600"
              onClick={() => navigate("/admin/staff/list")}
            />
            <Card
              label="On Leave"
              value={val(staffSummary?.onLeave, staffLoading)}
              color="text-yellow-600"
              onClick={() => navigate("/admin/staff/list")}
            />
            <Card
              label="Inactive"
              value={val(staffSummary?.inactive, staffLoading)}
              color="text-red-600"
              onClick={() => navigate("/admin/staff/list")}
            />
          </div>

          {/* ── MAINTENANCE / FINANCE CARDS ──────────────────────────────────── */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Finance
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card
              label="Total Records"
              value={val(maintenanceSummary?.total, maintenanceLoading)}
              onClick={() => navigate("/admin/maintenance/list")}
            />
            <Card
              label="Paid"
              value={val(maintenanceSummary?.paid, maintenanceLoading)}
              color="text-green-600"
              sub={maintenanceSummary?.totalCollected ? fmt(maintenanceSummary.totalCollected) : undefined}
              onClick={() => navigate("/admin/maintenance/list")}
            />
            <Card
              label="Pending"
              value={val(maintenanceSummary?.pending, maintenanceLoading)}
              color="text-yellow-600"
              sub={maintenanceSummary?.totalPending ? fmt(maintenanceSummary.totalPending) : undefined}
              onClick={() => navigate("/admin/maintenance/list")}
            />
            <Card
              label="Overdue"
              value={val(maintenanceSummary?.overdue, maintenanceLoading)}
              color="text-red-600"
              onClick={() => navigate("/admin/maintenance/list")}
            />
          </div>

          {/* ── CHARTS ROW ───────────────────────────────────────────────────── */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Monthly collection chart */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-base font-semibold text-gray-800 mb-4">
                Monthly Collection
              </h2>
              {maintenanceLoading ? (
                <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                  Loading…
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#34D399" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.6} />
                      </linearGradient>
                      <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#FBBF24" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                    <XAxis dataKey="month" tick={{ fill: "#374151", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#374151", fontSize: 12 }} />
                    <Tooltip formatter={(v) => fmt(v)} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                    <Legend verticalAlign="top" height={32} />
                    <Bar dataKey="collected" name="Collected" fill="url(#colorPaid)"    barSize={32} radius={[6,6,0,0]} />
                    <Bar dataKey="pending"   name="Pending"   fill="url(#colorPending)" barSize={32} radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                  No monthly data available
                </div>
              )}
            </div>

            {/* Staff by role chart */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-base font-semibold text-gray-800 mb-4">
                Staff by Role
              </h2>
              {staffLoading ? (
                <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                  Loading…
                </div>
              ) : roleData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={roleData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#374151", fontSize: 12 }} allowDecimals={false} />
                    <YAxis type="category" dataKey="role" width={90} tick={{ fill: "#374151", fontSize: 11 }} />
                    <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                    <Bar dataKey="count" name="Staff" fill="#60A5FA" barSize={18} radius={[0,6,6,0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                  No staff data available
                </div>
              )}
            </div>
          </div>

          {/* WELCOME BANNER */}
          <div className="mt-6 bg-white p-6 rounded-xl shadow">
            <h2 className="text-base font-semibold text-gray-800 mb-1">Welcome Admin 👋</h2>
            <p className="text-gray-500 text-sm">
              Manage residents, track visitors, monitor payments, and control all
              society operations from one place.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;