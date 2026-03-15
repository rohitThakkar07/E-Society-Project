import React from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const FacilityDashboard = () => {
  const navigate = useNavigate();

  // Dummy Summary Data (Replace with API later)
  const summary = {
    totalBookings: 120,
    pendingBookings: 15,
    approvedBookings: 90,
    totalRevenue: 45000,
  };

  const facilityData = [
    { name: "Gym", value: 40 },
    { name: "Hall", value: 50 },
    { name: "Swimming Pool", value: 30 },
  ];

  const recentBookings = [
    { resident: "Flat A-101", facility: "Hall", date: "05-03-2026", status: "Approved" },
    { resident: "Flat B-202", facility: "Gym", date: "04-03-2026", status: "Pending" },
    { resident: "Flat C-303", facility: "Swimming Pool", date: "03-03-2026", status: "Approved" },
  ];

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Facility Dashboard</h1>
        <p className="text-gray-500">Manage and monitor facility bookings</p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => navigate("/facility/book")}
          className="bg-blue-600 text-white p-4 rounded-lg shadow hover:bg-blue-700 transition"
        >
          New Booking
        </button>

        <button
          onClick={() => navigate("/facility/list")}
          className="bg-green-600 text-white p-4 rounded-lg shadow hover:bg-green-700 transition"
        >
          Booking List
        </button>

        <button
          onClick={() => navigate("/facility/calendar")}
          className="bg-purple-600 text-white p-4 rounded-lg shadow hover:bg-purple-700 transition"
        >
          Calendar View
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Total Bookings</p>
          <h2 className="text-2xl font-bold mt-2">
            {summary.totalBookings}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Pending Approvals</p>
          <h2 className="text-2xl font-bold mt-2 text-yellow-600">
            {summary.pendingBookings}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Approved Bookings</p>
          <h2 className="text-2xl font-bold mt-2 text-green-600">
            {summary.approvedBookings}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h2 className="text-2xl font-bold mt-2 text-blue-600">
            ₹{summary.totalRevenue.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Facility Booking Distribution
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={facilityData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {facilityData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* RECENT BOOKINGS */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3">Resident</th>
                <th className="p-3">Facility</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map((booking, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{booking.resident}</td>
                  <td className="p-3">{booking.facility}</td>
                  <td className="p-3">{booking.date}</td>
                  <td className={`p-3 font-medium ${
                    booking.status === "Approved"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}>
                    {booking.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default FacilityDashboard;