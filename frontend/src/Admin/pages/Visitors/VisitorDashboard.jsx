import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchVisitors } from "../../../store/slices/visitorSlice";
import { deleteVisitor } from "../../../store/slices/visitorSlice";
import { FiTrash2, FiEdit } from "react-icons/fi";
const VisitorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { visitors, loading } = useSelector((state) => state.visitor);

  const [statusFilter, setStatusFilter] = useState("All");

  // 🔥 Fetch from API
  useEffect(() => {
    dispatch(fetchVisitors());
  }, [dispatch]);

  // 🔥 Filter Logic (match your backend status)
  const filteredVisitors =
    statusFilter === "All"
      ? visitors
      : visitors.filter((v) => v.status === statusFilter);

  // 🔥 Stats (based on real data)
  const total = visitors.length;
  const inside = visitors.filter(v => v.status === "Inside").length;
  const exited = visitors.filter(v => v.status === "Exited").length;

  const handleDelete = (id) => {
  if (window.confirm("Delete this visitor?")) {
    dispatch(deleteVisitor(id));
  }
};
  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Visitor Management</h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/visitor/reports')}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            View Reports
          </button>

          <button
            onClick={() => navigate('/admin/visitor/add')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Visitor
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Visitors</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Inside</p>
          <h2 className="text-2xl font-bold text-green-600">{inside}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Exited</p>
          <h2 className="text-2xl font-bold text-gray-600">{exited}</h2>
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="All">All Status</option>
          <option value="Inside">Inside</option>
          <option value="Exited">Exited</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Visitor Name</th>
              <th className="p-4">Resident</th>
              <th className="p-4">Flat</th>
              <th className="p-4">Purpose</th>
              <th className="p-4">Entry Time</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  Loading visitors...
                </td>
              </tr>
            ) : filteredVisitors.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No visitors found
                </td>
              </tr>
            ) : (
              filteredVisitors.map((visitor) => (
                <tr key={visitor._id} className="border-b hover:bg-gray-50">

                  {/* Visitor Name */}
                  <td className="p-4 font-medium">
                    {visitor.visitorName}
                  </td>

                  {/* Resident Name */}
                  <td className="p-4">
                    {visitor.visitingResident?.fullName || "N/A"}
                  </td>

                  {/* Flat */}
                  <td className="p-4">
                    {visitor.visitingResident?.flatNumber || "N/A"}
                  </td>

                  {/* Purpose */}
                  <td className="p-4">
                    {visitor.purpose || "-"}
                  </td>

                  {/* Entry Time */}
                  <td className="p-4">
                    {new Date(visitor.entryTime).toLocaleString()}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${visitor.status === "Inside"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {visitor.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex gap-3 justify-center">

                      {/* EDIT */}
                      <button
                        onClick={() => navigate(`/admin/visitor/edit/${visitor._id}`)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FiEdit size={18} />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(visitor._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={18} />
                      </button>

                    </div>
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

export default VisitorDashboard;