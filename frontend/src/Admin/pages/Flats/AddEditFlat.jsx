import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createFlat, updateFlat, fetchFlatById } from "../../../store/slices/flatSlice";

const FLOOR_MAPPING = {
  1: { range: [1, 6], type: "2BHK" },
  2: { range: [7, 12], type: "3BHK" },
  3: { range: [13, 19], type: "4BHK" },
  4: { range: [20, 26], type: "2BHK" },
  5: { range: [27, 32], type: "3BHK" },
  6: { range: [33, 38], type: "4BHK" },
  7: { range: [39, 45], type: "2BHK" },
  8: { range: [46, 52], type: "3BHK" },
  9: { range: [53, 59], type: "4BHK" },
  10: { range: [60, 66], type: "2BHK" },
  11: { range: [67, 73], type: "3BHK" },
  12: { range: [74, 80], type: "4BHK" },
};

const inputClass =
  "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1";
const errorClass = "mt-1 text-xs text-red-500";

const AddEditFlat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { singleFlat, loading } = useSelector((state) => state.flat) ?? {};
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const selectedFloor = watch("floor");

  useEffect(() => {
    if (selectedFloor && FLOOR_MAPPING[selectedFloor]) {
      setValue("type", FLOOR_MAPPING[selectedFloor].type);
    }
  }, [selectedFloor, setValue]);

  const flatNumbers = (() => {
    if (!selectedFloor || !FLOOR_MAPPING[selectedFloor]) return [];
    const [start, end] = FLOOR_MAPPING[selectedFloor].range;
    const count = end - start + 1;
    const nums = [];
    for (let i = 1; i <= count; i++) {
      // Formats as 101, 102... or 1201, 1202...
      nums.push((Number(selectedFloor) * 100 + i).toString());
    }
    return nums;
  })();

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
        status: singleFlat.status,
        occupancyType: singleFlat.occupancyType,
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
      status: data.status,
      occupancyType: data.occupancyType,
      monthlyMaintenance: data.monthlyMaintenance ? Number(data.monthlyMaintenance) : 0,
      owner: {
        name: data.ownerName,
        phone: data.ownerPhone,
        email: data.ownerEmail,
      },
    };

    const res = isEdit
      ? await dispatch(updateFlat({ id, data: payload }))
      : await dispatch(createFlat(payload));

    if (res.type.endsWith("fulfilled")) navigate("/admin/flat/list");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Edit" : "Add"} Flat</h1>
          <p className="text-sm text-gray-500">
            {isEdit ? "Update" : "Create"} flat details in the same clean style as the event form.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Block / Wing *</label>
            <select {...register("block", { required: "Block/Wing is required" })} className={inputClass}>
              <option value="">Select Wing</option>
              <option value="WING A">WING A</option>
              <option value="WING B">WING B</option>
              <option value="WING C">WING C</option>
              <option value="WING D">WING D</option>
            </select>
            {errors.block && <p className={errorClass}>{errors.block.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Floor *</label>
            <select {...register("floor", { required: "Floor is required" })} className={inputClass}>
              <option value="">Select Floor</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Floor {i + 1}
                </option>
              ))}
            </select>
            {errors.floor && <p className={errorClass}>{errors.floor.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Flat Number *</label>
            <select {...register("flatNumber", { required: "Flat number is required" })} className={inputClass}>
              <option value="">Select Flat</option>
              {flatNumbers.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            {errors.flatNumber && <p className={errorClass}>{errors.flatNumber.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Flat Type *</label>
            <input
              {...register("type", { required: "Flat type is required" })}
              readOnly
              className={`${inputClass} bg-gray-100 cursor-not-allowed`}
            />
          </div>

          <div>
            <label className={labelClass}>Monthly Maintenance (Rs.)</label>
            <input type="number" {...register("monthlyMaintenance")} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select {...register("status")} className={inputClass}>
              <option value="Vacant">Vacant</option>
              <option value="Occupied">Occupied</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Occupancy Type</label>
            <select {...register("occupancyType")} className={inputClass}>
              <option value="">Select Occupancy Type</option>
              <option value="Owner">Owner</option>
              <option value="Tenant">Tenant</option>
            </select>
          </div>


        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Owner Name</label>
            <input {...register("ownerName")} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Owner Phone</label>
            <input {...register("ownerPhone")} className={inputClass} />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Owner Email</label>
            <input type="email" {...register("ownerEmail")} className={inputClass} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => navigate("/admin/flat/list")}
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            {loading ? "Saving..." : isEdit ? "Update Flat" : "Create Flat"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditFlat;
