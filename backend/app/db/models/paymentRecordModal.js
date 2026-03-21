const mongoose = require("mongoose");

const paymentRecordSchema = new mongoose.Schema({

  maintenance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Maintenance",
    required: true
  },

  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resident",
    required: true
  },

  month: {
    type: String,
    required: true
  },

  year: {
    type: Number,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  lateFee: {
    type: Number,
    default: 0
  },

  totalAmount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["Pending", "Paid", "Overdue"],
    default: "Pending"
  },

  paymentMethod: {
    type: String,
    enum: ["Cash", "UPI", "Bank Transfer", "Cheque"],
    default: null
  },

  transactionId: {
    type: String,
    default: null
  },

  paidAt: {
    type: Date,
    default: null
  },

  receiptNumber: {
    type: String,
    default: null
  },

  remarks: {
    type: String,
    default: null
  }

}, { timestamps: true });

// Prevent duplicate record for same resident + maintenance period
paymentRecordSchema.index({ maintenance: 1, resident: 1 }, { unique: true });

module.exports = mongoose.model("PaymentRecord", paymentRecordSchema);