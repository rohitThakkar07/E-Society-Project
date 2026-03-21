import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createBooking,
  updateBooking,
  fetchBookingById,
} from "../../../store/slices/facilityBookingSlice";

const BookingForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const { singleBooking, loading } = useSelector(
    (state) => state.booking
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // 🔥 Fetch edit data
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchBookingById(id));
    }
  }, [id, isEditMode, dispatch]);

  // 🔥 Populate form
  useEffect(() => {
    if (singleBooking && isEditMode) {
      reset({
        resident: singleBooking.resident || "",
        facility: singleBooking.facility || "",
        date: singleBooking.date?.split("T")[0] || "",
        timeSlot: singleBooking.timeSlot || "",
        purpose: singleBooking.purpose || "",
        paymentMode: singleBooking.paymentMode || "",
      });
    }
  }, [singleBooking, isEditMode, reset]);

  const onSubmit = async (data) => {
    if (isEditMode) {
      const res = await dispatch(updateBooking({ id, data }));
      if (res.type.endsWith("fulfilled")) {
        navigate("/facility/list");
      }
    } else {
      const res = await dispatch(createBooking(data));
      if (res.type.endsWith("fulfilled")) {
        reset();
        navigate("/facility/list");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Booking" : "New Booking"}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow max-w-3xl">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <input {...register("resident", { required: true })} placeholder="Flat" className="w-full border p-2" />

          <select {...register("facility", { required: true })}>
            <option value="">Facility</option>
            <option value="Gym">Gym</option>
            <option value="Hall">Hall</option>
            <option value="Swimming Pool">Pool</option>
          </select>

          <input type="date" {...register("date", { required: true })} />

          <select {...register("timeSlot", { required: true })}>
            <option value="">Time Slot</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>

          <textarea {...register("purpose", { required: true })} />

          <select {...register("paymentMode", { required: true })}>
            <option value="">Payment</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
          </select>

          <button className="bg-blue-600 text-white px-6 py-2 rounded">
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Booking"
              : "Create Booking"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default BookingForm;