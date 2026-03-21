import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    createVisitor,
    updateVisitor,
    fetchVisitorById,
} from "../../../store/slices/visitorSlice";
import { fetchResidents } from "../../../store/slices/residentSlice";

const AddVisitor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isEditMode = Boolean(id);

    const { residents } = useSelector((state) => state.resident);
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
    });

    const selectedResidentId = watch("visitingResident");
    // 🔥 Fetch residents
    useEffect(() => {
        dispatch(fetchResidents());
    }, [dispatch]);

    // 🔥 Fetch visitor if edit
    useEffect(() => {
        if (isEditMode) {
            dispatch(fetchVisitorById(id));
        }
    }, [id, isEditMode, dispatch]);

    useEffect(() => {
        if (selectedResidentId) {
            const selected = residents.find(r => r._id === selectedResidentId);

            if (selected) {
                setValue("wing", selected.wing);
                setValue("flatNumber", selected.flatNumber);
            }
        }
    }, [selectedResidentId, residents, setValue]);
    // 🔥 Populate form (EDIT MODE)
    useEffect(() => {
        if (singleVisitor && isEditMode) {
            reset({
                visitorName: singleVisitor.visitorName || "",
                mobileNumber: singleVisitor.mobileNumber || "",
                purpose: singleVisitor.purpose || "",
                visitingResident: singleVisitor.visitingResident?._id || "",
                wing: singleVisitor.wing || "",             // ✅ ADD
                flatNumber: singleVisitor.flatNumber || "", // ✅ ADD
                status: singleVisitor.status || "Inside",
            });
        }
    }, [singleVisitor, isEditMode, reset]);

    // 🔥 Submit
    const onSubmit = async (data) => {
        if (isEditMode) {
            const result = await dispatch(updateVisitor({ id, data }));
            if (result.type.endsWith("fulfilled")) {
                setTimeout(() => navigate("/admin/visitors"), 1000);
            }
        } else {
            const result = await dispatch(createVisitor(data));
            if (result.type.endsWith("fulfilled")) {
                reset();
                setTimeout(() => navigate("/admin/visitors"), 1000);
            }
        }
    };

    if (loading && isEditMode) {
        return (
            <div className="text-center p-6">Loading visitor...</div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
            <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8 border">

                {/* HEADER */}
                <div className="mb-8 border-b pb-4">
                    <h2 className="text-3xl font-bold">
                        {isEditMode ? "Edit Visitor" : "Add Visitor"}
                    </h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Visitor Details */}
                    <div className="grid md:grid-cols-3 gap-6">

                        <div>
                            <label>Visitor Name *</label>
                            <input
                                {...register("visitorName", { required: "Required" })}
                                className="w-full border px-4 py-2 mt-1 rounded"
                            />
                            {errors.visitorName && <span className="text-red-500 text-xs">{errors.visitorName.message}</span>}
                        </div>

                        <div>
                            <label>Mobile *</label>
                            <input
                                {...register("mobileNumber", {
                                    required: "Required",
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: "Invalid number",
                                    },
                                })}
                                className="w-full border px-4 py-2 mt-1 rounded"
                            />
                            {errors.mobileNumber && <span className="text-red-500 text-xs">{errors.mobileNumber.message}</span>}
                        </div>

                        <div>
                            <label>Purpose</label>
                            <input
                                {...register("purpose")}
                                className="w-full border px-4 py-2 mt-1 rounded"
                            />
                        </div>

                    </div>

                    {/* Resident */}
                    <div>
                        <label>Select Resident *</label>
                        <select
                            {...register("visitingResident", { required: "Required" })}
                            className="w-full border px-4 py-2 mt-1 rounded"
                        >
                            <option value="">Select Resident</option>

                            {residents.map((r) => (
                                <option key={r._id} value={r._id}>
                                    {r.fullName} ({r.wing}-{r.flatNumber})
                                </option>
                            ))}
                        </select>
                        {errors.visitingResident && <span className="text-red-500 text-xs">{errors.visitingResident.message}</span>}
                    </div>
                    <div>
                        {/* Wing */}
                        <input
                            {...register("wing")}
                            readOnly
                            className="w-full border px-4 py-2 mt-1 rounded bg-gray-100"
                        />
                        {/* Wing */}
                        <input
                            {...register("flatNumber")}
                            readOnly
                            className="w-full border px-4 py-2 mt-1 rounded bg-gray-100"
                        />
                    </div>
                    <div>
                        <label>Status *</label>
                        <select
                            {...register("status", { required: "Status is required" })}
                            className="w-full border px-4 py-2 mt-1 rounded"
                        >
                            <option value="Inside">Inside</option>
                            <option value="Exited">Outside</option>
                        </select>

                        {errors.status && (
                            <span className="text-red-500 text-xs">
                                {errors.status.message}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-5 py-2 bg-gray-200 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2 bg-blue-600 text-white rounded"
                            disabled={loading}
                        >
                            {loading
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

export default AddVisitor;