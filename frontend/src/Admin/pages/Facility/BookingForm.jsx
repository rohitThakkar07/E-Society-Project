import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createBooking,
  updateBooking,
  fetchBookingById,
  checkAvailability,
  clearBookedSlots,
} from "../../../store/slices/facilityBookingSlice";
import { fetchFacilities } from "../../../store/slices/facilitySlice";

// Time slots available for booking
const TIME_SLOTS = [
  { label: "Morning   06:00 – 09:00", start: "06:00", end: "09:00" },
  { label: "Forenoon  09:00 – 12:00", start: "09:00", end: "12:00" },
  { label: "Afternoon 12:00 – 15:00", start: "12:00", end: "15:00" },
  { label: "Evening   15:00 – 18:00", start: "15:00", end: "18:00" },
  { label: "Night     18:00 – 21:00", start: "18:00", end: "21:00" },
];

// Returns true if this slot overlaps any already-booked slot
const isSlotBooked = (slot, bookedSlots) =>
  bookedSlots.some((b) => slot.start < b.endTime && slot.end > b.startTime);

const BookingForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { singleBooking, loading, bookedSlots, availabilityLoading } =
    useSelector((state) => state.booking);
  const { facilities } = useSelector((state) => state.facility);

  const [residents, setResidents] = useState([]);
  const [residentsLoading, setResidentsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const watchFacility = watch("facility");
  const watchDate = watch("bookingDate");

  // Fetch facilities and residents on mount
  useEffect(() => {
    dispatch(fetchFacilities());
    loadResidents();
    return () => dispatch(clearBookedSlots());
  }, [dispatch]);

  const loadResidents = async () => {
    try {
      setResidentsLoading(true);
      const { default: API } = await import("../../../service/api");
      // Replace /resident/list with your actual residents endpoint
      const res = await API.get("/resident/list");
      setResidents(res.data.data || []);
    } catch {
      setResidents([]);
    } finally {
      setResidentsLoading(false);
    }
  };

  // Fetch booking data in edit mode
  useEffect(() => {
    if (isEditMode && id) dispatch(fetchBookingById(id));
  }, [id, isEditMode, dispatch]);

  // Populate form in edit mode
  useEffect(() => {
    if (singleBooking && isEditMode) {
      reset({
        facility: singleBooking.facility?._id || singleBooking.facility || "",
        resident: singleBooking.resident?._id || singleBooking.resident || "",
        bookingDate: singleBooking.bookingDate?.split("T")[0] || "",
        startTime: singleBooking.startTime || "",
        endTime: singleBooking.endTime || "",
        purpose: singleBooking.purpose || "",
      });
    }
  }, [singleBooking, isEditMode, reset]);

  // Check availability when facility OR date changes
  useEffect(() => {
    if (watchFacility && watchDate) {
      dispatch(checkAvailability({ facilityId: watchFacility, bookingDate: watchDate }));
      setValue("startTime", "");
      setValue("endTime", "");
    }
  }, [watchFacility, watchDate, dispatch, setValue]);

  const onSubmit = async (data) => {
    // Send ObjectIds + correct model field names — no more plain strings
    const payload = {
      facility: data.facility,       // ObjectId
      resident: data.resident,       // ObjectId
      bookingDate: data.bookingDate, // matches model field
      startTime: data.startTime,     // matches model field
      endTime: data.endTime,         // matches model field
      purpose: data.purpose,
    };

    if (isEditMode) {
      const res = await dispatch(updateBooking({ id, data: payload }));
      if (res.type.endsWith("fulfilled")) navigate("/admin/facility-booking/list");
    } else {
      const res = await dispatch(createBooking(payload));
      if (res.type.endsWith("fulfilled")) {
        reset();
        navigate("/admin/facility-booking/list");
      }
    }
  };

  // Styling helpers
  const inputClass = (hasError) =>
    `w-full px-4 py-2.5 rounded-lg border text-sm text-gray-800 bg-white transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      hasError ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
    }`;
  const labelClass =
    "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  const ErrorMsg = ({ error }) =>
    error ? (
      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
        <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error.message}
      </p>
    ) : null;

  const SectionHeading = ({ step, title }) => (
    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
        {step}
      </span>
      {title}
    </h2>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-start justify-center">
      <div className="w-full max-w-2xl">

        {/* PAGE HEADER */}
        <div className="mb-8">
          <button type="button" onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {isEditMode ? "Edit Booking" : "New Booking"}
              </h1>
              <p className="text-sm text-gray-400">
                {isEditMode ? "Update facility booking details" : "Reserve a facility for a resident"}
              </p>
            </div>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400" />

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-7">

            {/* ── 1: Resident ── */}
            <div>
              <SectionHeading step="1" title="Resident" />
              <label className={labelClass}>Select Resident *</label>
              <select
                {...register("resident", { required: "Please select a resident" })}
                className={inputClass(errors.resident)}
                disabled={residentsLoading}
              >
                <option value="">
                  {residentsLoading ? "Loading residents..." : "Select resident"}
                </option>
                {residents.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name} — {r.flatNumber || r.flat || ""}
                  </option>
                ))}
              </select>
              <ErrorMsg error={errors.resident} />
            </div>

            <div className="border-t border-dashed border-gray-100" />

            {/* ── 2: Facility & Date ── */}
            <div>
              <SectionHeading step="2" title="Facility & Date" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Facility dropdown — sends _id (ObjectId) */}
                <div>
                  <label className={labelClass}>Facility *</label>
                  <select
                    {...register("facility", { required: "Please select a facility" })}
                    className={inputClass(errors.facility)}
                  >
                    <option value="">Select facility</option>
                    {facilities
                      .filter((f) => f.status === "Available")
                      .map((f) => (
                        <option key={f._id} value={f._id}>
                          {f.name}{f.location ? ` — ${f.location}` : ""}
                        </option>
                      ))}
                  </select>
                  <ErrorMsg error={errors.facility} />
                </div>

                {/* Booking Date */}
                <div>
                  <label className={labelClass}>Booking Date *</label>
                  <input
                    type="date"
                    {...register("bookingDate", { required: "Date is required" })}
                    className={inputClass(errors.bookingDate)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <ErrorMsg error={errors.bookingDate} />
                </div>
              </div>

              {/* Availability banner — shown after facility + date selected */}
              {watchFacility && watchDate && (
                <div className="mt-4">
                  {availabilityLoading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 rounded-lg px-4 py-3">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Checking availability...
                    </div>
                  ) : bookedSlots.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      All time slots are available for this date!
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
                      <p className="text-sm font-medium text-amber-700 mb-2">
                        Already booked on this date — slots shown in red below:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {bookedSlots.map((s, i) => (
                          <span key={i} className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-full font-medium">
                            {s.startTime} – {s.endTime}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-dashed border-gray-100" />

            {/* ── 3: Time Slot ── */}
            <div>
              <SectionHeading step="3" title="Time Slot" />
              <p className="text-xs text-gray-400 mb-3">
                Red slots are already booked and cannot be selected.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const booked = isSlotBooked(slot, bookedSlots);
                  return (
                    <label
                      key={slot.start}
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                        booked
                          ? "bg-red-50 border-red-100 opacity-60 cursor-not-allowed"
                          : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                      }`}
                    >
                      <input
                        type="radio"
                        className="accent-blue-600"
                        disabled={booked}
                        value={slot.start}
                        {...register("startTime", {
                          required: "Please select a time slot",
                        })}
                        onChange={() => {
                          setValue("startTime", slot.start);
                          setValue("endTime", slot.end);
                        }}
                      />
                      <span className="text-sm text-gray-700 font-mono">{slot.label}</span>
                      {booked && (
                        <span className="ml-auto text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">
                          Booked
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
              {/* endTime is set silently when user picks a slot */}
              <input type="hidden" {...register("endTime", { required: true })} />
              <ErrorMsg error={errors.startTime} />
            </div>

            <div className="border-t border-dashed border-gray-100" />

            {/* ── 4: Purpose ── */}
            <div>
              <SectionHeading step="4" title="Purpose" />
              <label className={labelClass}>Reason for booking</label>
              <textarea
                {...register("purpose")}
                placeholder="e.g. Birthday party, family gathering, workout session..."
                rows={3}
                className={`${inputClass(false)} resize-none`}
              />
            </div>

            {/* ── FOOTER ── */}
            <div className="pt-2 flex items-center justify-between border-t border-gray-100">
              <p className="text-xs text-gray-400">* Required fields</p>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => navigate(-1)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-all flex items-center gap-2">
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Saving...
                    </>
                  ) : isEditMode ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Booking
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Booking
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Bookings are subject to facility availability and admin approval.
        </p>
      </div>
    </div>
  );
};

export default BookingForm;