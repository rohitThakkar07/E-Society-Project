import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchResidentById, createResident, updateResident } from "../../../store/slices/residentSlice";
import { fetchFlats } from "../../../store/slices/flatSlice"; // Import flat fetcher

const ResidentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditMode = Boolean(id);

  const { singleResident, loading } = useSelector((state) => state.resident);
  const { list: flats } = useSelector((state) => state.flat); // Get flats from store

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: { status: "Active", residentType: "Owner" },
  });

  useEffect(() => {
    dispatch(fetchFlats()); // Fetch flats to populate dropdown
    if (isEditMode) dispatch(fetchResidentById(id));
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (singleResident && isEditMode) {
      reset({
        ...singleResident,
        flat: singleResident.flat?._id || singleResident.flat,
        dateOfBirth: singleResident.dateOfBirth?.split("T")[0] || "",
        moveInDate: singleResident.moveInDate?.split("T")[0] || "",
      });
    }
  }, [singleResident, isEditMode, reset]);

  const onSubmit = async (data) => {
  // 1. Find the full flat object from the list using the selected ID
  const selectedFlat = flats.find((f) => f._id === data.flat);

  if (!selectedFlat) {
    alert("Please select a valid flat");
    return;
  }

  // 2. Prepare the payload exactly as the backend validation expects
  const formattedData = {
    ...data,
    // Add these fields explicitly so express-validator doesn't fail
    wing: selectedFlat.wing || selectedFlat.block, // Fallback if you use block/wing interchangeably
    flatNumber: selectedFlat.flatNumber,
    floorNumber: Number(selectedFlat.floor),
    flatType: selectedFlat.type,
    
    // Ensure numbers are numbers
    mobileNumber: data.mobileNumber.toString(),
  };

  if (isEditMode) {
    const result = await dispatch(updateResident({ id, formData: formattedData }));
    if (result.type.endsWith('fulfilled')) navigate("/admin/residents");
  } else {
    const result = await dispatch(createResident(formattedData));
    if (result.type.endsWith('fulfilled')) navigate("/admin/residents");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">{isEditMode ? "Edit" : "Add"} Resident</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Names */}
          <Input label="First Name *" name="firstName" reg={register} req="Required" err={errors.firstName} />
          <Input label="Last Name" name="lastName" reg={register} />

          {/* Identity */}
          <Select label="Gender *" name="gender" reg={register} req="Required" err={errors.gender} options={["Male", "Female"]} />
          <Input label="DOB" name="dateOfBirth" type="date" reg={register} />

          {/* Contact */}
          <Input label="Mobile *" name="mobileNumber" reg={register} req="10 digits required" pattern={/^[0-9]{10}$/} err={errors.mobileNumber} />
          <Input label="Email" name="email" type="email" reg={register} />

          {/* IMPORTANT: Flat Selection */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Assign Flat *</label>
            <select 
              {...register("flat", { required: "Assigning a flat is required" })}
              className="mt-1 border border-gray-300 rounded-lg p-2.5 bg-white"
            >
              <option value="">Select a Flat</option>
              {flats.map(f => (
                <option key={f._id} value={f._id}>{f.wing}-{f.flatNumber} ({f.type})</option>
              ))}
            </select>
            {errors.flat && <span className="text-red-500 text-xs">{errors.flat.message}</span>}
          </div>

          <Select label="Resident Type *" name="residentType" reg={register} options={["Owner", "Tenant"]} />
          <Input label="Move In Date" name="moveInDate" type="date" reg={register} />
          <Select label="Status" name="status" reg={register} options={["Active", "Inactive"]} />

          {!isEditMode && <Input label="Password *" name="password" type="password" reg={register} req="Min 6 chars" minL={6} err={errors.password} />}

          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-indigo-600 text-white rounded-lg">
              {loading ? "Saving..." : "Save Resident"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper Mini-Components
const Input = ({ label, name, type="text", reg, req=false, err, pattern, minL }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input type={type} {...reg(name, { required: req, pattern, minLength: minL })} className={`mt-1 border rounded-lg p-2.5 ${err ? 'border-red-500' : 'border-gray-300'}`} />
    {err && <span className="text-red-500 text-xs">{err.message}</span>}
  </div>
);

const Select = ({ label, name, reg, options, req=false, err }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select {...reg(name, { required: req })} className="mt-1 border border-gray-300 rounded-lg p-2.5 bg-white">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    {err && <span className="text-red-500 text-xs">{err.message}</span>}
  </div>
);

export default ResidentForm;