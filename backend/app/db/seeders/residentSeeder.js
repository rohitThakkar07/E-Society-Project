const connectDB = require("../config/db");
const Resident = require("../models/residentsModel");
const User = require("../models/userModel");
const Flat = require("../models/flatModal");
const bcrypt = require("bcrypt");

const indianFirstNames = [
  "Amit", "Suresh", "Neha", "Priya", "Rahul", "Sneha", "Vikas", "Anjali", "Sanjay", "Deepak",
  "Rajesh", "Kavita", "Manish", "Ayesha", "Imran", "Hina", "Tushar", "Alok", "Pankaj", "Sunita",
  "Vijay", "Rekha", "Arvind", "Mukesh", "Gautam", "Ravi", "Kajal", "Rohit", "Virat", "Mehul",
  "Jignesh", "Harsh", "Komal", "Bhavesh", "Nisha", "Hardik", "Manav", "Isha", "Rohan", "Sanya",
  "Abhishek", "Ritu", "Sameer", "Tanvi", "Pranav", "Maya", "Varun", "Aditi", "Kunal", "Tara"
];

const indianLastNames = [
  "Patel", "Shah", "Desai", "Joshi", "Mehta", "Trivedi", "Parmar", "Yadav", "Gupta", "Nair",
  "Verma", "Singh", "Sharma", "Iyer", "Choudhary", "Bhatt", "Pathan", "Sheikh", "Mishra", "Tripathi",
  "Pandya", "Khan", "Malhotra", "Advani", "Kapoor", "Agarwal", "Kohli", "Dhoni", "Bakshi", "Chauhan"
];

const genders = ["Male", "Female"];
const residentTypes = ["Owner", "Tenant"];

const seedResidents = async () => {
  try {
    await connectDB();

    // 1. Clear existing residents and resident-users
    await Resident.deleteMany({});
    await User.deleteMany({ role: "resident" });
    await Flat.updateMany({}, { $set: { resident: null, status: "Vacant", occupancyType: "Vacant" } });
    
    console.log("Cleared existing residents and reset flats.");

    // 2. Get all flats
    const flats = await Flat.find({});
    if (flats.length === 0) {
      console.log("No flats found. Please run seed:flats first.");
      process.exit(1);
    }

    const residentsToInsert = [];
    const usersToInsert = [];
    const flatUpdates = [];

    // 3. Generate 50 residents
    const count = Math.min(50, flats.length);
    const hashedPassword = await bcrypt.hash("Resident@123", 10);

    for (let i = 0; i < count; i++) {
      const flat = flats[i];
      const firstName = indianFirstNames[i % indianFirstNames.length];
      const lastName = indianLastNames[i % indianLastNames.length];
      const gender = genders[Math.floor(Math.random() * genders.length)];
      const fullName = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
      const mobile = `98765${String(i).padStart(5, '0')}`;
      const residentType = residentTypes[Math.floor(Math.random() * residentTypes.length)];

      const residentId = new (require("mongoose")).Types.ObjectId();
      const userId = new (require("mongoose")).Types.ObjectId();

      residentsToInsert.push({
        _id: residentId,
        firstName,
        lastName,
        gender,
        dateOfBirth: new Date(1980 + Math.floor(Math.random() * 25), Math.floor(Math.random() * 12), 1),
        mobileNumber: mobile,
        email,
        flat: flat._id,
        wing: flat.wing || "A", // fallback to A if wing is missing
        flatNumber: flat.flatNumber,
        residentType,
        status: "Active"
      });

      usersToInsert.push({
        _id: userId,
        name: fullName,
        email: email,
        password: hashedPassword,
        role: "resident",
        profileId: residentId,
        status: "Active"
      });

      flatUpdates.push({
        updateOne: {
          filter: { _id: flat._id },
          update: { 
            $set: { 
              resident: residentId, 
              status: "Occupied", 
              occupancyType: residentType,
              "owner.name": residentType === "Owner" ? fullName : (flat.owner?.name || "Original Owner"),
              "owner.phone": residentType === "Owner" ? mobile : (flat.owner?.phone || "9999999999"),
              "owner.email": residentType === "Owner" ? email : (flat.owner?.email || "owner@example.com")
            }
          }
        }
      });
    }

    // 4. Batch Operations
    await Resident.insertMany(residentsToInsert);
    console.log(`${residentsToInsert.length} Resident profiles created.`);

    await User.insertMany(usersToInsert);
    console.log(`${usersToInsert.length} Resident User accounts created. (Password: Resident@123)`);

    await Flat.bulkWrite(flatUpdates);
    console.log(`${flatUpdates.length} Flats updated with occupancy data.`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedResidents();
