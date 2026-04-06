const User = require("../../../db/models/userModel");
const { assertResidentOrGuardProfileActive } = require("../../../../utils/profileAccess");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
});

/* Register Resident */
const registerResident = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullName, name, email, password, role } = req.body;
    const residentName = name || fullName;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: residentName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "Resident"
    });


    console.log("after send email");
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Resident created and welcome email sent!",
      user: userResponse
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* Login */

const login = async (req, res) => {
  console.log(req.body)
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email: (email || "").toLowerCase() });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({
        success: false,
        message: "Account is inactive. Contact admin.",
      });
    }

    const profileCheck = await assertResidentOrGuardProfileActive(user);
    if (!profileCheck.ok) {
      return res.status(profileCheck.status || 403).json({
        success: false,
        message: profileCheck.message,
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ success: true, token, user: userResponse });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

/* Logout */
const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};
/* Forgot Password - Send OTP */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "No account found with this email address." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    // Use updateOne to avoid full-document validation (profileId required check)
    await User.updateOne(
      { _id: user._id },
      { $set: { resetToken: otp, resetTokenExpiry: otpExpiry } }
    );

    // Send email with OTP
    const mailOptions = {
      from: `"E-Society" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP - E-Society",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password for your E-Society account.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #007bff; color: white; padding: 15px 30px; border-radius: 5px; font-size: 24px; font-weight: bold; display: inline-block;">
                ${otp}
              </div>
            </div>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              This OTP will expire in 15 minutes. If you didn't request this password reset, please ignore this email.
            </p>
            <p style="color: #999; font-size: 14px; margin-top: 20px;">
              For security reasons, please do not share this OTP with anyone.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error.message || error);
    res.status(500).json({ message: error.message || "Failed to send OTP. Please try again." });
  }
};

/* Reset Password - Verify OTP & Set New Password */
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "Email, OTP, and new password are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.resetToken || user.resetToken !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date())
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Use updateOne to avoid full-document validation (profileId required check)
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword }, $unset: { resetToken: "", resetTokenExpiry: "" } }
    );

    res.json({ success: true, message: "Password reset successfully! You can now log in." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Password reset failed. Please try again." });
  }
};

module.exports = {
  // registerResident,
  login,
  logout,
  forgotPassword,
  resetPassword,
};