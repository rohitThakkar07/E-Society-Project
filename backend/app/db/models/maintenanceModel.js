const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    // Which flat/resident this charge is for
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resident",
      required: true,
    },

    month: {
      type: String, // e.g. "March"
      required: true,
    },

    year: {
      type: Number, // e.g. 2026
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    lateFee: {
      type: Number,
      default: 0,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
    },

    // Paid | Pending | Overdue
    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue"],
      default: "Pending",
    },

    // Partial payments history
    paymentHistory: [
      {
        date:   { type: Date,   default: Date.now },
        amount: { type: Number, required: true },
        mode:   { type: String, enum: ["Cash", "UPI", "Card", "Net Banking"], required: true },
        transactionId: { type: String },
      },
    ],

    paidDate: {
      type: Date, // set when status flips to Paid
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);