const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");

const controller = require("./lib/controller");
const validation = require("./lib/validation");
const upload = require("../../middlewares/upload");

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// Multer error handler middleware
const handleUploadError = (err, req, res, next) => {
  if (err) {
    // FIX: catch multer errors (file too large, wrong type) and return proper message
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, message: "File size must not exceed 5MB" });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────

// Create Complaint
router.post(
  "/create",
  (req, res, next) => {
    upload.single("attachment")(req, res, (err) => handleUploadError(err, req, res, next));
  },
  validation.complaintValidation,
  validate,
  controller.createComplaint
);

// Get All Complaints
router.get("/list", controller.getAllComplaints);

// Get Complaint By ID
router.get("/:id", controller.getComplaintById);

// Update Complaint (title, description, category, priority only)
router.put("/update/:id", controller.updateComplaint);

// Delete Complaint
router.delete("/delete/:id", controller.deleteComplaint);

// Update Status Only
// FIX: uses PATCH (not PUT) — matches the dedicated status-update endpoint
router.patch("/status-update/:id", controller.updateComplaintStatus);

module.exports = router;