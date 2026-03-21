import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchFacilities } from "../../../store/slices/facilitySlice";

const FacilityDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { facilities, loading } = useSelector((state) => state.facility);

  // 🔥 Fetch facilities
  useEffect(() => {
    dispatch(fetchFacilities());
  }, [dispatch]);

  // 🔥 Summary (derived from data)
  const total = facilities.length;
  const available = facilities.filter(f => f.status === "Available").length;
  const maintenance = facilities.filter(f => f.status === "Maintenance").length;
  const closed = facilities.filter(f => f.status === "Closed").length;

  // 🔥 Chart Data
  const facilityData = [
    { name: "Available", value: available },
    { name: "Maintenance", value: maintenance },
    { name: "Closed", value: closed },
  ];

  const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Facility Dashboard</h1>
        <p className="text-gray-500">Manage facilities</p>
      </div>

      {/* ACTIONS */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => navigate("/admin/facility/add")}
          className="bg-blue-600 text-white p-4 rounded-lg"
        >
          Add Facility
        </button>

        <button
          onClick={() => navigate("/admin/facility/list")}
          className="bg-green-600 text-white p-4 rounded-lg"
        >
          Facility List
        </button>
        <button
          onClick={() => navigate("/admin/facility-booking/list")}
          className="bg-green-600 text-white p-4 rounded-lg"
        >
          Booking List
        </button>
        <button
          onClick={() => navigate("/admin/facility/calendar")}
          className="bg-green-600 text-white p-4 rounded-lg"
        >
          Booking Calander
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-5 rounded-xl shadow">
          <p>Total</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Available</p>
          <h2 className="text-2xl font-bold text-green-600">{available}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Maintenance</p>
          <h2 className="text-2xl font-bold text-yellow-600">{maintenance}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Closed</p>
          <h2 className="text-2xl font-bold text-red-600">{closed}</h2>
        </div>
      </div>

      {/* CHART */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Facility Status Distribution
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
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* LIST */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Facilities</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Location</th>
              <th className="p-3">Timing</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : facilities.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No facilities found
                </td>
              </tr>
            ) : (
              facilities.map((f) => (
                <tr key={f._id} className="border-b">

                  <td className="p-3">{f.name}</td>
                  <td className="p-3">{f.location || "-"}</td>
                  <td className="p-3">
                    {f.openingTime} - {f.closingTime}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded ${
                        f.status === "Available"
                          ? "bg-green-100 text-green-600"
                          : f.status === "Maintenance"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default FacilityDashboard;