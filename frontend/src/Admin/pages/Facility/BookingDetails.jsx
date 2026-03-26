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

const Field = ({ label, children }) => (
  <div>
    <p className="text-gray-500 text-sm mb-1">{label}</p>
    <div className="font-semibold text-gray-800">{children}</div>
  </div>
);

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleBooking: booking, loading } = useSelector((state) => state.booking);

  useEffect(() => {
    if (id) dispatch(fetchBookingById(id));
  }, [id, dispatch]);

  const handleApprove = () => dispatch(updateBooking({ id, data: { status: "Approved" } }));
  const handleReject = () => dispatch(updateBooking({ id, data: { status: "Rejected" } }));

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400 font-bold">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  // ✅ FIX: Resident Label (Handles Resident Name + Flat Number)
  const residentName = booking.resident?.firstName 
    ? `${booking.resident.firstName} ${booking.resident.lastName || ""}` 
    : booking.resident?.name || "—";
  
  const residentFlat = booking.resident?.flatNumber || "—";

  // ✅ FIX: Facility Data
  const facilityName = booking.facility?.name || "—";
  
  // These fields depend on whether you kept them in the schema or not
  const facilityLocation = booking.facility?.location || "Main Premises"; 
  const facilityHours = booking.facility?.openingTime && booking.facility?.closingTime
      ? `${booking.facility.openingTime} – ${booking.facility.closingTime}`
      : "Open 24/7"; // Fallback if times are not in schema

  const timeSlot = booking.startTime && booking.endTime
      ? `${booking.startTime} – ${booking.endTime}`
      : "—";

  const bookingStatus = booking.status || "Pending";

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
          <p className="text-sm text-gray-500">Manage facility booking</p>
        </div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-white border px-4 py-2 rounded-lg hover:bg-gray-50 transition">
          Back
        </button>
      </div>

      <div className={`mb-5 flex items-center gap-3 px-5 py-3 rounded-xl border ${
        bookingStatus === "Approved" ? "bg-green-50 border-green-100" : 
        bookingStatus === "Rejected" ? "bg-red-50 border-red-100" : "bg-yellow-50 border-yellow-100"
      }`}>
        <p className="text-sm text-gray-700">Booking is currently <span className="font-bold">{bookingStatus}</span></p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400" />
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
            <Field label="Resident Name">{residentName}</Field>
            <Field label="Flat Number">{residentFlat}</Field>
            <Field label="Facility Name">{facilityName}</Field>
            <Field label="Date">{formatDate(booking.bookingDate)}</Field>
            <Field label="Time Slot"><span className="font-mono">{timeSlot}</span></Field>
            
            {/* ✅ Purpose Fix: Ensure field name matches your response object */}
            <Field label="Purpose">{booking.purpose || "General Use"}</Field>
            
            <Field label="Location">{facilityLocation}</Field>
            <Field label="Facility Hours">{facilityHours}</Field>
            <Field label="Status"><StatusBadge status={bookingStatus} /></Field>
          </div>
        </div>

        {bookingStatus === "Pending" && (
          <div className="flex gap-3 px-8 py-5 border-t bg-gray-50">
            <button onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition">Approve</button>
            <button onClick={handleReject} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition">Reject</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;