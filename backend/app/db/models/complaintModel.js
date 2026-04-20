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

    attachment: {
      type: String,
      default: null
    },

    resolvedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);