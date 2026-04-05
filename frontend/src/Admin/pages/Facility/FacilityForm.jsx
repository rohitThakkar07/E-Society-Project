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
    <div className="container-fluid bg-light min-vh-100 py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-xl-5">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title mb-0">
                {isEditMode ? "Edit Facility" : "Add New Facility"}
              </h2>
              <p className="card-subtitle mb-0 text-white-50">Configure resources available for society residents</p>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
          
                <div className="mb-3">
                  <label className="form-label">Facility Name *</label>
                  <input
                    {...register("name", { required: "Facility name is required" })}
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    placeholder="e.g. Gym, Community Hall"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className="form-control"
                    placeholder="Capacity, equipment details, or usage rules..."
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Current Status</label>
                  <select
                    {...register("status")}
                    className="form-select"
                  >
                    <option value="Available">Available</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <hr className="my-4" />
                <h6 className="text-muted mb-3">Booking &amp; pricing</h6>

                <div className="mb-3">
                  <label className="form-label">Booking type *</label>
                  <select {...register("bookingType")} className="form-select">
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="both">Both (days + extra hours)</option>
                  </select>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Price / hour (₹)</label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      {...register("pricePerHour", { valueAsNumber: true })}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Price / day (₹)</label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      {...register("pricePerDay", { valueAsNumber: true })}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Opens (24h HH:mm)</label>
                    <input
                      type="text"
                      placeholder="06:00"
                      {...register("openTime")}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Closes (24h HH:mm)</label>
                    <input
                      type="text"
                      placeholder="22:00"
                      {...register("closeTime")}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? (
                      <span className="d-flex align-items-center justify-content-center gap-2">
                        <div className="spinner-border spinner-border-sm" role="status"></div>
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
        </div>
      </div>
    </div>
  );
};

export default AddFacility;