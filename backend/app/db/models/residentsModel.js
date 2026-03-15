const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema({

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
    enum: ["Male", "Female"],
    required: true
  },

  dateOfBirth: {
    type: Date
  },

  mobileNumber: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, "Please enter a valid 10 digit mobile number"]
  },

  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    sparse: true
  },

  wing: {
    type: String,
    required: true,
    trim: true
  },

  flatNumber: {
    type: String,
    required: true,
    trim: true
  },

  floorNumber: {
    type: Number
  },

  flatType: {
    type: String,
    enum: ["1BHK", "2BHK", "3BHK", "4BHK"],
    required: true
  },

  residentType: {
    type: String,
    enum: ["Owner", "Tenant"],
    required: true
  },

  moveInDate: {
    type: Date,
    default: Date.now
  },

  idProofType: {
    type: String,
    enum: ["Aadhaar"]
  },

  idProofNumber: {
    type: String,
    trim: true
  },

  emergencyContactName: {
    type: String,
    trim: true
  },

  emergencyContactNumber: {
    type: String,
    match: [/^[0-9]{10}$/, "Please enter a valid 10 digit mobile number"]
  },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  }

}, { timestamps: true });

residentSchema.index(
  { wing: 1, flatNumber: 1 }
);

module.exports = mongoose.model("Resident", residentSchema);