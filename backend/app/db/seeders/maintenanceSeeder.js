const connectDB = require("../config/db");
const Maintenance = require("../models/maintenanceModel");
const Resident = require("../models/residentsModel");
const Flat = require("../models/flatModal");
const User = require("../models/userModel");

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const seedMaintenance = async () => {
  try {
    await connectDB();

    // 1. Clear existing maintenance records
    await Maintenance.deleteMany({});
    console.log("Cleared existing maintenance records.");

    // 2. Get all residents
    const residents = await Resident.find({}).populate("flat");
    if (residents.length === 0) {
      console.log("No residents found. Please run seed:residents first.");
      process.exit(1);
    }

    const recordsToInsert = [];
    const currentYear = 2024;
    const currentMonthIndex = new Date().getMonth(); // 3 for April (0-indexed)

    // 3. For each resident, generate bills for the last 4 months
    for (let i = 0; i < residents.length; i++) {
        const resident = residents[i];
        const flat = resident.flat;
        if (!flat) continue;

        const baseAmount = flat.monthlyMaintenance || 2000;

        for (let m = 0; m <= currentMonthIndex; m++) {
            const monthName = months[m];
            const isLatestMonth = m === currentMonthIndex;
            
            // Randomize status: older months are mostly paid, current month is mixed
            let status = "Paid";
            if (isLatestMonth) {
                status = Math.random() > 0.5 ? "Pending" : "Paid";
            } else if (m === currentMonthIndex - 1) {
                status = Math.random() > 0.8 ? "Overdue" : "Paid";
            }

            const dueDate = new Date(currentYear, m, 15); // 15th of the month
            
            const record = {
                resident: resident._id,
                flat: flat._id,
                month: monthName,
                year: currentYear,
                amount: baseAmount,
                lateFee: status === "Overdue" ? 200 : 0,
                dueDate: dueDate,
                status: status,
                paymentHistory: []
            };

            if (status === "Paid") {
                record.paymentHistory.push({
                    date: new Date(currentYear, m, 10), // Paid before due date
                    amount: baseAmount,
                    mode: "Razorpay",
                    transactionId: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`
                });
            }

            recordsToInsert.push(record);
        }
    }

    await Maintenance.insertMany(recordsToInsert);
    console.log(`${recordsToInsert.length} Maintenance records seeded successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding maintenance failed:", error);
    process.exit(1);
  }
};

seedMaintenance();
