const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const dbURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/society_management";

  try {
    // 2. Attempt connection
    await mongoose.connect(dbURI);
    
    console.log(`✅ MongoDB Connected: ${dbURI.includes('127.0.0.1') ? 'Localhost' : 'Remote Cluster'}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    
    process.exit(1);
  }
};

module.exports = connectDB;