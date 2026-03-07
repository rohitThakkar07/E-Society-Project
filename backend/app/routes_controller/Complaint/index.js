const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");

const controller = require("./lib/controller");
const validation = require("./lib/validation");

const validate = (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  next();
};


// Create Complaint
router.post(
  "/create",
  validation.complaintValidation,
  validate,
  controller.createComplaint
);


// Get All Complaints
router.get(
  "/list",
  controller.getAllComplaints
);


// Get Complaint By ID
router.get(
  "/:id",
  controller.getComplaintById
);


// Update Complaint
router.put(
  "/update/:id",
  controller.updateComplaint
);


// Delete Complaint
router.delete(
  "/delete/:id",
  controller.deleteComplaint
);

module.exports = router;