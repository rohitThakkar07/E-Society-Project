const MaintenanceSettings = require("../../../db/models/maintenanceSetting");

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * How many full days have elapsed since a date (past the end of that day).
 */
const daysPastDate = (date, referenceDate = new Date()) => {
  if (!date) return -Infinity;
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  const diff = referenceDate - end;
  return diff > 0 ? Math.floor(diff / 86400000) : 0;
};

/**
 * Is the current date strictly after the end of dueDate?
 */
const isPastDue = (dueDate, referenceDate = new Date()) => {
  if (!dueDate) return false;
  const dueEnd = new Date(dueDate);
  dueEnd.setHours(23, 59, 59, 999);
  return referenceDate > dueEnd;
};

/**
 * Is the current date within grace period (past due but within grace)?
 */
const isInGracePeriod = (dueDate, gracePeriodDays, referenceDate = new Date()) => {
  if (!isPastDue(dueDate, referenceDate)) return false;
  const graceEnd = new Date(dueDate);
  graceEnd.setDate(graceEnd.getDate() + (gracePeriodDays || 0));
  graceEnd.setHours(23, 59, 59, 999);
  return referenceDate <= graceEnd;
};

/**
 * Calculate base late fee from settings.
 */
const calculateLateFee = (amount, settings) => {
  const type    = settings?.lateFeeType ?? "none";
  const flat    = Number(settings?.lateFeeAmount  ?? 0);
  const pct     = Number(settings?.lateFeePercent ?? 0);
  const base    = Number(amount ?? 0);
  if (type === "flat")    return flat;
  if (type === "percent") return Math.round((base * pct) / 100);
  return 0;
};

/**
 * Calculate escalation level-1 extra charge.
 */
const calculateEscalationCharge = (amount, settings) => {
  const type  = settings?.escalation1Type ?? "none";
  const flat  = Number(settings?.escalation1Amount  ?? 0);
  const pct   = Number(settings?.escalation1Percent ?? 0);
  const base  = Number(amount ?? 0);
  if (type === "flat")    return flat;
  if (type === "percent") return Math.round((base * pct) / 100);
  return 0;
};

// ─────────────────────────────────────────────────────────────────────────────
// Core sync function — updates a single record based on current date + settings
// ─────────────────────────────────────────────────────────────────────────────
const syncMaintenanceRecord = async (record, settings = null) => {
  if (!record || record.status === "Paid") return record;

  const s = settings || (await MaintenanceSettings.findOne()) || {};
  const gracePeriodDays = Number(s.gracePeriodDays ?? 5);
  const now = new Date();

  const past = isPastDue(record.dueDate, now);
  const inGrace = past && isInGracePeriod(record.dueDate, gracePeriodDays, now);
  const daysLate = past ? daysPastDate(record.dueDate, now) : 0;
  const effectiveLate = Math.max(0, daysLate - gracePeriodDays); // days past grace period end

  // ── Determine fees ──────────────────────────────────────────────────────────
  let lateFee = 0;
  let escalationCharge = 0;

  if (past && !inGrace) {
    // Base late fee applies once grace period ends
    lateFee = calculateLateFee(record.amount, s);

    // Escalation Level 1: additional charge
    if (s.escalation1Enabled && effectiveLate >= (s.escalation1Days - gracePeriodDays)) {
      escalationCharge = calculateEscalationCharge(record.amount, s);
    }
  }

  // ── Determine status & escalation level ────────────────────────────────────
  let newStatus         = record.status;
  let newEscalation     = record.escalationLevel || 0;
  let newIsDefaulter    = record.isDefaulter    || false;
  let newFacilityBlock  = record.facilityBookingBlocked || false;

  if (!past) {
    newStatus     = "Pending";
    newEscalation = 0;
  } else if (inGrace) {
    // Past due but within grace — still Pending, no penalty
    newStatus     = "Pending";
    newEscalation = 0;
  } else {
    // Past grace period → Overdue
    newStatus = "Overdue";

    // Escalation level 1
    if (s.escalation1Enabled && effectiveLate >= (s.escalation1Days - gracePeriodDays)) {
      newEscalation = Math.max(newEscalation, 1);
    }

    // Escalation level 2 → defaulter
    if (s.escalation2Enabled && daysLate >= s.escalation2Days) {
      newEscalation  = Math.max(newEscalation, 2);
      newIsDefaulter = true;
    }

    // Escalation level 3 → admin notified (just flag it; cron sends the email)
    if (s.escalation3Enabled && daysLate >= s.escalation3Days) {
      newEscalation = Math.max(newEscalation, 3);
    }

    // Facility booking block
    if (s.blockFacilityOnOverdue) {
      newFacilityBlock = true;
    }
  }

  // ── Save if anything changed ───────────────────────────────────────────────
  const changed =
    record.lateFee             !== lateFee          ||
    record.escalationCharge    !== escalationCharge  ||
    record.status              !== newStatus         ||
    record.escalationLevel     !== newEscalation     ||
    record.isDefaulter         !== newIsDefaulter    ||
    record.facilityBookingBlocked !== newFacilityBlock;

  if (changed) {
    record.lateFee                = lateFee;
    record.escalationCharge       = escalationCharge;
    record.status                 = newStatus;
    record.escalationLevel        = newEscalation;
    record.isDefaulter            = newIsDefaulter;
    record.facilityBookingBlocked = newFacilityBlock;
    await record.save();
  }

  return record;
};

/**
 * Sync an array of records efficiently (single settings fetch).
 */
const syncMaintenanceRecords = async (records, settings = null) => {
  if (!Array.isArray(records) || records.length === 0) return records;
  const s = settings || (await MaintenanceSettings.findOne()) || {};
  await Promise.all(records.map((r) => syncMaintenanceRecord(r, s)));
  return records;
};

module.exports = {
  isPastDue,
  isInGracePeriod,
  daysPastDate,
  calculateLateFee,
  calculateEscalationCharge,
  syncMaintenanceRecord,
  syncMaintenanceRecords,
};
