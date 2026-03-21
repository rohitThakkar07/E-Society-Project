const Resident = require("../../../db/models/residentsModel");
const User = require("../../../db/models/userModel");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { sendResidentWelcomeEmail } = require("../../../../utils/sendMail");

/**
 * CREATE RESIDENT
 */
exports.createResident = async (req, res) => {
  console.log(req.body);
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      mobileNumber,
      email,
      wing,
      flatNumber,
      floorNumber,
      flatType,
      residentType,
      moveInDate,
      emergencyContactName,
      emergencyContactNumber,
      status,
      password,
    } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required"
      });
    }

    // check existing user
    if (email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already registered"
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const resident = await Resident.create({
      firstName,
      lastName,
      gender,
      dateOfBirth,
      mobileNumber,
      email,
      wing,
      flatNumber,
      floorNumber,
      flatType,
      residentType,
      moveInDate,
      emergencyContactName,
      emergencyContactNumber,
      status,
    });

    const residentName = `${firstName} ${lastName || ""}`.trim();

    const user = await User.create({
      name: residentName,
      email: email,
      password: hashedPassword,
      role: "resident",
      profileId: resident._id,
    });

    // send mail but don't break API if it fails
    try {
      await sendResidentWelcomeEmail(email, residentName, password);
    } catch (mailError) {
      console.error("Mail error:", mailError.message);
    }

    res.status(201).json({
      success: true,
      message: "Resident created successfully",
      data: resident,
    });

  } catch (error) {
    console.error("Create resident error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create resident. Please try again later."
    });
  }
};


/**
 * GET ALL RESIDENTS
 */
exports.getAllResidents = async (req, res) => {
  try {

    const residents = await Resident.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: residents,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Unable to fetch residents"
    });

  }
};


/**
 * GET RESIDENT BY ID
 */
exports.getResidentById = async (req, res) => {
  try {

    const resident = await Resident.findById(req.params.id);

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

    await User.findOneAndDelete({
      profileId: resident._id,
      role: "resident",
    });

    await Resident.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Resident deleted successfully",
    });

  } catch (error) {

    console.error("Delete resident error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete resident"
    });

  }
};