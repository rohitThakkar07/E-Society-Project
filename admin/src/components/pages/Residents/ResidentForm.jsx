import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';

// --- Helper Components ---
const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 transition-shadow hover:shadow-md">
    <h3 className="text-lg font-bold text-gray-800 mb-5 border-b border-gray-100 pb-3">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">{children}</div>
  </div>
);

const Input = ({ label, register, name, rules, error, type = "text", ...rest }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-1.5">
      {label} {rules?.required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      {...register(name, rules)}
      {...rest}
      className={`border rounded-xl px-4 py-2.5 outline-none transition-all duration-200 ${error ? "border-red-400 bg-red-50 focus:ring-4 focus:ring-red-100" : "border-gray-200 bg-gray-50 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        }`}
    />
    {error && <span className="text-red-500 text-xs font-medium mt-1.5">{error.message}</span>}
  </div>
);

const Select = ({ label, register, name, rules, error, children }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-700 mb-1.5">
      {label} {rules?.required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...register(name, rules)}
      className={`border rounded-xl px-4 py-2.5 outline-none transition-all duration-200 appearance-none ${error ? "border-red-400 bg-red-50 focus:ring-4 focus:ring-red-100" : "border-gray-200 bg-gray-50 hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        }`}
    >
      {children}
    </select>
    {error && <span className="text-red-500 text-xs font-medium mt-1.5">{error.message}</span>}
  </div>
);

// --- Main Form Component ---
const ResidentForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEditMode = Boolean(id); 

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { status: "Active" }
  });

  // Fetch Resident Data if in Edit Mode
  useEffect(() => {
    if (isEditMode) {
      const fetchResidentData = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/resident/${id}`);
          const residentData = response.data?.data;

          // Mongoose returns dates as ISO strings (e.g., "1998-05-15T00:00:00.000Z")
          // We must slice them to "YYYY-MM-DD" for HTML <input type="date"> to read them
          if (residentData.dateOfBirth) {
            residentData.dateOfBirth = residentData.dateOfBirth.split('T')[0];
          }
          if (residentData.moveInDate) {
            residentData.moveInDate = residentData.moveInDate.split('T')[0];
          }

          // Populate the form with the fetched data
          reset(residentData);
        } catch (error) {
          console.error("Error fetching resident:", error);
          alert("Failed to load resident data for editing.");
          navigate("/residents"); 
        } finally {
          setIsLoading(false);
        }
      };
      fetchResidentData();
    }
  }, [id, isEditMode, reset, navigate]);

  // Handle Form Submission (Both Create and Update)
 const onSubmit = async (data) => {
  setIsSubmitting(true);

  const formattedData = {
    ...data,
    floorNumber: parseInt(data.floorNumber, 10),
  };

  try {
    if (isEditMode) {

      await axios.put(
        `http://localhost:4000/api/resident/update/${id}`,
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Resident updated successfully");

    } else {

      await axios.post(
        "http://localhost:4000/api/resident/create",
        formattedData,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Resident registered successfully");

    }

    navigate("/residents");

  } catch (error) {

    let message = "Something went wrong. Please try again.";

    if (error.response?.data?.message) {
      message = error.response.data.message;
    }

    if (error.response?.data?.errors?.length) {
      message = error.response.data.errors[0].msg;
    }

    toast.error(message);

  } finally {
    setIsSubmitting(false);
  }
};

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading resident data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        
        {/* Header */}
        <div className="mb-8 border-b pb-4">
          <h2 className="text-3xl font-extrabold text-gray-800">
            {isEditMode ? "Edit Resident" : "Add New Resident"}
          </h2>
          <p className="text-gray-500 mt-1">
            {isEditMode 
              ? "Update resident information in the system." 
              : "Register a new resident into the society."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* --- Section 1: Personal Details --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full inline-flex justify-center items-center mr-2 text-sm font-bold">1</span>
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                <input
                  {...register("firstName", { required: "First name is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="e.g. Rahul"
                />
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input
                  {...register("lastName")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="e.g. Sharma"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                <select
                  {...register("gender", { required: "Gender is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 bg-white outline-none transition"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>}
              </div>
            </div>
          </div>

          {/* --- Section 2: Contact Information --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full inline-flex justify-center items-center mr-2 text-sm font-bold">2</span>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  {...register("mobileNumber", { 
                    required: "Mobile number is required",
                    pattern: { value: /^[0-9]{10}$/, message: "Must be exactly 10 digits" }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="10-digit number"
                />
                {errors.mobileNumber && <p className="text-xs text-red-500 mt-1">{errors.mobileNumber.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="e.g. rahul@example.com"
                />
              </div>
            </div>
          </div>

          {/* --- Section 3: Flat Details --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full inline-flex justify-center items-center mr-2 text-sm font-bold">3</span>
              Flat Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Wing <span className="text-red-500">*</span></label>
                <input
                  {...register("wing", { required: "Wing is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. A"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Flat No. <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  {...register("flatNumber", { required: "Flat number is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. 203"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Flat Type</label>
                <select {...register("flatType")} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="4BHK">4BHK</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Resident Type</label>
                <select {...register("residentType")} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="Owner">Owner</option>
                  <option value="Tenant">Tenant</option>
                </select>
              </div>
            </div>
          </div>

          {/* --- Section 4: Emergency Contact --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full inline-flex justify-center items-center mr-2 text-sm font-bold">4</span>
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Contact Name</label>
                <input
                  {...register("emergencyContactName")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="Name of relative"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  type="tel"
                  {...register("emergencyContactNumber")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="Relative's 10-digit number"
                />
              </div>
            </div>
          </div>

          {/* --- Submit Button --- */}
          <div className="pt-6 border-t mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg text-white font-semibold text-lg transition-all shadow-md 
                ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
            >
              {isSubmitting ? "Saving Resident..." : isEditMode ? "Update Resident" : "Save Resident"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ResidentForm;