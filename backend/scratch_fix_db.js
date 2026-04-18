const mongoose = require("mongoose");
require("dotenv").config();

const clearAndRebuild = async () => {
  const dbURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/society_management";
  try {
    await mongoose.connect(dbURI);
    const db = mongoose.connection.db;
    
    console.log(" Cleaning 'flats' collection indexes...");
    try {
      await db.collection("flats").dropIndexes();
      console.log(" All 'flats' indexes dropped.");
    } catch (e) {
      console.log(" No indexes to drop or collection doesn't exist.");
    }

    console.log("Re-syncing models...");
    const Flat = require("./app/db/models/flatModal");
    const Resident = require("./app/db/models/residentsModel");
    const User = require("./app/db/models/userModel");

    // Force Mongoose to sync indexes
    await Flat.syncIndexes();
    await Resident.syncIndexes();
    await User.syncIndexes();
    console.log("✅ Model indexes synchronized.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

clearAndRebuild();
