import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchFacilities } from "../../../store/slices/facilitySlice";

const FacilityDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { facilities = [], loading } = useSelector((state) => state.facility);

  useEffect(() => {
    dispatch(fetchFacilities());
  }, [dispatch]);

  const total = facilities.length;
  const available = facilities.filter(f => f.status === "Available").length;
  const maintenance = facilities.filter(f => f.status === "Maintenance").length;
  const closed = facilities.filter(f => f.status === "Closed").length;

  const facilityData = [
    { name: "Available", value: available },
    { name: "Maintenance", value: maintenance },
    { name: "Closed", value: closed },
  ];

  const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Facility Overview</h1>
        <p className="text-gray-500 text-sm">Monitor society asset status and availability</p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <button onClick={() => navigate("/admin/facility/add")} className="bg-blue-600 text-white p-4 rounded-xl shadow-md hover:bg-blue-700 transition font-medium">+ Add Facility</button>
        <button onClick={() => navigate("/admin/facility/list")} className="bg-white text-blue-600 border border-blue-100 p-4 rounded-xl shadow-sm hover:bg-gray-50 transition font-medium">Facility Records</button>
        <button onClick={() => navigate("/admin/facility-booking/list")} className="bg-white text-gray-600 border border-gray-100 p-4 rounded-xl shadow-sm hover:bg-gray-50 transition font-medium">View Bookings</button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-bold uppercase">Total Resources</p>
          <h2 className="text-3xl font-bold mt-1">{total}</h2>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-l-green-500">
          <p className="text-gray-400 text-xs font-bold uppercase">Active</p>
          <h2 className="text-3xl font-bold text-green-600 mt-1">{available}</h2>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-l-yellow-500">
          <p className="text-gray-400 text-xs font-bold uppercase">Maintenance</p>
          <h2 className="text-3xl font-bold text-yellow-600 mt-1">{maintenance}</h2>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-l-red-500">
          <p className="text-gray-400 text-xs font-bold uppercase">Closed</p>
          <h2 className="text-3xl font-bold text-red-600 mt-1">{closed}</h2>
        </div>
      </div>

      {/* CHART */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Asset Health Distribution</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={facilityData} dataKey="value" nameKey="name" outerRadius={110} innerRadius={70} paddingAngle={5}>
                {facilityData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FacilityDashboard;