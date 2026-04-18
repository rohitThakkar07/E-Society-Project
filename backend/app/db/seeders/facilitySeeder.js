const connectDB = require("../config/db");
const Facility = require("../models/facilityModel");

const facilityData = [
  {
    name: "Golden Jubilee Clubhouse",
    description: "Multi-purpose clubhouse for society gatherings and private parties.",
    status: "Available",
    bookingType: "daily",
    pricePerDay: 5000,
    openTime: "08:00",
    closeTime: "22:00"
  },
  {
    name: "Emerald Swimming Pool",
    description: "Olympic-sized swimming pool with separate kids' section.",
    status: "Available",
    bookingType: "hourly",
    pricePerHour: 100,
    openTime: "06:00",
    closeTime: "21:00"
  },
  {
    name: "Olympic Badminton Court",
    description: "Two indoor wooden-floored badminton courts.",
    status: "Available",
    bookingType: "hourly",
    pricePerHour: 200,
    openTime: "06:00",
    closeTime: "22:00"
  },
  {
    name: "Premier Mini Theater",
    description: "20-seater mini theater for private movie screenings or sports matches.",
    status: "Available",
    bookingType: "hourly",
    pricePerHour: 500,
    openTime: "10:00",
    closeTime: "23:00"
  },
  {
    name: "Zen Yoga & Meditation Studio",
    description: "Quiet and peaceful studio for yoga and meditation sessions.",
    status: "Available",
    bookingType: "hourly",
    pricePerHour: 0, // Free for residents
    openTime: "05:00",
    closeTime: "20:00"
  },
  {
    name: "Executive Guest Suite",
    description: "Comfortable guest rooms for residents' visiting families.",
    status: "Available",
    bookingType: "daily",
    pricePerDay: 1500,
    openTime: "00:00",
    closeTime: "23:59"
  },
  {
    name: "Pro-Lite Gym & Fitness Center",
    description: "Fully equipped gym with cardio and weight training sections.",
    status: "Maintenance",
    bookingType: "hourly",
    pricePerHour: 0,
    openTime: "05:30",
    closeTime: "22:30"
  },
  {
    name: "Sky-View Tennis Court",
    description: "Outdoor tennis court with floodlights for evening play.",
    status: "Available",
    bookingType: "hourly",
    pricePerHour: 300,
    openTime: "06:00",
    closeTime: "22:00"
  },
  {
    name: "Interactive Indoor Games Room",
    description: "Equipped with Table Tennis, Carrom, and Chess boards.",
    status: "Available",
    bookingType: "hourly",
    pricePerHour: 50,
    openTime: "09:00",
    closeTime: "21:00"
  },
  {
    name: "Green Garden Party Lawn",
    description: "Large outdoor lawn for grand celebrations and festivals.",
    status: "Available",
    bookingType: "daily",
    pricePerDay: 8000,
    openTime: "10:00",
    closeTime: "23:30"
  }
];

const seedFacilities = async () => {
  try {
    await connectDB();

    // 1. Clear existing facilities
    await Facility.deleteMany({});
    console.log("🗑️ Cleared existing facilities.");

    // 2. Insert 10 facilities
    await Facility.insertMany(facilityData);
    console.log(`✅ ${facilityData.length} Facilities seeded successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding facilities failed:", error);
    process.exit(1);
  }
};

seedFacilities();
