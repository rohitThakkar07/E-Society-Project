const mongoose = require("mongoose");

const facilityBookingSchema = new mongoose.Schema(
  {
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
      index: true,
    },
    /** Resident profile (society member) */
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
      index: true,
    },
    bookedByUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },

    totalAmount: { type: Number, required: true, min: 0 },
    pricingBreakdown: {
      totalHours: Number,
      fullDays: Number,
      extraBillableHours: Number,
      hourlySubtotal: Number,
      dailySubtotal: Number,
    },

    purpose: { type: String, trim: true, default: "" },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed"],
      default: "unpaid",
    },
    razorpayOrderId: { type: String, sparse: true },
    razorpayPaymentId: { type: String, sparse: true },
    razorpaySignature: { type: String },
    paidAt: { type: Date },

    facilitySnapshot: {
      name: String,
      bookingType: String,
      pricePerHour: Number,
      pricePerDay: Number,
    },

    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

facilityBookingSchema.index(
  { facility: 1, startDateTime: 1, endDateTime: 1 },
  { name: "facility_booking_window" }
);

module.exports = mongoose.model("FacilityBooking", facilityBookingSchema);
