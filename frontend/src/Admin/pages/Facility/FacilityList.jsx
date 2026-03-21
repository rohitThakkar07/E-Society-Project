import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFacilities,
  deleteFacility,
} from "../../../store/slices/facilitySlice";

const FacilityList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { facilities, loading } = useSelector(
    (state) => state.facility
  );

  // 🔥 Fetch data
  useEffect(() => {
    dispatch(fetchFacilities());
  }, [dispatch]);

  // 🔥 Delete handler
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
          onClick={() => navigate("/facility/add")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Facility
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Location</th>
              <th className="p-4">Timing</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ) : facilities.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6">
                  No facilities found
                </td>
              </tr>
            ) : (
              facilities.map((f) => (
                <tr key={f._id} className="border-b hover:bg-gray-50">

                  {/* NAME */}
                  <td className="p-4 font-medium">{f.name}</td>

                  {/* LOCATION */}
                  <td className="p-4">{f.location || "-"}</td>

                  {/* TIME */}
                  <td className="p-4">
                    {f.openingTime || "-"} - {f.closingTime || "-"}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
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

                  {/* ACTIONS */}
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-3">

                      {/* EDIT */}
                      <button
                        onClick={() =>
                          navigate(`/admin/facility/edit/${f._id}`)
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(f._id)}
                        className="text-red-600 hover:text-red-800"
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