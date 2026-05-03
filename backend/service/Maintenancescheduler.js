const cron = require("node-cron");
const Maintenance = require("../app/db/models/maintenanceModel");
const MaintenanceSettings = require("../app/db/models/maintenanceSetting");
const Resident = require("../app/db/models/residentsModel");
const Flat = require("../app/db/models/flatModal");
const {
  sendMaintenanceBillEmail,
  sendPreDueReminderEmail,
  sendEscalationEmail,
  sendAdminEscalationEmail,
} = require("../utils/maintenanceEmail");
const { syncMaintenanceRecord } = require("../app/routes_controller/Maintenance/lib/lateFee");

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. AUTO-GENERATE MONTHLY BILLS (1st of every month, 8 AM)
// ─────────────────────────────────────────────────────────────────────────────
async function generateMonthlyBills({ month, year, dueDays = 10 }) {
  const results = { created: [], skipped: [], errors: [] };

  try {
    const settings = await MaintenanceSettings.findOne().lean();
    const graceDays = settings?.gracePeriodDays ?? 5;

    const residents = await Resident.find({ status: "Active" })
      .select("_id firstName lastName email flat")
      .populate("flat", "_id flatNumber monthlyMaintenance")
      .lean();

    const seenFlatIds = new Set();

    for (const resident of residents) {
      const flat = resident.flat;
      if (!flat?._id) {
        results.skipped.push({ resident: resident.firstName, reason: "No flat linked" });
        continue;
      }
      const flatId = String(flat._id);
      if (seenFlatIds.has(flatId)) {
        results.skipped.push({ flatNumber: flat.flatNumber, reason: "Duplicate resident for same flat" });
        continue;
      }
      seenFlatIds.add(flatId);

      try {
        const existing = await Maintenance.findOne({ flat: flat._id, month, year });
        if (existing) {
          results.skipped.push({ flatNumber: flat.flatNumber, reason: "Bill already exists" });
          continue;
        }

        const dueDate = new Date(year, MONTHS.indexOf(month), dueDays);
        const gracePeriodEnds = new Date(dueDate);
        gracePeriodEnds.setDate(gracePeriodEnds.getDate() + graceDays);

        const baseAmount = flat.monthlyMaintenance || 0;

        const maintenance = await Maintenance.create({
          resident: resident._id,
          flat: flat._id,
          month,
          year,
          amount: baseAmount,
          lateFee: 0,
          escalationCharge: 0,
          dueDate,
          gracePeriodEnds,
          status: "Pending",
        });

        // Send new bill email
        if (settings?.sendEmailOnGenerate && resident.email) {
          await sendMaintenanceBillEmail(resident, flat, maintenance).catch(() => {});
        }

        results.created.push({
          flatNumber: flat.flatNumber,
          resident: `${resident.firstName} ${resident.lastName || ""}`.trim(),
          amount: baseAmount,
          email: resident.email || "—",
        });
      } catch (err) {
        results.errors.push({ flatNumber: flat.flatNumber, error: err.message });
      }
    }
  } catch (err) {
    throw new Error("Failed to generate bills: " + err.message);
  }

  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. PRE-DUE REMINDERS (daily cron — checks if a reminder should go out today)
// ─────────────────────────────────────────────────────────────────────────────
async function sendPreDueReminders() {
  try {
    const settings = await MaintenanceSettings.findOne().lean();
    if (!settings?.sendPreDueReminders) return;

    const reminderDaysBefore = Array.isArray(settings.preDueReminderDays)
      ? settings.preDueReminderDays
      : [7, 2];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const daysBefore of reminderDaysBefore) {
      // Target due date = today + daysBefore
      const targetDue = new Date(today);
      targetDue.setDate(targetDue.getDate() + daysBefore);
      const targetDueEnd = new Date(targetDue);
      targetDueEnd.setHours(23, 59, 59, 999);

      const reminderType = `pre-due-${daysBefore}`;

      // Find pending bills whose due date is exactly targetDue
      const bills = await Maintenance.find({
        status: "Pending",
        dueDate: { $gte: targetDue, $lte: targetDueEnd },
      }).populate("resident", "firstName lastName email")
        .populate("flat", "flatNumber wing");

      for (const bill of bills) {
        // Skip if this reminder was already sent
        const alreadySent = (bill.remindersSent || []).some((r) => r.type === reminderType);
        if (alreadySent) continue;
        if (!bill.resident?.email) continue;

        await sendPreDueReminderEmail(bill.resident, bill.flat, bill, daysBefore).catch(() => {});

        bill.remindersSent.push({ type: reminderType, sentAt: new Date() });
        await bill.save();
      }
    }

    console.log("[Cron] Pre-due reminders processed.");
  } catch (err) {
    console.error("[Cron] Pre-due reminder error:", err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. DAILY STATUS SYNC + OVERDUE CHECK + ESCALATIONS
//    Runs every day at midnight
// ─────────────────────────────────────────────────────────────────────────────
async function runDailyMaintenanceSync() {
  try {
    const settings = await MaintenanceSettings.findOne().lean();
    const gracePeriodDays = Number(settings?.gracePeriodDays ?? 5);
    const now = new Date();
    now.setHours(12, 0, 0, 0); // use noon to avoid timezone edge cases

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    // All unpaid bills
    const unpaidBills = await Maintenance.find({ status: { $in: ["Pending", "Overdue"] } })
      .populate("resident", "firstName lastName email")
      .populate("flat", "flatNumber wing");

    let overdueCount = 0;
    let escalationCount = 0;

    for (const bill of unpaidBills) {
      const prevLevel = bill.escalationLevel;
      const prevStatus = bill.status;

      await syncMaintenanceRecord(bill, settings);

      const daysLate = Math.max(0, Math.floor(
        (now - new Date(bill.dueDate).setHours(23, 59, 59, 999)) / 86400000
      ));

      if (bill.status === "Overdue") {
        overdueCount++;

        // Overdue reminder email (sent once, after overdueReminderDays days late)
        const overdueReminderDays = Number(settings?.overdueReminderDays ?? 3);
        const shouldSendOverdueReminder = settings?.sendOverdueReminder &&
          daysLate >= overdueReminderDays &&
          !(bill.remindersSent || []).some((r) => r.type === "overdue");

        if (shouldSendOverdueReminder && bill.resident?.email) {
          await sendMaintenanceBillEmail(bill.resident, bill.flat, bill, true).catch(() => {});
          bill.remindersSent.push({ type: "overdue", sentAt: new Date() });
          await bill.save();
        }

        // Escalation level 1 email
        if (bill.escalationLevel >= 1 && prevLevel < 1) {
          escalationCount++;
          await sendEscalationEmail(bill.resident, bill.flat, bill, 1).catch(() => {});
          bill.remindersSent.push({ type: "escalation1", sentAt: new Date() });
          await bill.save();
        }

        // Escalation level 2 email (defaulter)
        if (bill.escalationLevel >= 2 && prevLevel < 2) {
          await sendEscalationEmail(bill.resident, bill.flat, bill, 2).catch(() => {});
          bill.remindersSent.push({ type: "escalation2", sentAt: new Date() });
          await bill.save();
        }

        // Escalation level 3 email (admin notified)
        if (bill.escalationLevel >= 3 && prevLevel < 3) {
          await sendEscalationEmail(bill.resident, bill.flat, bill, 3).catch(() => {});
          if (adminEmail) {
            await sendAdminEscalationEmail(adminEmail, bill.resident, bill.flat, bill).catch(() => {});
          }
          bill.remindersSent.push({ type: "escalation3", sentAt: new Date() });
          await bill.save();
        }
      }
    }

    console.log(`[Cron] Daily sync: ${overdueCount} overdue, ${escalationCount} escalated.`);
  } catch (err) {
    console.error("[Cron] Daily sync error:", err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REGISTER ALL CRON JOBS
// ─────────────────────────────────────────────────────────────────────────────
function startScheduler() {
  // Auto-generate bills on 1st of every month at 8:00 AM
  cron.schedule("0 8 1 * *", async () => {
    const settings = await MaintenanceSettings.findOne().lean();
    if (!settings?.autoGenerate) return;

    const now = new Date();
    const month = MONTHS[now.getMonth()];
    const year = now.getFullYear();
    const dueDays = settings?.dueDays ?? 10;

    console.log(`[Cron] Auto-generating bills for ${month} ${year}...`);
    try {
      const results = await generateMonthlyBills({ month, year, dueDays });
      console.log(`[Cron] Bills: ${results.created.length} created, ${results.skipped.length} skipped, ${results.errors.length} errors.`);
    } catch (err) {
      console.error("[Cron] Bill generation error:", err.message);
    }
  });

  // Pre-due reminders — every day at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("[Cron] Sending pre-due reminders...");
    await sendPreDueReminders();
  });

  // Daily status sync, overdue check & escalations — every day at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("[Cron] Running daily maintenance sync...");
    await runDailyMaintenanceSync();
  });

  console.log("[Scheduler] Maintenance cron jobs started.");
}

module.exports = {
  startScheduler,
  generateMonthlyBills,
  sendPreDueReminders,
  runDailyMaintenanceSync,
};