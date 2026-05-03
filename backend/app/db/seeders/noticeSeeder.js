const connectDB = require("../config/db");
const Notice = require("../models/noticeModal");
const User = require("../models/userModel");

const noticeData = [
  {
    title: "Annual Independence Day Celebration",
    content: "All residents are invited to the flag hoisting ceremony at 8:30 AM followed by cultural programs in the clubhouse.",
    category: "Event",
    priority: "High"
  },
  {
    title: "Scheduled Water Supply Interruption",
    content: "There will be no water supply on Wednesday from 10 AM to 4 PM due to main tank cleaning.",
    category: "Maintenance",
    priority: "High"
  },
  {
    title: "New Parking Policy 2024",
    content: "Please ensure all vehicles have the new society security sticker. Vehicles without stickers will not be allowed from next month.",
    category: "General",
    priority: "Medium"
  },
  {
    title: "Emergency Fire Mock Drill",
    content: "A mandatory fire mock drill will be conducted this Sunday at 11 AM. Please cooperate with the security team.",
    category: "Emergency",
    priority: "High"
  },
  {
    title: "Revised Maintenance Charges",
    content: "The monthly maintenance charges have been revised starting next quarter. Please check the detailed circular in the office.",
    category: "Maintenance",
    priority: "Medium"
  },
  {
    title: "Clubhouse Renovation Notice",
    content: "The swimming pool and gym will remain closed for the next two weeks for scheduled renovation work.",
    category: "Maintenance",
    priority: "Low"
  },
  {
    title: "Blood Donation Drive",
    content: "Join us for the annual blood donation camp in the society premises on 15th May.",
    category: "Event",
    priority: "Medium"
  },
  {
    title: "Lift Maintenance Schedule",
    content: "Lift A1 will be under maintenance tomorrow from 1 PM to 3 PM. Please use Lift A2.",
    category: "Maintenance",
    priority: "Medium"
  },
  {
    title: "Security Alert: Verification",
    content: "Residents are requested to ensure all their domestic help and workers are properly registered at the main gate.",
    category: "Emergency",
    priority: "High"
  },
  {
    title: "Yoga Classes for Residents",
    content: "Free yoga classes starting this Monday in the community garden at 6:30 AM.",
    category: "Event",
    priority: "Low"
  }
];

const seedNotices = async () => {
  try {
    await connectDB();

    // 1. Clear existing notices
    await Notice.deleteMany({});
    console.log("Cleared existing notices.");

    // 2. Get an admin user
    const admin = await User.findOne({ role: "admin" });

    const noticesToInsert = [];

    // 3. Generate 20 notices
    for (let i = 0; i < 20; i++) {
        const data = noticeData[i % noticeData.length];
        
        // Random date in the last 30 days
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));

        noticesToInsert.push({
            title: data.title + (i >= 10 ? ` #${i+1}` : ""),
            content: data.content,
            category: data.category,
            priority: data.priority,
            postedBy: admin ? admin._id : null,
            isActive: true,
            expiresAt: new Date(Date.now() + 30 * 86400000), // expires in 30 days
            createdAt
        });
    }

    await Notice.insertMany(noticesToInsert);
    console.log(`${noticesToInsert.length} Notices seeded successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding notices failed:", error);
    process.exit(1);
  }
};

seedNotices();
