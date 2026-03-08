const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema({

  /* ---------------- Personal Information ---------------- */

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

  /* ---------------- Contact Information ---------------- */

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

  /* ---------------- Flat Details ---------------- */

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

  /* ---------------- Resident Details ---------------- */

  residentType: {
    type: String,
    enum: ["Owner", "Tenant"],
    required: true
  },

  moveInDate: {
    type: Date,
    default: Date.now
  },

 

  /* ---------------- Identity Details ---------------- */

  idProofType: {
    type: String,
    enum: ["Aadhaar", "PAN", "Driving License", "Passport"]
  },

  idProofNumber: {
    type: String,
    trim: true
  },

  /* ---------------- Emergency Contact ---------------- */

  emergencyContactName: {
    type: String,
    trim: true
  },

  emergencyContactNumber: {
    type: String,
    match: [/^[0-9]{10}$/, "Please enter a valid 10 digit mobile number"]
  },

  /* ---------------- Resident Status ---------------- */

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  }

}, { timestamps: true });


/* Prevent duplicate residents in same flat */
residentSchema.index({ wing: 1, flatNumber: 1 });

module.exports = mongoose.model("Resident", residentSchema);