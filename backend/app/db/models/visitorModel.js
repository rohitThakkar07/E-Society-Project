const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({

  visitorName: {
    type: String,
    required: true,
    trim: true
  },

  mobileNumber: {
    type: String,
    required: true
  },

  visitingResident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true
  },

  wing: {
    type: String,
    required: true
  },

  flatNumber: {
    type: String,
    required: true
  },

  purpose: {
    type: String
  },

  entryTime: {
    type: Date,
    default: Date.now
  },

  exitTime: {
    type: Date
  },

  status: {
    type: String,
    enum: ["Inside", "Exited"],
    default: "Inside"
  }

}, { timestamps: true });

module.exports = mongoose.model("Visitor", visitorSchema);