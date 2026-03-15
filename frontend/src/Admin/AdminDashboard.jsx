import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const AdminDashboard = () => {

  // Dummy Data (Later connect API)
  const dashboardStats = {
    totalResidents: 120,
    activeComplaints: 15,
    pendingComplaints: 8,
    monthlyCollection: 250000,
    totalExpenses: 180000,
    todayVisitors: 34,
  };

  const chartData = [
    { month: "Jan", income: 200000, expense: 150000 },
    { month: "Feb", income: 240000, expense: 170000 },
    { month: "Mar", income: 250000, expense: 180000 },
    { month: "Apr", income: 270000, expense: 190000 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1">
        <main className="p-6">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">Society Overview & Analytics</p>
          </div>

          {/* QUICK STATS CARDS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-gray-500 text-sm">Total Residents</p>
              <h2 className="text-2xl font-bold mt-2">{dashboardStats.totalResidents}</h2>
            </div>

            <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-gray-500 text-sm">Active Complaints</p>
              <h2 className="text-2xl font-bold mt-2 text-yellow-600">
                {dashboardStats.activeComplaints}
              </h2>
            </div>

            <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-gray-500 text-sm">Pending Complaints</p>
              <h2 className="text-2xl font-bold mt-2 text-red-600">
                {dashboardStats.pendingComplaints}
              </h2>
            </div>

            <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-gray-500 text-sm">Visitors Today</p>
              <h2 className="text-2xl font-bold mt-2">
                {dashboardStats.todayVisitors}
              </h2>
            </div>

            <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-gray-500 text-sm">Monthly Collection</p>
              <h2 className="text-2xl font-bold mt-2 text-green-600">
                ₹{dashboardStats.monthlyCollection.toLocaleString()}
              </h2>
            </div>

            <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-gray-500 text-sm">Total Expenses</p>
              <h2 className="text-2xl font-bold mt-2 text-blue-600">
                ₹{dashboardStats.totalExpenses.toLocaleString()}
              </h2>
            </div>

          </div>

          {/* CHART SECTION */}
          <div className="mt-10 bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">
              Income vs Expense (Monthly)
            </h2>

            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.6} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                <XAxis dataKey="month" tick={{ fill: '#374151', fontSize: 13 }} />
                <YAxis tick={{ fill: '#374151', fontSize: 13 }} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Legend verticalAlign="top" height={36} />

                <Bar dataKey="income" name="Income" fill="url(#colorIncome)" barSize={40} radius={[8, 8, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="url(#colorExpense)" barSize={40} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* INFO SECTION */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-3">Welcome Admin 👋</h2>
            <p className="text-gray-600">
              Here you can manage residents, track visitors, monitor payments,
              and control all society operations from one place.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;