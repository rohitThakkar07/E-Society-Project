import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFacilities, deleteFacility } from "../../../store/slices/facilitySlice";

const FacilityList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { facilities = [], loading } = useSelector((state) => state.facility);

  useEffect(() => {
    dispatch(fetchFacilities());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this facility?")) {
      dispatch(deleteFacility(id));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Facility Management</h1>
        <button
          onClick={() => navigate("/admin/facility/add")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          + Add Facility
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-600 text-sm">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Description</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="4" className="text-center p-10 text-gray-400">Loading...</td></tr>
            ) : facilities.length === 0 ? (
              <tr><td colSpan="4" className="text-center p-10 text-gray-400">No facilities found</td></tr>
            ) : (
              facilities.map((f) => (
                <tr key={f._id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">{f.name}</td>
                  <td className="p-4 text-gray-500 italic max-w-xs truncate">
                    {f.description || "No description provided"}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        f.status === "Available" ? "bg-green-100 text-green-600" : 
                        f.status === "Maintenance" ? "bg-yellow-100 text-yellow-600" : 
                        "bg-red-100 text-red-600"
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => navigate(`/admin/facility/edit/${f._id}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(f._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
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

export default FacilityList;