const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String
  },

  location: {
    type: String
  },

  openingTime: {
    type: String
  },

  closingTime: {
    type: String
  },

  capacity: {
    type: Number
  },

  status: {
    type: String,
    enum: ["Available", "Maintenance", "Closed"],
    default: "Available"
  }

}, { timestamps: true });

module.exports = mongoose.model("Facility", facilitySchema);