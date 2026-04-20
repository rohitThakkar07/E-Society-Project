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
        setValue("wing", selected.wing || "");
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

    const result = await dispatch(createVisitor(data));
    if (result.type.endsWith("fulfilled")) {
      reset();
      navigate("/admin/visitors");
    }
  };

  if (loading && isEditMode) {
    return <div className="text-center p-12 text-slate-400 font-black uppercase tracking-widest text-xs">Loading visitor...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-['Inter',_sans-serif]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {isEditMode ? "Manage" : "Direct Entry"} Registry
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              {isEditMode ? "Update" : "Register"} visitor entry directly into the inside logs.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Resident Being Visited *</label>
            <select {...register("visitingResident", { required: "Resident is required" })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
              <option value="">Search resident...</option>
              {residents.map((resident) => {
                const wing = resident.wing || "";
                const flat = resident.flatNumber || "";
                const flatDisplay = flat.startsWith(wing) ? flat : `${wing}-${flat}`;
                return (
                  <option key={resident._id} value={resident._id}>
                    {resident.firstName} {resident.lastName} ({flatDisplay})
                  </option>
                );
              })}
            </select>
          </div>

          <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Visitor Name *</label>
             <input {...register("visitorName", { required: "Visitor name is required" })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" placeholder="Legal name" />
          </div>

          <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Contact Number *</label>
             <input {...register("mobileNumber", { required: "Mobile is required" })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" placeholder="Mobile" />
          </div>

          <div className="md:col-span-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Purpose / Observation</label>
             <input {...register("purpose")} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" placeholder="Note purpose of entry" />
          </div>

          {/* Hidden but required for submission logic consistency */}
          <input type="hidden" {...register("status")} />
        </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => navigate("/admin/visitors")} className="admin-btn-secondary">Cancel</button>
            <button type="submit" className="admin-btn-primary">
              {isEditMode ? "Update Log" : "Allow Entry Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVisitor;
