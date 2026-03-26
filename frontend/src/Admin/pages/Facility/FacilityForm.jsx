import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createFacility,
  updateFacility,
  fetchFacilityById,
} from "../../../store/slices/facilitySlice";

const AddFacility = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { singleFacility, loading } = useSelector((state) => state.facility);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // 1. Fetch data if in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchFacilityById(id));
    }
  }, [id, isEditMode, dispatch]);

  // 2. Sync form with Redux state
  useEffect(() => {
    if (singleFacility && isEditMode) {
      reset({
        name: singleFacility.name || "",
        description: singleFacility.description || "",
        status: singleFacility.status || "Available",
      });
    }
  }, [singleFacility, isEditMode, reset]);

  // 3. Form Submission
  const onSubmit = async (data) => {
    const action = isEditMode
      ? updateFacility({ id, data })
      : createFacility(data);

    const res = await dispatch(action);
    
    if (res.type.endsWith("fulfilled")) {
      navigate("/admin/facility/list");
    }
  };

  // 4. Loading Guard for better UX
  if (isEditMode && loading && !singleFacility) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 font-medium animate-pulse">Loading Facility Data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        
        {/* HEADER */}
        <div className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Edit Facility" : "Add New Facility"}
          </h2>
          <p className="text-gray-500">Configure resources available for society residents</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* NAME - Required by Model */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Facility Name *
            </label>
            <input
              {...register("name", { required: "Facility name is required" })}
              className={`w-full border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition ${
                errors.name ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="e.g. Gym, Community Hall"
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* DESCRIPTION - Optional in Model */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
              placeholder="Capacity, equipment details, or usage rules..."
            />
          </div>

          {/* STATUS - Enum in Model */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Current Status
            </label>
            <select
              {...register("status")}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
            >
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm disabled:opacity-50 min-w-[120px]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : isEditMode ? (
                "Update Facility"
              ) : (
                "Create Facility"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddFacility;