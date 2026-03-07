const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema({

  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    trim: true
  },

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },

  dateOfBirth: {
    type: Date
  },

  // Contact Information
  mobileNumber: {
    type: String,
    required: true
  },

  email: {
    type: String,
    lowercase: true,
    trim: true
  },

  // Flat Details
  wing: {
    type: String,
    required: true
  },

  flatNumber: {
    type: String,
    required: true
  },

  floorNumber: {
    type: Number
  },

  // Resident Details
  residentType: {
    type: String,
    enum: ["Owner", "Tenant", "Family"],
    required: true
  },

  moveInDate: {
    type: Date
  },

  moveOutDate: {
    type: Date
  },

  // Identity Details
  idProofType: {
    type: String,
  },

  idProofNumber: {
    type: String
  },

  // Vehicle Details
  vehicleNumber: {
    type: String
  },

  // Emergency Contact
  emergencyContactName: {
    type: String
  },

  emergencyContactNumber: {
    type: String
  },

  // Resident Status
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  }

}, { timestamps: true });

module.exports = mongoose.model("Resident", residentSchema);