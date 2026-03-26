const mongoose = require("mongoose");

const facilityBookingSchema = new mongoose.Schema({
  facility: { type: mongoose.Schema.Types.ObjectId, ref: "Facility", required: true },
  resident: { type: mongoose.Schema.Types.ObjectId, ref: "Resident", required: true },
  bookingDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected", "Cancelled"], default: "Pending" },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Admin who approved
}, { timestamps: true });

module.exports = mongoose.model("FacilityBooking", facilityBookingSchema);