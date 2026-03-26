import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createFlat, updateFlat, fetchFlatById } from "../../../store/slices/flatSlice";
import { FiArrowLeft, FiSave } from "react-icons/fi";

const AddEditFlat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { singleFlat, loading } = useSelector((s) => s.flat) ?? {};
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => { 
    if (isEdit && id) dispatch(fetchFlatById(id)); 
  }, [id, isEdit, dispatch]);

  useEffect(() => {
    if (singleFlat && isEdit) {
      reset({
        flatNumber: singleFlat.flatNumber,
        floor: singleFlat.floor,
        block: singleFlat.block,
        type: singleFlat.type,
        area: singleFlat.area,
        status: singleFlat.status,
        occupancyType: singleFlat.occupancyType,
        parkingSlot: singleFlat.parkingSlot,
        monthlyMaintenance: singleFlat.monthlyMaintenance,
        ownerName: singleFlat.owner?.name,
        ownerPhone: singleFlat.owner?.phone,
        ownerEmail: singleFlat.owner?.email,
      });
    }
  }, [singleFlat, isEdit, reset]);

  const onSubmit = async (data) => {
    const payload = {
      flatNumber: data.flatNumber,
      floor: Number(data.floor),
      block: data.block,
      type: data.type,
      area: data.area ? Number(data.area) : undefined,
      status: data.status,
      occupancyType: data.occupancyType,
      parkingSlot: data.parkingSlot,
      monthlyMaintenance: data.monthlyMaintenance ? Number(data.monthlyMaintenance) : 0,
      owner: {
        name: data.ownerName,
        phone: data.ownerPhone,
        email: data.ownerEmail
      },
    };
    
    const res = isEdit 
      ? await dispatch(updateFlat({ id, data: payload })) 
      : await dispatch(createFlat(payload));

    if (res.type.endsWith("fulfilled")) navigate("/admin/flat/list");
  };

  const inp = (err) => `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500 ${err ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"}`;
  const lbl = "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1";

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-2xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 font-medium transition-colors">
          <FiArrowLeft /> Back to List
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50">
            <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit Flat Details" : "Register New Flat"}</h1>
            <p className="text-sm text-gray-400">Enter accurate inventory information for society management.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={lbl}>Flat Number *</label>
                <input {...register("flatNumber", { required: "Required" })} placeholder="e.g. A-101" className={inp(errors.flatNumber)} />
              </div>
              <div>
                <label className={lbl}>Floor *</label>
                <input type="number" {...register("floor", { required: "Required" })} className={inp(errors.floor)} />
              </div>
              <div>
                <label className={lbl}>Block / Wing</label>
                <input {...register("block")} placeholder="e.g. Wing-A" className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Flat Type *</label>
                <select {...register("type", { required: "Required" })} className={inp(errors.type)}>
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="4BHK">4BHK</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Area (sq ft)</label>
                <input type="number" {...register("area")} className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Monthly Maintenance (₹)</label>
                <input type="number" {...register("monthlyMaintenance")} className={inp(false)} />
              </div>
            </div>

            <hr className="border-gray-50" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={lbl}>Owner Name</label>
                <input {...register("ownerName")} className={inp(false)} />
              </div>
              <div>
                <label className={lbl}>Owner Phone</label>
                <input {...register("ownerPhone")} className={inp(false)} />
              </div>
              <div className="md:col-span-2">
                <label className={lbl}>Owner Email</label>
                <input type="email" {...register("ownerEmail")} className={inp(false)} />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
              <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2">
                {loading ? "Saving..." : <><FiSave /> {isEdit ? "Update Flat" : "Add Flat"}</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditFlat;