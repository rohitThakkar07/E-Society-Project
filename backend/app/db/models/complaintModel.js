const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: [true, "Resident ID is required"]
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },

    description: {
      type: String,
      required: [true, "Description is required"]
    },

    category: {
      type: String,
      enum: {
        values: ["Water", "Electricity", "Security", "Maintenance", "Other"],
        message: "Category must be one of: Water, Electricity, Security, Maintenance, Other"
      },
      required: [true, "Category is required"]
    },

    // FIX: Added "Rejected" to enum — was missing, caused 500 when updateComplaintStatus used it
    status: {
      type: String,
      enum: {
        values: ["Pending", "In Progress", "Resolved", "Rejected"],
        message: "Status must be one of: Pending, In Progress, Resolved, Rejected"
      },
      default: "Pending"
    },

    priority: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High"],
        message: "Priority must be one of: Low, Medium, High"
      },
      default: "Medium"
    },

    // FIX: attachment stores a relative URL, not a full OS path
    attachment: {
      type: String,
      default: null
    },

    // FIX: resolvedAt is now set automatically in the controller when status → "Resolved"
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);