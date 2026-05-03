const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({
  resident: { type: mongoose.Schema.Types.ObjectId, ref: "Resident", required: true },
  flat:     { type: mongoose.Schema.Types.ObjectId, ref: "Flat",     required: true },

  month:  { type: String,  required: true },
  year:   { type: Number,  required: true },
  amount: { type: Number,  required: true },

  dueDate: { type: Date, required: true },
  // Computed: dueDate + gracePeriodDays — set when bill is generated
  gracePeriodEnds: { type: Date },

  // Fees
  lateFee:          { type: Number, default: 0 },
  escalationCharge: { type: Number, default: 0 }, // extra charge added at escalation level 1

  // Status & escalation
  status:         { type: String, enum: ["Pending", "Paid", "Overdue"], default: "Pending" },
  escalationLevel: { type: Number, enum: [0, 1, 2, 3], default: 0 },
  // 0 = normal, 1 = late fee applied, 2 = defaulter marked, 3 = admin notified
  isDefaulter:             { type: Boolean, default: false },
  facilityBookingBlocked:  { type: Boolean, default: false },

  paidDate: { type: Date },

  // Track which pre-due reminders have been sent
  remindersSent: [{
    type:   { type: String }, // "pre-due-7", "pre-due-2", "overdue", "escalation1", etc.
    sentAt: { type: Date, default: Date.now },
  }],

  // Track partial payments
  paymentHistory: [{
    date:          { type: Date, default: Date.now },
    amount:        { type: Number },
    mode:          { type: String, enum: ["Cash", "UPI", "Card", "Net Banking", "Netbanking", "Wallet", "E-Mandate", "Razorpay", "Other"] },
    transactionId: { type: String },
  }],

  description: { type: String },
}, { timestamps: true });

maintenanceSchema.index({ flat: 1, month: 1, year: 1 }, { unique: true });
maintenanceSchema.index({ resident: 1, createdAt: -1 });
maintenanceSchema.index({ status: 1, dueDate: 1 });
maintenanceSchema.index({ isDefaulter: 1 });

module.exports = mongoose.model("Maintenance", maintenanceSchema);