import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createFlat, updateFlat, fetchFlatById } from "../../../store/slices/flatSlice";

const AddEditFlat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const { singleFlat, loading } = useSelector((s) => s.flat) ?? {};
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => { if (isEdit && id) dispatch(fetchFlatById(id)); }, [id, isEdit, dispatch]);
  useEffect(() => {
    if (singleFlat && isEdit) {
      reset({
        flatNumber: singleFlat.flatNumber, floor: singleFlat.floor, block: singleFlat.block,
        type: singleFlat.type, area: singleFlat.area, status: singleFlat.status,
        occupancyType: singleFlat.occupancyType, parkingSlot: singleFlat.parkingSlot,
        monthlyMaintenance: singleFlat.monthlyMaintenance,
        ownerName: singleFlat.owner?.name, ownerPhone: singleFlat.owner?.phone, ownerEmail: singleFlat.owner?.email,
      });
    }
  }, [singleFlat, isEdit, reset]);

  const onSubmit = async (data) => {
    const payload = {
      flatNumber: data.flatNumber, floor: Number(data.floor), block: data.block, type: data.type,
      area: data.area ? Number(data.area) : undefined, status: data.status, occupancyType: data.occupancyType,
      parkingSlot: data.parkingSlot, monthlyMaintenance: data.monthlyMaintenance ? Number(data.monthlyMaintenance) : 0,
      owner: { name: data.ownerName, phone: data.ownerPhone, email: data.ownerEmail },
    };
    const res = isEdit ? await dispatch(updateFlat({ id, data: payload })) : await dispatch(createFlat(payload));
    if (res.type.endsWith("fulfilled")) navigate("/admin/flat/list");
  };

  const inp = (err) => `w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500 ${err ? "border-red-400 bg-red-50" : "border-gray-200"}`;
  const lbl = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
  const Err = ({ e }) => e ? <p className="mt-1 text-xs text-red-500">{e.message}</p> : null;
  const SH  = ({ t }) => <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><span className="flex-1 h-px bg-gray-100"/>{t}<span className="flex-1 h-px bg-gray-100"/></h3>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-start justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">{isEdit ? "Edit Flat" : "Add Flat"}</h1>
          <p className="text-sm text-gray-400">{isEdit ? "Update flat details" : "Register a new flat"}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400" />
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-5">

            <SH t="Flat Info" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Flat Number *</label>
                <input {...register("flatNumber", { required: "Flat number is required" })} placeholder="e.g. A-101" className={inp(errors.flatNumber)} />
                <Err e={errors.flatNumber} />
              </div>
              <div>
                <label className={lbl}>Floor *</label>
                <input type="number" {...register("floor", { required: "Floor is required" })} placeholder="e.g. 1" className={inp(errors.floor)} />
                <Err e={errors.floor} />
              </div>
              <div>
                <label className={lbl}>Block</label>
                <input {...register("block")} placeholder="e.g. A, B, C" className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Type *</label>
                <select {...register("type", { required: "Type is required" })} className={inp(errors.type)}>
                  <option value="">Select type</option>
                  {["1BHK","2BHK","3BHK","4BHK","Studio","Penthouse"].map(t => <option key={t}>{t}</option>)}
                </select>
                <Err e={errors.type} />
              </div>
              <div>
                <label className={lbl}>Area (sq ft)</label>
                <input type="number" {...register("area")} placeholder="e.g. 850" className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Parking Slot</label>
                <input {...register("parkingSlot")} placeholder="e.g. P-12" className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Status</label>
                <select {...register("status")} className={inp(false)}>
                  <option value="Vacant">Vacant</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Occupancy Type</label>
                <select {...register("occupancyType")} className={inp(false)}>
                  <option value="Vacant">Vacant</option>
                  <option value="Owner">Owner</option>
                  <option value="Tenant">Tenant</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className={lbl}>Monthly Maintenance (₹)</label>
                <input type="number" {...register("monthlyMaintenance")} placeholder="e.g. 2000" className={inp(false)} />
              </div>
            </div>

            <SH t="Owner Details" />
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={lbl}>Owner Name</label>
                <input {...register("ownerName")} placeholder="Full name" className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Owner Phone</label>
                <input {...register("ownerPhone")} placeholder="Phone number" className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Owner Email</label>
                <input type="email" {...register("ownerEmail")} placeholder="Email address" className={inp(false)} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button type="submit" disabled={loading} className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg flex items-center gap-2">
                {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Saving...</> : isEdit ? "Update Flat" : "Add Flat"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditFlat;