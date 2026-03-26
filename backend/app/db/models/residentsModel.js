const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, trim: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  dateOfBirth: { type: Date },
  mobileNumber: { type: String, required: true },
  email: { type: String, lowercase: true, unique: true, sparse: true },

  // Relationship: Points to the Flat
  flat: { type: mongoose.Schema.Types.ObjectId, ref: "Flat", required: true },

  // Denormalized for performance (optional but helpful)
  wing: { type: String, required: true },
  flatNumber: { type: String, required: true },

  residentType: { type: String, enum: ["Owner", "Tenant"], required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
}, { timestamps: true });

module.exports = mongoose.model("Resident", residentSchema);