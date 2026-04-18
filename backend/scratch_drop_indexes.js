const mongoose = require("mongoose");
require("dotenv").config();

const dropIndex = async () => {
  const dbURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/society_management";
  try {
    await mongoose.connect(dbURI);
    const db = mongoose.connection.db;
    const collection = db.collection("flats");
    
    // Drop the old single-field unique index
    try {
      await collection.dropIndex("flatNumber_1");
      console.log(" Dropped index flatNumber_1");
    } catch (e) {
      console.log(" Index flatNumber_1 not found or already dropped.");
    }

    try {
      await collection.dropIndex("wing_1_flatNumber_1");
      console.log(" Dropped index wing_1_flatNumber_1");
    } catch (e) {
        console.log("Index wing_1_flatNumber_1 not found.");
    }
    
    process.exit(0);
  } catch (error) {
    console.error(" Error:", error);
    process.exit(1);
  }
};

dropIndex();
