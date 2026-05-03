const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
// Load env from backend root
require("dotenv").config({ path: path.join(__dirname, "../../../.env") });

const User = require("../models/userModel");
const connectDB = require("../config/db");

const seedAdmin = async () => {
  try {
    await connectDB();
    
    const email = "owner@gmail.com";
    const password = "temp123";
    
    const existingAdmin = await User.findOne({ email: email.toLowerCase() });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (existingAdmin) {
      existingAdmin.password = hashedPassword;
      existingAdmin.mustChangePassword = true;
      await existingAdmin.save();
      console.log(" Admin user updated: owner@gmail.com / temp123");
    } else {
      // Create a dummy admin. Note: profileId is required by schema.
      // For a pure system admin, we can use a fixed or random ID.
      await User.create({
        name: "Super Admin",
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "admin",
        profileId: new mongoose.Types.ObjectId(), // System admins don't necessarily need a separate profile doc
        mustChangePassword: true,
        status: "Active"
      });
      console.log("Admin user created: owner@gmail.com / temp123");
    }
    
    console.log("First login will now force a password change.");
    
  } catch (err) {
    console.error("Error seeding admin:", err.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedAdmin();
