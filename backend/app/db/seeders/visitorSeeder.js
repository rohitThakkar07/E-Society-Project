const connectDB = require("../config/db");
const Visitor = require("../models/visitorModel");
const Resident = require("../models/residentsModel");

const visitorNames = [
  "Vikram Singh", "Sunil Gupta", "Anita Sharma", "Pankaj Mehra", "Deepak Rao",
  "Suresh Raina", "Hardik Trivedi", "Komal Jha", "Ritu Varma", "Sanjay Dutt",
  "Amitabh Bachchan", "Salman Khan", "Shahrukh Khan", "Aamir Khan", "Akshay Kumar",
  "John Doe", "Jane Smith", "Robert Brown", "Emily Davis", "Michael Wilson"
];

const purposes = ["Visit", "Delivery", "Service", "Guest", "Other"];
const statuses = ["Pending", "Approved", "Inside", "Exited"];

const seedVisitors = async () => {
  try {
    await connectDB();

    // 1. Clear existing visitors
    await Visitor.deleteMany({});
    console.log("🗑️ Cleared existing visitors.");

    // 2. Get all residents
    const residents = await Resident.find({});
    if (residents.length === 0) {
      console.log("❌ No residents found. Please run seed:residents first.");
      process.exit(1);
    }

    const visitorsToInsert = [];

    // 3. Generate 30 visitors
    for (let i = 0; i < 30; i++) {
        const resident = residents[Math.floor(Math.random() * residents.length)];
        const name = visitorNames[i % visitorNames.length];
        const status = statuses[i % statuses.length];
        const purpose = purposes[i % purposes.length];
        
        // Random time in the last 24 hours
        const entryTime = new Date();
        entryTime.setHours(entryTime.getHours() - Math.floor(Math.random() * 24));
        
        let exitTime = null;
        if (status === "Exited") {
            exitTime = new Date(entryTime);
            exitTime.setHours(exitTime.getHours() + 2);
        }

        visitorsToInsert.push({
            visitorName: name,
            mobileNumber: `91234${String(i).padStart(5, '0')}`,
            visitingResident: resident._id,
            wing: resident.wing,
            flatNumber: resident.flatNumber,
            purpose,
            status,
            entryTime,
            exitTime,
            otpVerified: status !== "Pending",
            notes: i % 5 === 0 ? "Regular visitor" : null
        });
    }

    await Visitor.insertMany(visitorsToInsert);
    console.log(`✅ ${visitorsToInsert.length} Visitors seeded successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding visitors failed:", error);
    process.exit(1);
  }
};

seedVisitors();
