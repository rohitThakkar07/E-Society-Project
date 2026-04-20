const express = require("express");
const router = express.Router();

const controller = require("./lib/controller");
const validation = require("./lib/validation");

/* Login */
router.post(
  "/login",
  validation.loginValidation,
  controller.login
);

// Logout
router.post("/logout", controller.logout);

const authMiddleware = require("../../middlewares/authMiddleware");

// Forgot Password - Send OTP
router.post("/forgot-password", controller.forgotPassword);

// Verify OTP only (no password change)
router.post("/verify-otp", controller.verifyOtp);

// Reset Password - Verify OTP & Set New Password
router.post("/reset-password", controller.resetPassword);

// Force Password Change on First Login
router.post("/change-first-password", authMiddleware, controller.changeFirstPassword);

// Change Password using Old Password
router.post("/change-password", authMiddleware, controller.changePassword);

module.exports = router;