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
  } = useForm({
    defaultValues: {
      bookingType: "hourly",
      pricePerHour: 0,
      pricePerDay: 0,
      openTime: "06:00",
      closeTime: "22:00",
      status: "Available",
    },
  });

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
        bookingType: singleFacility.bookingType || "hourly",
        pricePerHour: singleFacility.pricePerHour ?? 0,
        pricePerDay: singleFacility.pricePerDay ?? 0,
        openTime: singleFacility.openTime || "06:00",
        closeTime: singleFacility.closeTime || "22:00",
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit" : "Add"} Facility</h1>
            <p className="text-sm text-gray-500">Configure resources available for society residents.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div className="admin-form-group md:col-span-2">
            <label className="admin-label">Facility Name *</label>
            <input
              {...register("name", { required: "Facility name is required" })}
              className="admin-input"
              placeholder="e.g. Gym, Community Hall"
            />
            {errors.name && <span className="text-[10px] font-bold text-red-500 uppercase mt-1">{errors.name.message}</span>}
          </div>

          <div className="admin-form-group md:col-span-2">
            <label className="admin-label">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="admin-input resize-none"
              placeholder="Capacity, equipment details, or usage rules..."
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Current Status</label>
            <select {...register("status")} className="admin-input">
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Booking Type *</label>
            <select {...register("bookingType")} className="admin-input">
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="both">Both (Days + Extra Hours)</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Price / Hour (₹)</label>
            <input
              type="number"
              min={0}
              {...register("pricePerHour", { valueAsNumber: true })}
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Price / Day (₹)</label>
            <input
              type="number"
              min={0}
              {...register("pricePerDay", { valueAsNumber: true })}
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Opens (24h HH:mm)</label>
            <input
              type="text"
              placeholder="06:00"
              {...register("openTime")}
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Closes (24h HH:mm)</label>
            <input
              type="text"
              placeholder="22:00"
              {...register("closeTime")}
              className="admin-input"
            />
          </div>
        </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-50">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="admin-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="admin-btn-primary"
            >
              {loading ? "Saving..." : isEditMode ? "Update Facility" : "Create Facility"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFacility;