const mongoose = require("mongoose");

const paymentRecordSchema = new mongoose.Schema({
  // References
  maintenance: { type: mongoose.Schema.Types.ObjectId, ref: "Maintenance", required: true },
  resident: { type: mongoose.Schema.Types.ObjectId, ref: "Resident", required: true },

  // Payment Amount
  totalAmount: { type: Number, required: true },
  lateFee: { type: Number, default: 0 },

  // Razorpay Fields
  paymentGateway: { type: String, enum: ["razorpay"], default: "razorpay" },
  razorpayOrderId: { type: String, required: true, unique: true },
  razorpayPaymentId: { type: String, unique: true, sparse: true },
  razorpaySignature: { type: String, sparse: true },
  signature_verified: { type: Boolean, default: false },

  // Payment Details
  paymentMethod: { type: String, enum: ["card", "netbanking", "upi", "wallet", "emandate"], sparse: true },
  cardDetails: {
    last4: String,
    brand: String,
    issuer: String,
  },
  upiId: String,

  // Status & Metadata
  status: { type: String, enum: ["pending", "successful", "failed", "refunded"], default: "pending" },
  receiptNumber: { type: String, unique: true, sparse: true },
  paidAt: { type: Date, sparse: true },
  refundedAt: { type: Date, sparse: true },
  refundId: { type: String, sparse: true },
  notes: {
    month: String,
    year: String,
    description: String,
  },
}, { timestamps: true });

paymentRecordSchema.index({ resident: 1, createdAt: -1 });
paymentRecordSchema.index({ status: 1 });

module.exports = mongoose.model("PaymentRecord", paymentRecordSchema);