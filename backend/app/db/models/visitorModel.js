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
  visitorName: {
    type: String,
    required: true,
    trim: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  photo: {
    type: String,  
    default: null
  },
  // : Links directly to the Resident Model
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
    type: String,
    enum: ["Visit", "Delivery", "Service", "Guest", "Other"],
    default: "Visit"
  },
  vehicleNumber: {
    type: String,
    default: null
  },
  entryTime: {
    type: Date,
    default: Date.now
  },
  exitTime: {
    type: Date,
    default: null
  },
  // Guard who logged the visitor
  loggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guard",
    default: null
  },
  // ✅ OTP VERIFICATION FLOW
  otp: {
    type: String,
    default: null
  },
  otpExpiresAt: {
    type: Date,
    default: null
  },
  otpVerified: {
    type: Boolean,
    default: false
  },
  // ✅ STATUS FLOW: Pending → Approved / Denied → Inside → Exited
  status: {
    type: String,
    enum: ["Pending", "Approved", "Denied", "Inside", "Exited"],
    default: "Pending"
  },
  // Notes from guard or admin
  notes: {
    type: String,
    default: null
  }
}, { timestamps: true });

// ✅ PERFORMANCE INDEXING
visitorSchema.index({ visitingResident: 1 });
visitorSchema.index({ flatNumber: 1, wing: 1 });
visitorSchema.index({ status: 1 });
visitorSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Visitor", visitorSchema);