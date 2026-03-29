const cron = require("node-cron");
const Flat = require("../app/db/models/flatModal");
const Resident = require("../app/db/models/residentsModel");
const Maintenance = require("../app/db/models/maintenanceModel");
const { sendMaintenanceBillEmail } = require("../utils/maintenanceEmail");

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

/**
 * Generate maintenance bills for all active residents
 * Called automatically on 1st of every month, or manually by admin
 */
async function generateMonthlyBills({ month, year, dueDays = 10, lateFeeAmount = 0, lateFeePercent = 0 }) {
    const results = { created: [], skipped: [], errors: [] };

    try {
        // Fetch all occupied flats with resident populated
        const flats = await Flat.find({ status: "Occupied" }).populate("resident");

        for (const flat of flats) {
            try {
                if (!flat.resident || flat.resident.status !== "Active") {
                    results.skipped.push({ flatNumber: flat.flatNumber, reason: "No active resident" });
                    continue;
                }

                // Check if bill already exists for this month/year
                const existing = await Maintenance.findOne({
                    flat: flat._id,
                    month,
                    year,
                });

                if (existing) {
                    results.skipped.push({ flatNumber: flat.flatNumber, reason: "Bill already exists" });
                    continue;
                }

                // Calculate due date
                const dueDate = new Date(year, MONTHS.indexOf(month), dueDays);

                // Calculate late fee
                const baseAmount = flat.monthlyMaintenance || 0;
                let lateFee = 0;
                if (lateFeeAmount > 0) lateFee = lateFeeAmount;
                else if (lateFeePercent > 0) lateFee = Math.round((baseAmount * lateFeePercent) / 100);

                const maintenance = new Maintenance({
                    resident: flat.resident._id,
                    flat: flat._id,
                    month,
                    year,
                    amount: baseAmount,
                    lateFee,
                    dueDate,
                    status: "Pending",
                });

                await maintenance.save();

                // Send email notification
                if (flat.resident.email) {
                    await sendMaintenanceBillEmail(flat.resident, flat, maintenance);
                }

                results.created.push({
                    flatNumber: flat.flatNumber,
                    resident: `${flat.resident.firstName} ${flat.resident.lastName || ""}`,
                    amount: baseAmount,
                    email: flat.resident.email || "No email",
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

/**
 * Mark overdue maintenance records and apply late fees
 * Runs daily at midnight
 */
async function checkAndMarkOverdue() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const overdueBills = await Maintenance.find({
            status: "Pending",
            dueDate: { $lt: today },
        }).populate("resident flat");

        for (const bill of overdueBills) {
            bill.status = "Overdue";
            await bill.save();

            // Optionally send overdue reminder email
            if (bill.resident?.email) {
                await sendMaintenanceBillEmail(bill.resident, bill.flat, bill, true);
            }
        }

        console.log(`[Cron] Marked ${overdueBills.length} bills as Overdue`);
    } catch (err) {
        console.error("[Cron] Error marking overdue:", err.message);
    }
}

/**
 * Register all cron jobs
 */
function startScheduler() {
    // Generate bills on 1st of every month at 8:00 AM
    cron.schedule("0 8 1 * *", async () => {
        const now = new Date();
        const month = MONTHS[now.getMonth()];
        const year = now.getFullYear();
        console.log(`[Cron] Generating monthly bills for ${month} ${year}`);
        try {
            const results = await generateMonthlyBills({ month, year });
            console.log(`[Cron] Bills generated:`, results);
        } catch (err) {
            console.error("[Cron] Error generating bills:", err.message);
        }
    });

    // Check overdue bills every day at midnight
    cron.schedule("0 0 * * *", async () => {
        console.log("[Cron] Checking overdue maintenance bills...");
        await checkAndMarkOverdue();
    });

    console.log("[Scheduler] Maintenance cron jobs started.");
}

module.exports = { startScheduler, generateMonthlyBills, checkAndMarkOverdue };