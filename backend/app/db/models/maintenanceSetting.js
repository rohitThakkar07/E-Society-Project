const mongoose = require("mongoose");

/**
 * Stores global maintenance billing configuration
 * Only one document should exist (singleton pattern)
 */
const maintenanceSettingsSchema = new mongoose.Schema({
  // ── Due Date ──────────────────────────────────────────────────────────────
  // How many days into the month (e.g., 10 = due on 10th)
  dueDays: { type: Number, default: 10, min: 1, max: 28 },

  // ── Grace Period ──────────────────────────────────────────────────────────
  // Days after due date before late fee kicks in (0 = no grace)
  gracePeriodDays: { type: Number, default: 5, min: 0, max: 30 },

  // ── Late Fee (applied after grace period) ─────────────────────────────────
  lateFeeType:    { type: String, enum: ["flat", "percent", "none"], default: "none" },
  lateFeeAmount:  { type: Number, default: 0 },   // used if lateFeeType = "flat"
  lateFeePercent: { type: Number, default: 0 },   // used if lateFeeType = "percent"

  // ── Escalation Rules ──────────────────────────────────────────────────────
  // Level 1: Additional interest/charge after N days past due
  escalation1Enabled: { type: Boolean, default: false },
  escalation1Days:    { type: Number, default: 15, min: 1 }, // days past due date
  escalation1Type:    { type: String, enum: ["flat", "percent", "none"], default: "none" },
  escalation1Amount:  { type: Number, default: 0 },
  escalation1Percent: { type: Number, default: 0 },

  // Level 2: Mark resident as Defaulter after N days past due
  escalation2Enabled: { type: Boolean, default: false },
  escalation2Days:    { type: Number, default: 30, min: 1 },

  // Level 3: Notify admin for manual action after N days past due
  escalation3Enabled: { type: Boolean, default: false },
  escalation3Days:    { type: Number, default: 60, min: 1 },

  // ── Restrictions ──────────────────────────────────────────────────────────
  blockFacilityOnOverdue: { type: Boolean, default: false }, // disable facility bookings for overdue residents

  // ── Pre-Due Reminders ─────────────────────────────────────────────────────
  // Days before due date to send reminders (e.g. [7, 2, 0] = 7 days before, 2 days before, on due date)
  sendPreDueReminders: { type: Boolean, default: false },
  preDueReminderDays:  { type: [Number], default: [7, 2] }, // days before due date

  // ── Auto-Generation ───────────────────────────────────────────────────────
  autoGenerate: { type: Boolean, default: false },

  // ── Email Notifications ───────────────────────────────────────────────────
  sendEmailOnGenerate:  { type: Boolean, default: true },
  sendOverdueReminder:  { type: Boolean, default: true },
  overdueReminderDays:  { type: Number, default: 3, min: 1, max: 30 }, // days after due date to send reminder

  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("MaintenanceSettings", maintenanceSettingsSchema);