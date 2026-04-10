import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createVisitor,
  updateVisitor,
  fetchVisitorById,
} from "../../../store/slices/visitorSlice";
import { fetchResidents } from "../../../store/slices/residentSlice";

const inputClass =
  "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1";
const errorClass = "mt-1 text-xs text-red-500";

const AddVisitor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = Boolean(id);

  const { residents = [] } = useSelector((state) => state.resident);
  const { singleVisitor, loading } = useSelector((state) => state.visitor);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: { status: "Inside" },
  });

  const selectedResidentId = watch("visitingResident");

  useEffect(() => {
    dispatch(fetchResidents());
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchVisitorById(id));
    }
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (selectedResidentId) {
      const selected = residents.find((resident) => resident._id === selectedResidentId);
      if (selected) {
        setValue("wing", selected.wing || selected.block || "");
        setValue("flatNumber", selected.flatNumber || "");
      }
    }
  }, [selectedResidentId, residents, setValue]);

  useEffect(() => {
    if (singleVisitor && isEditMode) {
      reset({
        visitorName: singleVisitor.visitorName || "",
        mobileNumber: singleVisitor.mobileNumber || "",
        purpose: singleVisitor.purpose || "",
        visitingResident: singleVisitor.visitingResident?._id || "",
        wing: singleVisitor.wing || "",
        flatNumber: singleVisitor.flatNumber || "",
        status: singleVisitor.status || "Inside",
      });
    }
  }, [singleVisitor, isEditMode, reset]);

  const onSubmit = async (data) => {
    if (isEditMode) {
      const result = await dispatch(updateVisitor({ id, data }));
      if (result.type.endsWith("fulfilled")) navigate("/admin/visitors");
      return;
    }
  };

    const result = await dispatch(createVisitor(data));
    if (result.type.endsWith("fulfilled")) {
      reset();
      navigate("/admin/visitors");
    }
  };

  if (loading && isEditMode) {
    return <div className="text-center p-6">Loading visitor...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit" : "Add"} Visitor</h1>
          <p className="text-sm text-gray-500">
            {isEditMode ? "Update" : "Create"} visitor details in the same style as the event form.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Visitor Name *</label>
            <input {...register("visitorName", { required: "Visitor name is required" })} className={inputClass} />
            {errors.visitorName && <p className={errorClass}>{errors.visitorName.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Mobile Number *</label>
            <input
              {...register("mobileNumber", {
                required: "Mobile number is required",
                pattern: { value: /^[0-9]{10}$/, message: "Invalid number" },
              })}
              className={inputClass}
            />
            {errors.mobileNumber && <p className={errorClass}>{errors.mobileNumber.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Purpose</label>
            <input {...register("purpose")} className={inputClass} placeholder="Why is the visitor coming?" />
          </div>

          <div>
            <label className={labelClass}>Status *</label>
            <select {...register("status", { required: "Status is required" })} className={inputClass}>
              <option value="Inside">Inside</option>
              <option value="Exited">Outside</option>
            </select>
            {errors.status && <p className={errorClass}>{errors.status.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Select Resident *</label>
            <select {...register("visitingResident", { required: "Resident is required" })} className={inputClass}>
              <option value="">Select Resident</option>
              {residents.map((resident) => {
                const wing = resident.wing || resident.block || "";
                const flat = resident.flatNumber || "";
                // If flatNumber already starts with the wing (e.g. "B-137" starts with "B"), don't prepend wing again
                const flatDisplay = flat.startsWith(wing) ? flat : `${wing}-${flat}`;
                
                return (
                  <option key={resident._id} value={resident._id}>
                    {resident.firstName} {resident.lastName} ({flatDisplay})
                  </option>
                );
              })}

            </select>
            {errors.visitingResident && <p className={errorClass}>{errors.visitingResident.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Wing</label>
            <input {...register("wing")} readOnly className={`${inputClass} bg-gray-50`} />
          </div>

          <div>
            <label className={labelClass}>Flat Number</label>
            <input {...register("flatNumber")} readOnly className={`${inputClass} bg-gray-50`} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/visitors")}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" disabled={loading}>
            {loading ? "Saving..." : isEditMode ? "Update Visitor" : "Create Visitor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVisitor;
