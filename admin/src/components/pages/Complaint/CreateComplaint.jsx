import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const CreateComplaint = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Complaint Submitted:", data);

    // TODO: Send to backend
    // axios.post("/api/complaints", data)

    alert("Complaint submitted successfully!");
    reset();
    navigate("/complaints");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Complaint</h1>
        <p className="text-gray-500">
          Submit a new complaint regarding society issues
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Title */}
          <div>
            <label className="block mb-2 font-medium">Title</label>
            <input
              type="text"
              placeholder="Enter complaint title"
              {...register("title", { required: "Title is required" })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 font-medium">Category</label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full border px-4 py-2 rounded-lg"
            >
              <option value="">Select Category</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Security">Security</option>
              <option value="Facility">Facility</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block mb-2 font-medium">Priority</label>
            <select
              {...register("priority", { required: "Priority is required" })}
              className="w-full border px-4 py-2 rounded-lg"
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {errors.priority && (
              <p className="text-red-500 text-sm">{errors.priority.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              rows="4"
              placeholder="Describe your issue"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Minimum 10 characters required",
                },
              })}
              className="w-full border px-4 py-2 rounded-lg"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Complaint
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;