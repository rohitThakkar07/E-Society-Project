// controllers/guardController.js
const bcrypt = require("bcrypt");
const { sendGuardWelcomeEmail } = require("../../../../utils/sendMail");
const Guard = require("../../../db/models/guardModal");
const User = require("../../../db/models/userModel");

// ✅ CREATE GUARD
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

    // Validate required fields
    if (!firstName || !lastName || !mobileNumber || !password || !city) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: firstName, lastName, mobileNumber, password, city",
      });
    }

    const fullName = `${firstName} ${lastName}`.trim();

    // Check mobile duplicate
    const existingMobile = await Guard.findOne({ mobileNumber });
    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

    // Check email duplicate (if provided)
    if (emailAddress) {
      const existingEmail = await Guard.findOne({ emailAddress });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
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
      firstName,
      lastName,
      fullName: fullName || "Unknown",
      mobileNumber,
      password: hashedPassword,
      alternativeNumber: alternativeNumber || null,
      emailAddress: emailAddress || null,
      city,
      guardId,
      shift: shift || "Day",
      joiningDate: joiningDate || new Date(),
      idType,
      idNumber,
      status: status || "Active",
      idImage: req.file ? req.file.path : null,
    });

    const savedGuard = await newGuard.save();

    // Create login user
    await User.create({
      name: fullName,
      email: emailAddress || `${mobileNumber}@guard.local`,
      password: hashedPassword,
      role: "guard",
      profileId: savedGuard._id,
    });

    // Send welcome email
    if (emailAddress) {
      try {
        await sendGuardWelcomeEmail(emailAddress, fullName, password);
      } catch (emailError) {
        console.log("Email sending failed but guard created:", emailError);
      }
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

// ✅ GET ALL GUARDS
exports.getAllGuards = async (req, res) => {
  try {
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

// ✅ GET SINGLE GUARD BY ID
exports.getGuardById = async (req, res) => {
  try {
    const { id } = req.params;

    const guard = await Guard.findById(id);

    if (!guard) {
      return res.status(404).json({
        success: false,
        message: "Guard not found",
      });
    }

    res.status(200).json({
      success: true,
      data: guard,
    });
  } catch (error) {
    console.error("Error fetching guard:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ✅ UPDATE GUARD
exports.updateGuard = async (req, res) => {
  try {
    const { id } = req.params;
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

    // Find guard
    const guard = await Guard.findById(id);

    if (!guard) {
      return res.status(404).json({
        success: false,
        message: "Guard not found",
      });
    }

    // Check if mobile already exists (for other guards)
    if (mobileNumber && mobileNumber !== guard.mobileNumber) {
      const existingMobile = await Guard.findOne({ 
        mobileNumber,
        _id: { $ne: id }
      });
      if (existingMobile) {
        return res.status(400).json({
          success: false,
          message: "Mobile number already exists",
        });
      }
    }

    // Check if email already exists (for other guards)
    if (emailAddress && emailAddress !== guard.emailAddress) {
      const existingEmail = await Guard.findOne({ 
        emailAddress,
        _id: { $ne: id }
      });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // Prepare update data
    const updateData = {
      firstName: firstName || guard.firstName,
      lastName: lastName || guard.lastName,
      fullName: firstName && lastName 
        ? `${firstName} ${lastName}` 
        : guard.fullName,
      mobileNumber: mobileNumber || guard.mobileNumber,
      alternativeNumber: alternativeNumber !== undefined ? alternativeNumber : guard.alternativeNumber,
      emailAddress: emailAddress !== undefined ? emailAddress : guard.emailAddress,
      city: city || guard.city,
      shift: shift || guard.shift,
      joiningDate: joiningDate || guard.joiningDate,
      idType: idType || guard.idType,
      idNumber: idNumber || guard.idNumber,
      status: status || guard.status,
    };

    // Handle password update
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
      
      // Update user password as well
      await User.findOneAndUpdate(
        { profileId: id, role: "guard" },
        { password: updateData.password }
      );
    }

    // Handle image update
    if (req.file) {
      updateData.idImage = req.file.path;
    }

    // Update guard
    const updatedGuard = await Guard.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Update user info if email or name changed
    await User.findOneAndUpdate(
      { profileId: id, role: "guard" },
      {
        name: updatedGuard.fullName,
        email: updatedGuard.emailAddress || `${updatedGuard.mobileNumber}@guard.local`,
      }
    );

    res.status(200).json({
      success: true,
      message: "Guard updated successfully",
      data: updatedGuard,
    });
  } catch (error) {
    console.error("Error updating guard:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// ✅ DELETE GUARD
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

    // Delete related user
    await User.findOneAndDelete({
      profileId: guard._id,
      role: "guard",
    });

    // Delete guard
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

// ✅ UPDATE GUARD STATUS (for toggle Active/Inactive)
exports.updateGuardStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["Active", "Inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'Active' or 'Inactive'",
      });
    }

    const guard = await Guard.findById(id);

    if (!guard) {
      return res.status(404).json({
        success: false,
        message: "Guard not found",
      });
    }

    const updatedGuard = await Guard.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Guard status updated successfully",
      data: updatedGuard,
    });
  } catch (error) {
    console.error("Error updating guard status:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};