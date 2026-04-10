const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["Fire", "Flood", "Power Outage", "Security Breach", "Medical", "Other"],
    required: true,
  },
  severity: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    default: "High",
  },
  status: {
    type: String,
    enum: ["Active", "Resolved"],
    default: "Active",
  },
  sentBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  resolvedAt: { type: Date },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  affectedArea: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Alert", alertSchema);