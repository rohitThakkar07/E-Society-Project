const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Available", "Maintenance", "Closed"],
      default: "Available",
    },
    bookingType: {
      type: String,
      enum: ["hourly", "daily", "both"],
      default: "hourly",
    },
    pricePerHour: { type: Number, default: 0, min: 0 },
    pricePerDay: { type: Number, default: 0, min: 0 },
    /** Operating window (24h "HH:mm") applied to each calendar day */
    openTime: { type: String, default: "06:00" },
    closeTime: { type: String, default: "22:00" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Facility", facilitySchema);
