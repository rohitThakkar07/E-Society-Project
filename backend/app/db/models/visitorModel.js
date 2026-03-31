// const mongoose = require("mongoose");

// const visitorSchema = new mongoose.Schema({
//   visitorName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   mobileNumber: {
//     type: String,
//     required: true
//   },
//   // ✅ RELATIONSHIP: Links directly to the Resident Model
//   visitingResident: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Resident",
//     required: true
//   },
//   wing: {
//     type: String,
//     required: true
//   },
//   flatNumber: {
//     type: String,
//     required: true
//   },
//   purpose: {
//     type: String
//   },
//   entryTime: {
//     type: Date,
//     default: Date.now
//   },
//   exitTime: {
//     type: Date
//   },
//   status: {
//     type: String,
//     enum: ["Inside", "Exited"],
//     default: "Inside"
//   }
// }, { timestamps: true });

// // ✅ PERFORMANCE INDEXING
// // Makes searching for visitors by flat or resident much faster
// visitorSchema.index({ visitingResident: 1 });
// visitorSchema.index({ flatNumber: 1, wing: 1 });

// module.exports = mongoose.model("Visitor", visitorSchema);

const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  name: String,
  phone: String,
  purpose: String,

  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
  },

  otp: String,
  otpExpiry: Date,
  isVerified: { type: Boolean, default: false },

  status: {
    type: String,
    enum: ["pending", "approved", "denied", "exited"],
    default: "pending",
  },

  entryTime: Date,
  exitTime: Date,
}, { timestamps: true });

visitorSchema.index({ resident: 1 });
visitorSchema.index({ flatNumber: 1, wing: 1 });
module.exports = mongoose.model("Visitor", visitorSchema);