const bcrypt = require("bcrypt");
const { sendGuardWelcomeEmail }  = require("../../../../utils/sendMail");
const Guard = require("../../../db/models/guardModal");
const User = require("../../../db/models/userModel");

// add guard
exports.createGuard = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      mobileNumber,
      alternativeNumber,
      emailAddress,
      city,
      shift,
      joiningDate,
      idType,
      idNumber,
      password,
      status,
    } = req.body;

    const fullName = `${firstName || ""} ${lastName || ""}`.trim();

    // Check mobile duplicate
    const existingMobile = await Guard.findOne({ mobileNumber });
    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

    // Generate unique Guard ID
    const lastGuard = await Guard.findOne().sort({ createdAt: -1 });

    let guardId = "GRD-001";

    if (lastGuard && lastGuard.guardId) {
      const parts = lastGuard.guardId.split("-");

      if (parts.length === 2 && !isNaN(parts[1])) {
        const lastNumber = parseInt(parts[1], 10);
        const nextNumber = lastNumber + 1;

        guardId = `GRD-${String(nextNumber).padStart(3, "0")}`;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newGuard = new Guard({
      fullName: fullName || "Unknown",
      mobileNumber,
      password: hashedPassword,
      alternativeNumber: alternativeNumber || null,
      emailAddress: emailAddress || null,
      city,
      guardId,
      shift: shift || "Day",
      joiningDate: joiningDate || Date.now(),
      idType,
      idNumber,
      status: status || "Active",
      idImage: req.file ? req.file.path : null,
    });

    const savedGuard = await newGuard.save();

    // Create login user
    await User.create({
      name: fullName,
      email: emailAddress,
      password: hashedPassword,
      role: "guard",
      profileId: savedGuard._id,
    });

    // Send Mail
    if (emailAddress) {
      await sendGuardWelcomeEmail(emailAddress, fullName, password);
    }

    res.status(201).json({
      success: true,
      message: "Guard registered successfully",
      data: savedGuard,
    });
  } catch (error) {
    console.error("Error creating guard:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @desc    Get all guards
exports.getAllGuards = async (req, res) => {
  try {
    // Find all guards and sort by newest first (createdAt: -1)
    const guards = await Guard.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: guards.length,
      data: guards,
    });
  } catch (error) {
    console.error("Error fetching guards:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch guards",
      error: error.message,
    });
  }
};

// @desc    Delete a guard
// @desc    Delete a guard
exports.deleteGuard = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the guard first
    const guard = await Guard.findById(id);

    if (!guard) {
      return res.status(404).json({
        success: false,
        message: "Guard not found",
      });
    }

    // Delete related user (who has this guard profileId)
    await User.findOneAndDelete({
      profileId: guard._id,
      role: "guard",
    });

    // 3️⃣ Delete guard
    await Guard.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Guard deleted successfully",
    });

  } catch (error) {
    console.error("Delete guard error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
