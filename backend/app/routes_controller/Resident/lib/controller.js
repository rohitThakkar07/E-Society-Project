const Resident = require("../../../db/models/residentsModel");
const User = require("../../../db/models/userModel");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { sendResidentWelcomeEmail } = require("../../../../utils/sendMail");
const Flat = require("../../../db/models/flatModal");

const roleOf = (u) => (u?.role || "").toLowerCase();
const isStaff = (u) => ["guard", "admin"].includes(roleOf(u));

/** Fields a logged-in resident may change on their own profile */
const RESIDENT_SELF_UPDATE_FIELDS = [
  "firstName",
  "lastName",
  "gender",
  "dateOfBirth",
  "mobileNumber",
  "email",
];

async function syncLinkedUserFromResident(resident) {
  await User.findOneAndUpdate(
    { profileId: resident._id, role: "resident" },
    {
      name: `${resident.firstName} ${resident.lastName || ""}`.trim(),
      email: resident.email,
    }
  );
}

exports.createResident = async (req, res) => {
  try {
    if (roleOf(req.user) !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    const { firstName, lastName, email, password, flat, residentType, ...rest } = req.body;

    //  Check flat exists
    const flatDoc = await Flat.findById(flat);
    if (!flatDoc) {
      return res.status(404).json({ success: false, message: "Flat not found" });
    }

    //  Prevent assigning if already occupied
    if (flatDoc.status === "Occupied") {
      return res.status(400).json({
        success: false,
        message: "Flat already occupied",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create Resident
    const resident = await Resident.create({
      firstName,
      lastName,
      email,
      flat,
      residentType,
      profileImage: req.file ? req.file.path : null, 
      ...rest,
    });

    //  Create User
    await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      role: "resident",
      profileId: resident._id,
    });

    flatDoc.resident = resident._id;
    flatDoc.status = "Occupied";
    flatDoc.occupancyType = residentType; // Owner or Tenant

    await flatDoc.save();

    //  Email
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
    if (!isStaff(req.user)) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    const residents = await Resident.find()
      .populate("flat", "flatNumber block floor type status occupancyType monthlyMaintenance")
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
  try {
    if (roleOf(req.user) === "resident") {
      if (req.params.id !== req.user.profileId.toString()) {
        return res.status(403).json({ success: false, message: "Access denied." });
      }
    }

    const resident = await Resident.findById(req.params.id)
      .populate("flat", "flatNumber block floor type status occupancyType monthlyMaintenance");

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
    const isSelfResident =
      roleOf(req.user) === "resident" &&
      req.params.id === req.user.profileId.toString();

    if (roleOf(req.user) === "resident" && !isSelfResident) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    if (isSelfResident) {
      const payload = {};
      for (const key of RESIDENT_SELF_UPDATE_FIELDS) {
        if (req.body[key] !== undefined) payload[key] = req.body[key];
      }

      if ("dateOfBirth" in payload) {
        if (payload.dateOfBirth === "" || payload.dateOfBirth == null) {
          payload.dateOfBirth = null;
        } else {
          const d = new Date(payload.dateOfBirth);
          payload.dateOfBirth = isNaN(d.getTime()) ? null : d;
        }
      }

      const resident = await Resident.findByIdAndUpdate(req.params.id, payload, {
        new: true,
        runValidators: true,
      }).populate("flat");

      if (!resident) {
        return res.status(404).json({ success: false, message: "Resident not found" });
      }

      await syncLinkedUserFromResident(resident);

      return res.json({
        success: true,
        message: "Profile updated successfully",
        data: resident,
      });
    }

    const body = { ...req.body };
    delete body.password;

    if (req.file) {
      body.profileImage = req.file.path;
    }

    const resident = await Resident.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    }).populate("flat");

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    await syncLinkedUserFromResident(resident);

    res.json({
      success: true,
      message: "Resident updated successfully",
      data: resident,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or mobile already in use.",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Unable to update resident",
    });
  }
};


/**
 * DELETE RESIDENT
 */
exports.deleteResident = async (req, res) => {
  try {
    if (roleOf(req.user) !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    const { id } = req.params;

    const resident = await Resident.findById(id);

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    //  UPDATE FLAT BACK TO VACANT
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