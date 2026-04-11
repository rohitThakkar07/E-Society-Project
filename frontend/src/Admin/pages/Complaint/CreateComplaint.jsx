import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = `${import.meta.env.VITE_API_URL}/complaints`;

const CreateComplaint = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      priority: "Medium",
      status: "Pending",
      attachment: null,
    },
  });

  /* ───── Submit Complaint ───── */
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      let attachmentUrl = undefined;

      // Upload file if present
      if (data.attachment?.[0]) {
        const formData = new FormData();
        formData.append("file", data.attachment[0]);
        const uploadRes = await axios.post("/api/upload", formData);
        attachmentUrl = uploadRes.data.url;
      }

      const payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        status: data.status,
        ...(attachmentUrl && { attachment: attachmentUrl }),
      };

      const response = await axios.post(`${BASE_URL}/create`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        toast.success("Complaint submitted successfully!");
        reset();
        navigate("/resident/complaints");
      } else {
        toast.error(response.data.message || "Something went wrong");
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
            Submit a Complaint
          </h2>
          <p className="text-gray-500 mt-1">
            Fill in the details below to register your complaint
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* Section 1 - Complaint Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">
                1
              </span>
              Complaint Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Title */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  placeholder="e.g. Water leakage in bathroom"
                  className={`w-full border rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition
                    ${errors.title ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                {errors.title && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.title.message}
                  </span>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("category", { required: "Category is required" })}
                  className={`w-full border rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition
                    ${errors.category ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                >
                  <option value="">Select Category</option>
                  <option value="Water">Water</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Security">Security</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.category.message}
                  </span>
                )}
              </div>

            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                })}
                rows={4}
                placeholder="Describe the issue in detail..."
                className={`w-full border rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none
                  ${errors.description ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              {errors.description && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>

          {/* Section 2 - Priority & Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">
                2
              </span>
              Priority & Status
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Priority */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  {...register("priority")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  {...register("status")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Attachment */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Attachment{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  {...register("attachment")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 text-sm text-gray-500
                    file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0
                    file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600
                    hover:file:bg-indigo-100 transition outline-none cursor-pointer"
                />
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/resident/complaints")}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-3 rounded-lg text-white font-semibold transition-all shadow-md
                ${isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
              {isLoading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;