import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:4000/api/visitors";
const RESIDENTS_URL = "http://localhost:4000/api/resident/list";

const AddEditVisitor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [isLoading, setIsLoading]               = useState(false);
  const [isDeleting, setIsDeleting]             = useState(false);
  const [residents, setResidents]               = useState([]);
  const [residentsLoading, setResidentsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      visitorName:       "",
      mobileNumber:      "",
      visitingResident:  "",
      wing:              "",
      flatNumber:        "",
      purpose:           "",
      entryTime:         "",
      exitTime:          "",
      status:            "Inside",
    },
  });

  // ── 1. Fetch Residents for Dropdown ──
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        setResidentsLoading(true);
        const res = await axios.get(RESIDENTS_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = res.data.data || res.data;
        setResidents(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Failed to load residents");
        setResidents([]);
      } finally {
        setResidentsLoading(false);
      }
    };
    fetchResidents();
  }, []);

  // ── 2. Fetch Visitor Data in Edit Mode ──
  useEffect(() => {
    if (isEditMode) {
      fetchVisitor();
    }
  }, [id]);

  const fetchVisitor = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data.success) {
        const v = res.data.data;

        // Format datetime-local fields (YYYY-MM-DDTHH:mm)
        const formatDateTime = (dateStr) => {
          if (!dateStr) return "";
          return new Date(dateStr).toISOString().slice(0, 16);
        };

        reset({
          visitorName:      v.visitorName      || "",
          mobileNumber:     v.mobileNumber     || "",
          visitingResident: v.visitingResident?._id || v.visitingResident || "",
          wing:             v.wing             || "",
          flatNumber:       v.flatNumber       || "",
          purpose:          v.purpose          || "",
          entryTime:        formatDateTime(v.entryTime),
          exitTime:         formatDateTime(v.exitTime),
          status:           v.status           || "Inside",
        });
      } else {
        toast.error(res.data.message || "Failed to load visitor");
        navigate("/admin/visitors");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load visitor");
      navigate("/admin/visitors");
    }
  };

  // ── 3. Auto-fill Wing & Flat when Resident selected ──
  const handleResidentChange = (e) => {
    const selectedId = e.target.value;
    setValue("visitingResident", selectedId);

    const resident = residents.find((r) => r._id === selectedId);
    if (resident) {
      setValue("wing",       resident.wing       || "");
      setValue("flatNumber", resident.flatNumber || "");
    } else {
      setValue("wing",       "");
      setValue("flatNumber", "");
    }
  };

  // ── 4. Create or Update ──
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const payload = {
        visitorName:      data.visitorName,
        mobileNumber:     data.mobileNumber,
        visitingResident: data.visitingResident,
        wing:             data.wing,
        flatNumber:       data.flatNumber,
        purpose:          data.purpose,
        status:           data.status,
        ...(data.entryTime && { entryTime: new Date(data.entryTime).toISOString() }),
        ...(data.exitTime  && { exitTime:  new Date(data.exitTime).toISOString()  }),
      };

      let response;

      if (isEditMode) {
        response = await axios.put(`${BASE_URL}/update/${id}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        response = await axios.post(`${BASE_URL}/create`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }

      if (response.data.success) {
        toast.success(
          isEditMode ? "Visitor updated successfully!" : "Visitor added successfully!"
        );
        reset();
        navigate("/admin/visitors");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  // ── 5. Delete ──
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this visitor record? This action cannot be undone.")) return;

    try {
      setIsDeleting(true);

      const res = await axios.delete(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data.success) {
        toast.success("Visitor deleted successfully!");
        navigate("/admin/visitors");
      } else {
        toast.error(res.data.message || "Failed to delete visitor");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete visitor");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8 border border-gray-100">

        {/* ── Header ── */}
        <div className="mb-8 border-b pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800">
              {isEditMode ? "Edit Visitor" : "Add New Visitor"}
            </h2>
            <p className="text-gray-500 mt-1">
              {isEditMode
                ? "Update visitor entry details"
                : "Register a new visitor entry for the society"}
            </p>
          </div>

          {/* Delete button — only in edit mode */}
          {isEditMode && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold transition
                ${isDeleting
                  ? "border-red-200 text-red-300 cursor-not-allowed bg-red-50"
                  : "border-red-300 text-red-500 hover:bg-red-50 hover:border-red-400"
                }`}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 00-1-1h-4a1 1 0 00-1 1H5" />
                  </svg>
                  Delete Visitor
                </>
              )}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* ── Section 1 : Visitor Information ── */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">
                1
              </span>
              Visitor Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Visitor Name */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Visitor Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("visitorName", {
                    required: "Visitor name is required",
                  })}
                  placeholder="e.g. Raj Patel"
                  className={`w-full border rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition
                    ${errors.visitorName ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                {errors.visitorName && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.visitorName.message}
                  </span>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("mobileNumber", {
                    required: "Mobile number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Enter a valid 10-digit mobile number",
                    },
                  })}
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                  className={`w-full border rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition
                    ${errors.mobileNumber ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                {errors.mobileNumber && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.mobileNumber.message}
                  </span>
                )}
              </div>

              {/* Purpose */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Purpose of Visit
                </label>
                <input
                  {...register("purpose")}
                  placeholder="e.g. Delivery, Guest, Maintenance"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>

            </div>
          </div>

          {/* ── Section 2 : Flat Details ── */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">
                2
              </span>
              Flat Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Visiting Resident Dropdown — full width */}
              <div className="md:col-span-3">
                <label className="text-sm font-medium text-gray-700">
                  Visiting Resident <span className="text-red-500">*</span>
                </label>

                {residentsLoading ? (
                  <div className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 bg-gray-50 animate-pulse h-11" />
                ) : (
                  <select
                    {...register("visitingResident", {
                      required: "Please select a resident",
                    })}
                    onChange={handleResidentChange}
                    className={`w-full border rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white
                      ${errors.visitingResident ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                  >
                    <option value="">— Select Resident —</option>
                    {residents.map((resident) => (
                      <option key={resident._id} value={resident._id}>
                        {resident.firstName + " " + resident.lastName}
                        &nbsp;|&nbsp; Wing {resident.wing} - Flat {resident.flatNumber}
                      </option>
                    ))}
                  </select>
                )}

                {errors.visitingResident && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.visitingResident.message}
                  </span>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Selecting a resident will auto-fill wing and flat number below
                </p>
              </div>

              {/* Wing — auto-filled */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Wing <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("wing", { required: "Wing is required" })}
                  placeholder="Auto-filled on resident select"
                  readOnly
                  className={`w-full border rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-gray-50 cursor-not-allowed
                    ${errors.wing ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                {errors.wing && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.wing.message}
                  </span>
                )}
              </div>

              {/* Flat Number — auto-filled */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Flat Number <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("flatNumber", {
                    required: "Flat number is required",
                  })}
                  placeholder="Auto-filled on resident select"
                  readOnly
                  className={`w-full border rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-gray-50 cursor-not-allowed
                    ${errors.flatNumber ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                {errors.flatNumber && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors.flatNumber.message}
                  </span>
                )}
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
                  <option value="Inside">Inside</option>
                  <option value="Exited">Exited</option>
                </select>
              </div>

            </div>
          </div>

          {/* ── Section 3 : Entry & Exit Time ── */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">
                3
              </span>
              Entry & Exit Time
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Entry Time */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Entry Time
                </label>
                <input
                  type="datetime-local"
                  {...register("entryTime")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Leave blank to use current time automatically
                </p>
              </div>

              {/* Exit Time */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Exit Time{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="datetime-local"
                  {...register("exitTime")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Fill only when visitor has exited
                </p>
              </div>

            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div className="pt-6 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/visitors")}
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
              {isLoading
                ? "Saving..."
                : isEditMode
                ? "Update Visitor"
                : "Save Visitor"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddEditVisitor;