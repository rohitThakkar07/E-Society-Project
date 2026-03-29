const mongoose = require("mongoose");

/**
 * Stores global maintenance billing configuration
 * Only one document should exist (singleton pattern)
 */
const maintenanceSettingsSchema = new mongoose.Schema({
  // Due date: how many days into the month (e.g., 10 = due on 10th)
  dueDays: { type: Number, default: 10, min: 1, max: 28 },

  // Late fee: either flat amount or percentage (not both)
  lateFeeType: { type: String, enum: ["flat", "percent", "none"], default: "none" },
  lateFeeAmount: { type: Number, default: 0 },   // used if lateFeeType = "flat"
  lateFeePercent: { type: Number, default: 0 },  // used if lateFeeType = "percent"

  // Auto-generate on 1st of month
  autoGenerate: { type: Boolean, default: false },

  // Email notifications
  sendEmailOnGenerate: { type: Boolean, default: true },
  sendOverdueReminder: { type: Boolean, default: true },
  overdueReminderDays: { type: Number, default: 3 }, // days after due date to send reminder

  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("MaintenanceSettings", maintenanceSettingsSchema);