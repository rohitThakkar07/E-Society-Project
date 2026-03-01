import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy Data (Later fetch using ID from API)
  const [booking, setBooking] = useState({
    id,
    resident: "Flat A-101",
    facility: "Community Hall",
    date: "2026-03-10",
    time: "10:00 AM - 02:00 PM",
    purpose: "Birthday Party",
    amount: 2000,
    paymentStatus: "Unpaid",
    bookingStatus: "Pending",
  });

  const handleApprove = () => {
    setBooking({ ...booking, bookingStatus: "Approved" });
  };

  const handleReject = () => {
    setBooking({ ...booking, bookingStatus: "Rejected" });
  };

  const handlePayment = () => {
    setBooking({ ...booking, paymentStatus: "Paid" });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Booking Details</h1>
          <p className="text-gray-500">Manage facility booking</p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          Back
        </button>
      </div>

      {/* BOOKING CARD */}
      <div className="bg-white rounded-xl shadow p-6 space-y-6">

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <p className="text-gray-500 text-sm">Resident</p>
            <p className="font-semibold">{booking.resident}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Facility</p>
            <p className="font-semibold">{booking.facility}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Date</p>
            <p className="font-semibold">{booking.date}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Time Slot</p>
            <p className="font-semibold">{booking.time}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Purpose</p>
            <p className="font-semibold">{booking.purpose}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Amount</p>
            <p className="font-semibold text-blue-600">
              ₹{booking.amount}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Payment Status</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                booking.paymentStatus === "Paid"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {booking.paymentStatus}
            </span>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Booking Status</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                booking.bookingStatus === "Approved"
                  ? "bg-green-100 text-green-600"
                  : booking.bookingStatus === "Rejected"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {booking.bookingStatus}
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-4 pt-4 border-t">

          {booking.bookingStatus === "Pending" && (
            <>
              <button
                onClick={handleApprove}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Approve
              </button>

              <button
                onClick={handleReject}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Reject
              </button>
            </>
          )}

          {booking.paymentStatus === "Unpaid" && (
            <button
              onClick={handlePayment}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Mark as Paid
            </button>
          )}

        </div>
      </div>

    </div>
  );
};

export default BookingDetails;