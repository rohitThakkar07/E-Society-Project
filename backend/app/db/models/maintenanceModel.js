const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
  resident: { type: mongoose.Schema.Types.ObjectId, ref: "Resident", required: true },
  // Link to flat so we can track history of the property
  flat: { type: mongoose.Schema.Types.ObjectId, ref: "Flat", required: true },

  month: { type: String, required: true },
  year: { type: Number, required: true },
  amount: { type: Number, required: true },
  lateFee: { type: Number, default: 0 },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Paid", "Overdue"], default: "Pending" },

  // Track partial payments 
  paymentHistory: [{
    date: { type: Date, default: Date.now },
    amount: { type: Number },
    mode: { type: String, enum: ["Cash", "UPI", "Card", "Net Banking", "Netbanking", "Wallet", "E-Mandate", "Razorpay", "Other"] },
    transactionId: { type: String }
  }]
}, { timestamps: true });

maintenanceSchema.index({ flat: 1, month: 1, year: 1 }, { unique: true });
maintenanceSchema.index({ resident: 1, createdAt: -1 });
maintenanceSchema.index({ status: 1, dueDate: 1 });

module.exports = mongoose.model("Maintenance", maintenanceSchema);