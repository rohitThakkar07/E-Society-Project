import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchComplaints } from "../../../store/slices/complaintSlice";

const ComplaintDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { complaints, loading } = useSelector((state) => state.complaint);

  const [statusFilter, setStatusFilter] = useState("All");

  // 🔥 Fetch data
  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  // 🔥 Filter Logic
  const filteredComplaints =
    statusFilter === "All"
      ? complaints
      : complaints.filter((c) => c.status === statusFilter);

  // 🔥 Stats
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Complaint Management</h1>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow">
          <p>Total</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Pending</p>
          <h2 className="text-2xl font-bold text-red-600">{pending}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>In Progress</p>
          <h2 className="text-2xl font-bold text-yellow-600">{inProgress}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Resolved</p>
          <h2 className="text-2xl font-bold text-green-600">{resolved}</h2>
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ) : filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6">
                  No complaints found
                </td>
              </tr>
            ) : (
              filteredComplaints.map((c) => (
                <tr key={c._id} className="border-b hover:bg-gray-50">

                  <td className="p-4 font-medium">{c.title}</td>
                  <td className="p-4">{c.category}</td>

                  <td className="p-4">
                    <span className="px-2 py-1 bg-red-100 text-red-600 rounded">
                      {c.priority}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded ${
                        c.status === "Resolved"
                          ? "bg-green-100 text-green-600"
                          : c.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        navigate(`/admin/complaints/${c._id}`)
                      }
                      className="text-blue-600"
                    >
                      View
                    </button>
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

export default ComplaintDashboard;