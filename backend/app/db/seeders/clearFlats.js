const connectDB = require("../config/db");
const Flat = require("../models/flatModal");

const clearFlats = async () => {
  try {
    await connectDB();

    // ⚠️ delete all flats
    const result = await Flat.deleteMany();

    console.log(`🗑️ ${result.deletedCount} flats deleted`);

    process.exit();
  } catch (error) {
    console.error("❌ Error deleting flats:", error);
    process.exit(1);
  }
};

clearFlats();