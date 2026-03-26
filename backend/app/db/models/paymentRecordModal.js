const mongoose = require("mongoose");

const paymentRecordSchema = new mongoose.Schema({
  maintenance: { type: mongoose.Schema.Types.ObjectId, ref: "Maintenance", required: true },
  resident: { type: mongoose.Schema.Types.ObjectId, ref: "Resident", required: true },

  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["Cash", "UPI", "Bank Transfer", "Cheque"], required: true },
  transactionId: { type: String, unique: true, sparse: true },
  paidAt: { type: Date, default: Date.now },
  receiptNumber: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model("PaymentRecord", paymentRecordSchema);