import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AddEditFlat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Load flat data for edit
  useEffect(() => {
    if (isEditMode) {
      fetchFlat();
    }
  }, [id]);

  const fetchFlat = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/flats/${id}`
      );

      if (res.data.success) {
        reset(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load flat");
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      let response;

      if (isEditMode) {
        response = await axios.put(
          `http://localhost:4000/api/flats/${id}`,
          data
        );
      } else {
        response = await axios.post(
          `http://localhost:4000/api/flats/create`,
          data
        );
      }

      if (response.data.success) {
        toast.success(
          isEditMode ? "Flat updated successfully" : "Flat added successfully"
        );

        navigate("/admin/flat/list");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8 border border-gray-100">

        {/* Header */}
        <div className="mb-8 border-b pb-4">
          <h2 className="text-3xl font-extrabold text-gray-800">
            {isEditMode ? "Edit Flat" : "Add New Flat"}
          </h2>

          <p className="text-gray-500 mt-1">
            {isEditMode
              ? "Update flat information"
              : "Register a new flat in the society"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">
                1
              </span>
              Flat Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Wing */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Wing *
                </label>

                <input
                  {...register("wing", { required: "Wing is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500"
                />

                {errors.wing && (
                  <span className="text-xs text-red-500">
                    {errors.wing.message}
                  </span>
                )}
              </div>

              {/* Flat Number */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Flat Number *
                </label>

                <input
                  {...register("flatNumber", {
                    required: "Flat number is required",
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500"
                />

                {errors.flatNumber && (
                  <span className="text-xs text-red-500">
                    {errors.flatNumber.message}
                  </span>
                )}
              </div>

              {/* Floor */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Floor Number
                </label>

                <input
                  type="number"
                  {...register("floorNumber")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

            </div>
          </div>

          {/* Flat Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">
                2
              </span>
              Flat Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Type */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Flat Type *
                </label>

                <select
                  {...register("flatType", {
                    required: "Flat type required",
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1"
                >
                  <option value="">Select Type</option>
                  <option value="1BHK">1 BHK</option>
                  <option value="2BHK">2 BHK</option>
                  <option value="3BHK">3 BHK</option>
                </select>
              </div>

              {/* Area */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Area (sqft)
                </label>

                <input
                  type="number"
                  {...register("area")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1"
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  {...register("status")}
                  defaultValue="Vacant"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1"
                >
                  <option value="Vacant">Vacant</option>
                  <option value="Occupied">Occupied</option>
                </select>
              </div>

            </div>
          </div>

          {/* Button */}
          <div className="pt-6 border-t flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-3 rounded-lg text-white font-semibold transition-all shadow-md 
              ${isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
              {isLoading
                ? "Saving..."
                : isEditMode
                  ? "Update Flat"
                  : "Save Flat"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddEditFlat;