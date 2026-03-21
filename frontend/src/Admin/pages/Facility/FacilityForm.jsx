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

  const { singleFacility, loading } = useSelector(
    (state) => state.facility
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // 🔥 Fetch facility (edit)
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchFacilityById(id));
    }
  }, [id, isEditMode, dispatch]);

  // 🔥 Populate form
  useEffect(() => {
    if (singleFacility && isEditMode) {
      reset({
        name: singleFacility.name || "",
        description: singleFacility.description || "",
        location: singleFacility.location || "",
        openingTime: singleFacility.openingTime || "",
        closingTime: singleFacility.closingTime || "",
        status: singleFacility.status || "Available",
      });
    }
  }, [singleFacility, isEditMode, reset]);

  // 🔥 Submit
  const onSubmit = async (data) => {
    if (isEditMode) {
      const res = await dispatch(updateFacility({ id, data }));
      if (res.type.endsWith("fulfilled")) {
        navigate("/admin/facility/list");
      }
    } else {
      const res = await dispatch(createFacility(data));
      if (res.type.endsWith("fulfilled")) {
        reset();
        navigate("/admin/facility/list");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8">

        {/* HEADER */}
        <div className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold">
            {isEditMode ? "Edit Facility" : "Add Facility"}
          </h2>
          <p className="text-gray-500">
            Manage facility details
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* NAME */}
          <div>
            <label>Facility Name *</label>
            <input
              {...register("name", { required: "Required" })}
              className="w-full border px-4 py-2 mt-1 rounded"
              placeholder="Gym / Hall / Pool"
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label>Description</label>
            <textarea
              {...register("description")}
              className="w-full border px-4 py-2 mt-1 rounded"
              placeholder="Facility details..."
            />
          </div>

          {/* LOCATION */}
          <div>
            <label>Location</label>
            <input
              {...register("location")}
              className="w-full border px-4 py-2 mt-1 rounded"
              placeholder="e.g. Block A Ground Floor"
            />
          </div>

          {/* TIME */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label>Opening Time</label>
              <input
                type="time"
                {...register("openingTime")}
                className="w-full border px-4 py-2 mt-1 rounded"
              />
            </div>

            <div>
              <label>Closing Time</label>
              <input
                type="time"
                {...register("closingTime")}
                className="w-full border px-4 py-2 mt-1 rounded"
              />
            </div>

          </div>

          {/* STATUS */}
          <div>
            <label>Status</label>
            <select
              {...register("status")}
              className="w-full border px-4 py-2 mt-1 rounded"
            >
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded"
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Facility"
                : "Save Facility"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default AddFacility;