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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Complaint</h1>
            <p className="text-sm text-gray-500">Register a new complaint on behalf of a resident.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div className="admin-form-group">
            <label className="admin-label">Complaint Title *</label>
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="e.g. Water leakage in bathroom"
              className="admin-input"
            />
            {errors.title && <span className="text-[10px] font-bold text-red-500 uppercase mt-1">{errors.title.message}</span>}
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Category *</label>
            <select
              {...register("category", { required: "Category is required" })}
              className="admin-input"
            >
              <option value="">Select Category</option>
              <option value="Water">Water</option>
              <option value="Electricity">Electricity</option>
              <option value="Security">Security</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && <span className="text-[10px] font-bold text-red-500 uppercase mt-1">{errors.category.message}</span>}
          </div>

          <div className="admin-form-group md:col-span-2">
            <label className="admin-label">Description *</label>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: { value: 10, message: "Description must be at least 10 characters" },
              })}
              rows={4}
              placeholder="Describe the issue in detail..."
              className="admin-input resize-none"
            />
            {errors.description && <span className="text-[10px] font-bold text-red-500 uppercase mt-1">{errors.description.message}</span>}
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Priority</label>
            <select {...register("priority")} className="admin-input">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Status</label>
            <select {...register("status")} className="admin-input">
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="admin-form-group md:col-span-2">
            <label className="admin-label">Attachment (Optional)</label>
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              {...register("attachment")}
              className="admin-input file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-xs file:font-black file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={() => navigate("/admin/complaints")}
              className="admin-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="admin-btn-primary"
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