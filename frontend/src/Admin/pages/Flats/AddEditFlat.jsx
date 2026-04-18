import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createFlat, updateFlat, fetchFlatById, fetchFlats } from "../../../store/slices/flatSlice";

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

const labelClass = "admin-label";
const errorClass = "mt-1 text-[10px] font-bold text-red-500 uppercase tracking-tight";

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

  const allFlats = useSelector((state) => state.flat?.list ?? []);
  const selectedWing = watch("wing");

  const flatNumbers = (() => {
    if (!selectedFloor || !FLOOR_MAPPING[selectedFloor]) return [];
    const [start, end] = FLOOR_MAPPING[selectedFloor].range;
    const count = end - start + 1;
    const nums = [];
    
    for (let i = 1; i <= count; i++) {
      const flatNum = (Number(selectedFloor) * 100 + i).toString();
      
      // Check if this flat (number + wing) already exists in our society
      const isDuplicate = allFlats.some(f => 
        f.flatNumber === flatNum && 
        f.wing === selectedWing &&
        (!isEdit || f._id !== id) // Allow the current flat to be visible in the list during edit
      );

      if (!isDuplicate) {
        nums.push(flatNum);
      }
    }
    return nums;
  })();

  useEffect(() => {
    dispatch(fetchFlats({ limit: 1000 })); 
    if (isEdit && id) dispatch(fetchFlatById(id));
  }, [id, isEdit, dispatch]);

  useEffect(() => {
    if (singleFlat && isEdit) {
      reset({
        flatNumber: singleFlat.flatNumber,
        floor: singleFlat.floor,
        wing: singleFlat.wing,
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
      wing: data.wing,
      type: data.type,
      status: data.status,
      occupancyType: data.occupancyType || "Vacant",
      monthlyMaintenance: data.monthlyMaintenance ? Number(data.monthlyMaintenance) : 0,
      owner: {
        name: data.ownerName || "",
        phone: data.ownerPhone || "",
        email: data.ownerEmail || "",
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <div className="admin-form-group">
            <label className={labelClass}>Block / Wing *</label>
            <select {...register("wing", { required: "Block/Wing is required" })} className="admin-input">
              <option value="">Select Wing</option>
              <option value="A">WING A</option>
              <option value="B">WING B</option>
              <option value="C">WING C</option>
              <option value="D">WING D</option>
            </select>
            {errors.wing && <p className={errorClass}>{errors.wing.message}</p>}
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Floor *</label>
            <select {...register("floor", { required: "Floor is required" })} className="admin-input">
              <option value="">Select Floor</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Floor {i + 1}
                </option>
              ))}
            </select>
            {errors.floor && <p className={errorClass}>{errors.floor.message}</p>}
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Flat Number *</label>
            <select {...register("flatNumber", { required: "Flat number is required" })} className="admin-input">
              <option value="">Select Flat</option>
              {flatNumbers.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            {errors.flatNumber && <p className={errorClass}>{errors.flatNumber.message}</p>}
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Flat Type *</label>
            <input
              {...register("type", { required: "Flat type is required" })}
              readOnly
              className="admin-input bg-gray-50 cursor-not-allowed"
            />
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Monthly Maintenance (Rs.)</label>
            <input type="number" {...register("monthlyMaintenance")} className="admin-input" placeholder="e.g. 2500" />
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Status</label>
            <select {...register("status")} className="admin-input">
              <option value="Vacant">Vacant</option>
              <option value="Occupied">Occupied</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Occupancy Type</label>
            <select {...register("occupancyType")} className="admin-input">
              <option value="">Select Occupancy Type</option>
              <option value="Owner">Owner</option>
              <option value="Tenant">Tenant</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Owner Name</label>
            <input {...register("ownerName")} className="admin-input" placeholder="Full Name" />
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Owner Phone</label>
            <input {...register("ownerPhone")} className="admin-input" placeholder="+91 XXXXX XXXXX" />
          </div>

          <div className="admin-form-group">
            <label className={labelClass}>Owner Email</label>
            <input type="email" {...register("ownerEmail")} className="admin-input" placeholder="email@example.com" />
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
