const mongoose = require("mongoose");

// FACILITY
const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["Available", "Maintenance", "Closed"], default: "Available" }
}, { timestamps: true });
module.exports = mongoose.model("Facility", facilitySchema);