import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookingById,
  updateBooking,
} from "../../../store/slices/facilityBookingSlice";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

// ── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    Approved:  "bg-green-100 text-green-700",
    Rejected:  "bg-red-100 text-red-600",
    Pending:   "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || "bg-gray-100 text-gray-500"}`}>
      {status || "—"}
    </span>
  );
};

// ── Single detail row ─────────────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div>
    <p className="text-gray-500 text-sm mb-1">{label}</p>
    <div className="font-semibold text-gray-800">{children}</div>
  </div>
);

const BookingDetails = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleBooking: booking, loading } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    if (id) dispatch(fetchBookingById(id));
  }, [id, dispatch]);

  // Actions — use "status" (correct model field)
  const handleApprove = () =>
    dispatch(updateBooking({ id, data: { status: "Approved" } }));

  const handleReject = () =>
    dispatch(updateBooking({ id, data: { status: "Rejected" } }));

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────────
  if (!booking) {
    return (
      <div className="p-6 min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-sm mb-3">Booking not found.</p>
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline text-sm">
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  // ── Safely read populated objects ────────────────────────────────────────
  // resident = { _id, flatNumber }
  const residentFlat = booking.resident?.flatNumber
    || booking.resident?.flat
    || booking.resident?.name
    || "—";

  // facility = { _id, name, location, openingTime, closingTime, status }
  const facilityName     = booking.facility?.name     || "—";
  const facilityLocation = booking.facility?.location || "—";
  const facilityHours    =
    booking.facility?.openingTime && booking.facility?.closingTime
      ? `${booking.facility.openingTime} – ${booking.facility.closingTime}`
      : "—";

  // Time slot from startTime + endTime
  const timeSlot =
    booking.startTime && booking.endTime
      ? `${booking.startTime} – ${booking.endTime}`
      : "—";

  // Status from model field "status" (NOT bookingStatus, NOT paymentStatus)
  const bookingStatus = booking.status || "Pending";

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
          <p className="text-sm text-gray-500">Manage facility booking</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      {/* STATUS BANNER */}
      <div className={`mb-5 flex items-center gap-3 px-5 py-3 rounded-xl border ${
        bookingStatus === "Approved"  ? "bg-green-50 border-green-100" :
        bookingStatus === "Rejected"  ? "bg-red-50 border-red-100"    :
        bookingStatus === "Cancelled" ? "bg-gray-50 border-gray-200"  :
                                        "bg-yellow-50 border-yellow-100"
      }`}>
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
          bookingStatus === "Approved"  ? "bg-green-500"  :
          bookingStatus === "Rejected"  ? "bg-red-500"    :
          bookingStatus === "Cancelled" ? "bg-gray-400"   :
                                          "bg-yellow-500"
        }`} />
        <p className="text-sm text-gray-700">
          Booking is currently{" "}
          <span className="font-semibold">{bookingStatus}</span>
        </p>
      </div>

      {/* DETAIL CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400" />

        <div className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-6">

            {/* resident.flatNumber (NOT the object itself) */}
            <Field label="Resident / Flat">
              {residentFlat}
            </Field>

            {/* facility.name (NOT the object itself) */}
            <Field label="Facility">
              {facilityName}
            </Field>

            {/* booking.bookingDate (model field) */}
            <Field label="Date">
              {formatDate(booking.bookingDate)}
            </Field>

            {/* startTime + endTime (model fields) */}
            <Field label="Time Slot">
              <span className="font-mono">{timeSlot}</span>
            </Field>

            {/* purpose */}
            <Field label="Purpose">
              {booking.purpose || "—"}
            </Field>

            {/* facility.location (from populated object) */}
            <Field label="Location">
              {facilityLocation}
            </Field>

            {/* facility opening hours (from populated object) */}
            <Field label="Facility Hours">
              <span className="font-mono">{facilityHours}</span>
            </Field>

            {/* booking.status (correct field — shown as badge) */}
            <Field label="Booking Status">
              <StatusBadge status={bookingStatus} />
            </Field>

          </div>
        </div>

        {/* ACTIONS — conditioned on booking.status (NOT bookingStatus) */}
        {bookingStatus === "Pending" && (
          <div className="flex gap-3 px-6 md:px-8 py-5 border-t border-gray-100 bg-gray-50 flex-wrap">
            <button
              onClick={handleApprove}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 active:scale-95 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </button>
            <button
              onClick={handleReject}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default BookingDetails;