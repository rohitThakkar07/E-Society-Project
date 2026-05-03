const connectDB = require("../config/db");
const Event = require("../models/eventModal");
const User = require("../models/userModel");

const eventData = [
  {
    title: "Diwali Celebration 2024",
    description: "Grand Diwali celebration with rangoli competition, snacks, and lights.",
    date: new Date("2024-11-01"),
    time: "07:00 PM",
    location: "Main Clubhouse",
    organizer: "Society Committee",
    category: "Festival"
  },
  {
    title: "Yoga Workshop",
    description: "Join us for a rejuvenating yoga session on International Yoga Day.",
    date: new Date("2024-06-21"),
    time: "06:30 AM",
    location: "Central Park",
    organizer: "Health Club",
    category: "Fitness"
  },
  {
    title: "Annual General Meeting",
    description: "Discussion on society budget and upcoming maintenance project.",
    date: new Date("2024-05-15"),
    time: "10:30 AM",
    location: "Admin Hall",
    organizer: "Secretary",
    category: "Meeting"
  },
  {
    title: "Monsoon Cricket League",
    description: "Inter-wing cricket tournament for all age groups.",
    date: new Date("2024-07-20"),
    time: "08:00 AM",
    location: "Sports Ground",
    organizer: "Sports Committee",
    category: "Sports"
  },
  {
    title: "Kids Painting Contest",
    description: "Creative painting competition for children below 12 years.",
    date: new Date("2024-08-15"),
    time: "04:00 PM",
    location: "Community Garden",
    organizer: "Youth Club",
    category: "Education"
  },
  {
    title: "Holi Dahan & Celebration",
    description: "Traditional bonfire followed by colors and music.",
    date: new Date("2024-03-24"),
    time: "06:00 PM",
    location: "Main Entrance Circle",
    organizer: "Cultural Wing",
    category: "Festival"
  },
  {
    title: "Blood Donation Camp",
    description: "Annual blood donation drive in association with Red Cross.",
    date: new Date("2024-09-10"),
    time: "09:00 AM",
    location: "Medical Center",
    organizer: "Admin Team",
    category: "Social Cause"
  },
  {
    title: "New Year Eve Party",
    description: "Welcome 2025 with DJ and dinner buffet.",
    date: new Date("2024-12-31"),
    time: "09:00 PM",
    location: "Roof Top Lounge",
    organizer: "Event Planners",
    category: "Party"
  },
  {
    title: "Gardening Workshop",
    description: "Learn how to maintain your balcony plants and kitchen garden.",
    date: new Date("2024-10-05"),
    time: "11:00 AM",
    location: "Nursery Area",
    organizer: "Green Society Initiative",
    category: "Social Cause"
  },
  {
    title: "Security Awareness Seminar",
    description: "Important update on new visitor management system and security protocols.",
    date: new Date("2024-04-20"),
    time: "05:00 PM",
    location: "Conference Room B",
    organizer: "Security Agency",
    category: "Security"
  }
];

const seedEvents = async () => {
  try {
    await connectDB();

    // 1. Clear existing events
    await Event.deleteMany({});
    console.log("Cleared existing events.");

    // 2. Get an admin user for createdBy field
    const admin = await User.findOne({ role: "admin" });
    
    const eventsToInsert = eventData.map(ev => ({
      ...ev,
      createdBy: admin ? admin._id : null
    }));

    await Event.insertMany(eventsToInsert);
    console.log(`${eventsToInsert.length} Events seeded successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding events failed:", error);
    process.exit(1);
  }
};

seedEvents();
