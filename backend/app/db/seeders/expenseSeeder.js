const connectDB = require("../config/db");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

const expenseTitles = [
  "Main Gate Bulb Replacement", "Garden Hose Repair", "Swimming Pool Chlorine",
  "Security Guard Salary - March", "Lift AMC Charges", "Borewell Pump Repair",
  "Common Area Cleaning Supplies", "CCTV Maintenance", "Electricity Bill - Feb",
  "Water Tank Cleaning", "Pest Control Basement", "Admin Office Stationery",
  "Generator Diesel Refill", "Gym Equipment AMC", "Fire Extinguisher Refill",
  "Intercom System Repair", "New Year Event Decoration", "Staff Tea & Snacks",
  "Parking Line Painting", "Main Office Internet Bill"
];

const categories = ["Electricity", "Water", "Salary", "Maintenance", "Other"];
const paymentModes = ["Cash", "UPI", "Bank Transfer"];

const seedExpenses = async () => {
  try {
    await connectDB();

    // 1. Clear existing expenses
    await Expense.deleteMany({});
    console.log("Cleared existing expenses.");

    // 2. Get an admin user
    const admin = await User.findOne({ role: "admin" });

    const expensesToInsert = [];

    // 3. Generate 40 expenses
    for (let i = 0; i < 40; i++) {
        const title = expenseTitles[i % expenseTitles.length];
        const category = categories[i % categories.length];
        const paymentMode = paymentModes[i % paymentModes.length];
        const amount = Math.floor(Math.random() * 5000) + 500; // 500 to 5500
        
        // Random date in the last 6 months
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 180));

        expensesToInsert.push({
            title: title + (i >= 20 ? ` (Batch ${Math.floor(i/20)+1})` : ""),
            category,
            amount,
            date,
            paymentMode,
            description: `Auto-generated expense for ${title}`,
            addedBy: admin ? admin._id : null
        });
    }

    // Since we use insertMany, the pre-save hook won't trigger for each doc 
    // unless we use options or manually set month/year.
    // However, Mongoose 5.9.27+ supports hooks on insertMany with { lean: false } 
    // but it's safer to just set them or save individually.
    // Let's manually set them to be safe.
    expensesToInsert.forEach(exp => {
        const d = new Date(exp.date);
        exp.month = d.toLocaleString("default", { month: "long" });
        exp.year = d.getFullYear();
    });

    await Expense.insertMany(expensesToInsert);
    console.log(`${expensesToInsert.length} Expenses seeded successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding expenses failed:", error);
    process.exit(1);
  }
};

seedExpenses();
