const Resident = require("../../../db/models/residentsModel");
const User = require("../../../db/models/userModel");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { sendResidentWelcomeEmail } = require("../../../../utils/sendMail");
const Flat = require("../../../db/models/flatModal");

exports.createResident = async (req, res) => {
  try {
    const { firstName, lastName, email, password, flat, residentType, ...rest } = req.body;

    // 🔹 Check flat exists
    const flatDoc = await Flat.findById(flat);
    if (!flatDoc) {
      return res.status(404).json({ success: false, message: "Flat not found" });
    }

    // 🔹 Prevent assigning if already occupied
    if (flatDoc.status === "Occupied") {
      return res.status(400).json({
        success: false,
        message: "Flat already occupied",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1️⃣ Create Resident
    const resident = await Resident.create({
      firstName,
      lastName,
      email,
      flat,
      residentType,
      ...rest,
    });

    // 2️⃣ Create User
    await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      role: "resident",
      profileId: resident._id,
    });

    // 3️⃣ 🔥 UPDATE FLAT (MAIN FIX)
    flatDoc.resident = resident._id;
    flatDoc.status = "Occupied";
    flatDoc.occupancyType = residentType; // Owner or Tenant

    await flatDoc.save();

    // 4️⃣ Email
    sendResidentWelcomeEmail(email, `${firstName} ${lastName}`, password)
      .catch(err => console.error("Email failed:", err));

    res.status(201).json({ success: true, data: resident });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate data exists",
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

// In your getAllResidents function:
exports.getAllResidents = async (req, res) => {
  try {
    // Add .populate("flat") here!
    const residents = await Resident.find()
      .populate("flat") 
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: residents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch residents" });
  }
};
/**
 * GET RESIDENT BY ID
 */
exports.getResidentById = async (req, res) => {
  console.log("controller resident get by id");
  try {

    const resident = await Resident.findById(req.params.id).populate('flat');

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found"
      });
    }

    res.json({
      success: true,
      data: resident
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Unable to fetch resident"
    });

  }
};


/**
 * UPDATE RESIDENT
 */
exports.updateResident = async (req, res) => {
  try {

    const { password } = req.body;

    if (password) {
      req.body.password = await bcrypt.hash(password, 10);
    }

    const resident = await Resident.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found"
      });
    }

    res.json({
      success: true,
      message: "Resident updated successfully",
      data: resident,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Unable to update resident"
    });

  }
};


/**
 * DELETE RESIDENT
 */
exports.deleteResident = async (req, res) => {
  try {
    const { id } = req.params;

    const resident = await Resident.findById(id);

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    // 🔥 UPDATE FLAT BACK TO VACANT
    await Flat.findByIdAndUpdate(resident.flat, {
      resident: null,
      status: "Vacant",
      occupancyType: "Vacant",
    });

    await User.findOneAndDelete({
      profileId: resident._id,
      role: "resident",
    });

    await Resident.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Resident deleted & flat vacated",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete resident",
    });
  }
};