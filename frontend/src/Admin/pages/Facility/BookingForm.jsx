import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const BookingForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Booking Data:", data);

    // TODO: Send data to backend API
    // axios.post("/api/facility/book", data)

    alert("Booking Submitted Successfully!");
    reset();
    navigate("/facility/list");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">New Facility Booking</h1>
        <p className="text-gray-500">Book Gym, Hall or Swimming Pool</p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* RESIDENT NAME */}
          <div>
            <label className="block mb-2 font-medium">Resident / Flat</label>
            <input
              type="text"
              placeholder="Enter Flat Number"
              {...register("resident", {
                required: "Resident is required",
              })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.resident && (
              <p className="text-red-500 text-sm mt-1">
                {errors.resident.message}
              </p>
            )}
          </div>

          {/* FACILITY */}
          <div>
            <label className="block mb-2 font-medium">Select Facility</label>
            <select
              {...register("facility", {
                required: "Facility is required",
              })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Facility</option>
              <option value="Gym">Gym</option>
              <option value="Hall">Community Hall</option>
              <option value="Swimming Pool">Swimming Pool</option>
            </select>
            {errors.facility && (
              <p className="text-red-500 text-sm mt-1">
                {errors.facility.message}
              </p>
            )}
          </div>

          {/* DATE */}
          <div>
            <label className="block mb-2 font-medium">Booking Date</label>
            <input
              type="date"
              {...register("date", {
                required: "Booking date is required",
              })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* TIME SLOT */}
          <div>
            <label className="block mb-2 font-medium">Time Slot</label>
            <select
              {...register("timeSlot", {
                required: "Time slot is required",
              })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Time Slot</option>
              <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
              <option value="10:00 AM - 02:00 PM">10:00 AM - 02:00 PM</option>
              <option value="02:00 PM - 06:00 PM">02:00 PM - 06:00 PM</option>
              <option value="06:00 PM - 10:00 PM">06:00 PM - 10:00 PM</option>
            </select>
            {errors.timeSlot && (
              <p className="text-red-500 text-sm mt-1">
                {errors.timeSlot.message}
              </p>
            )}
          </div>

          {/* PURPOSE */}
          <div>
            <label className="block mb-2 font-medium">Purpose</label>
            <textarea
              rows="3"
              placeholder="Enter purpose of booking"
              {...register("purpose", {
                required: "Purpose is required",
                minLength: {
                  value: 5,
                  message: "Purpose must be at least 5 characters",
                },
              })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            ></textarea>
            {errors.purpose && (
              <p className="text-red-500 text-sm mt-1">
                {errors.purpose.message}
              </p>
            )}
          </div>

          {/* PAYMENT MODE */}
          <div>
            <label className="block mb-2 font-medium">Payment Mode</label>
            <select
              {...register("paymentMode", {
                required: "Payment mode is required",
              })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Payment Mode</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
            </select>
            {errors.paymentMode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.paymentMode.message}
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Submit Booking
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default BookingForm;