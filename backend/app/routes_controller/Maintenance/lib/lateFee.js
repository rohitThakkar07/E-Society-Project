const MaintenanceSettings = require("../../../db/models/maintenanceSetting");

const isPastDue = (dueDate, referenceDate = new Date()) => {
  if (!dueDate) return false;
  const dueEnd = new Date(dueDate);
  dueEnd.setHours(23, 59, 59, 999);
  return referenceDate > dueEnd;
};

const calculateLateFee = (amount, settings) => {
  const lateFeeType = settings?.lateFeeType ?? "none";
  const lateFeeAmount = Number(settings?.lateFeeAmount ?? 0);
  const lateFeePercent = Number(settings?.lateFeePercent ?? 0);
  const baseAmount = Number(amount ?? 0);

  if (lateFeeType === "flat") return lateFeeAmount;
  if (lateFeeType === "percent") return Math.round((baseAmount * lateFeePercent) / 100);
  return 0;
};

const syncMaintenanceRecord = async (record, settings = null) => {
  if (!record) return record;

  const resolvedSettings = settings || await MaintenanceSettings.findOne();
  const overdue = record.status !== "Paid" && isPastDue(record.dueDate);
  const computedLateFee = overdue ? calculateLateFee(record.amount, resolvedSettings) : 0;
  const computedStatus = record.status === "Paid" ? "Paid" : overdue ? "Overdue" : "Pending";

  if (record.lateFee !== computedLateFee || record.status !== computedStatus) {
    record.lateFee = computedLateFee;
    record.status = computedStatus;
    await record.save();
  }

  return record;
};

const syncMaintenanceRecords = async (records, settings = null) => {
  if (!Array.isArray(records) || records.length === 0) return records;
  const resolvedSettings = settings || await MaintenanceSettings.findOne();
  await Promise.all(records.map((record) => syncMaintenanceRecord(record, resolvedSettings)));
  return records;
};

module.exports = {
  isPastDue,
  calculateLateFee,
  syncMaintenanceRecord,
  syncMaintenanceRecords,
};
