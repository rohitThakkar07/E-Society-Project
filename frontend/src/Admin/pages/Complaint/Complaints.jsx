import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/complaint`;

const priorityStyles = {
  Low: "bg-gray-100 text-gray-600 border border-gray-200",
  Medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  High: "bg-red-100 text-red-700 border border-red-200",
};

const statusStyles = {
  Pending: "bg-orange-100 text-orange-700 border border-orange-200",
  "In Progress": "bg-blue-100 text-blue-700 border border-blue-200",
  Resolved: "bg-green-100 text-green-700 border border-green-200",
};

const categoryStyles = {
  Water: "bg-cyan-100 text-cyan-700",
  Electricity: "bg-yellow-100 text-yellow-700",
  Security: "bg-red-100 text-red-700",
  Maintenance: "bg-purple-100 text-purple-700",
  Other: "bg-gray-100 text-gray-600",
};

const Complaints = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  /* ───── Fetch all complaints ───── */
  const fetchComplaints = async () => {
    try {
      setIsLoading(true);

      const res = await axios.get(`${BASE_URL}/list`);

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch complaints");
      }
      
      setComplaints(res.data.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  /* ───── Filter by search + status ───── */
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.resident?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Complaints
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage resident complaints and their status.
          </p>
          <button onClick={()=>navigate("/admin/complaints/create")}>Create Complaint</button>
        </div>

        {/* Summary Badges */}
        <div className="flex gap-3">
          {["All", "Pending", "In Progress", "Resolved"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${statusFilter === s
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                }`}
            >
              {s === "All"
                ? `All (${complaints.length})`
                : `${s} (${complaints.filter((c) => c.status === s).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 relative max-w-sm">
        <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by title or resident..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="px-5 py-4 font-semibold">Complaint</th>
              <th className="px-5 py-4 font-semibold">Resident</th>
              <th className="px-5 py-4 font-semibold">Category</th>
              <th className="px-5 py-4 font-semibold">Priority</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Date</th>
              <th className="px-5 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  <div className="flex justify-center items-center gap-2">
                    <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                    Loading complaints...
                  </div>
                </td>
              </tr>
            ) : filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 bg-gray-50/50">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg font-medium text-gray-700">
                      No Complaints Found
                    </span>
                    <span className="text-sm text-gray-400">
                      Try a different search or filter.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredComplaints.map((complaint) => (
                <tr
                  key={complaint._id}
                  className="hover:bg-blue-50/30 transition-colors duration-200 align-middle"
                >
                  {/* Title + ID */}
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">
                      {complaint.title}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">
                      {complaint.description}
                    </div>
                  </td>

                  {/* Resident */}
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800">
                      {complaint.resident?.fullName || "N/A"}
                    </div>
                    <div className="text-xs text-indigo-500 font-medium">
                      Flat: {complaint.resident?.flatNumber || "—"}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${categoryStyles[complaint.category] || "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {complaint.category}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${priorityStyles[complaint.priority]
                        }`}
                    >
                      {complaint.priority}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[complaint.status]
                        }`}
                    >
                      {complaint.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {new Date(complaint.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() =>
                          navigate(`/admin/complaints/${complaint._id}`)
                        }
                        className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 rounded-lg"
                        title="View Details"
                      >
                        <FiEye size={16} />
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

export default Complaints;