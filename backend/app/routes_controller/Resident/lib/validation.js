const { body } = require("express-validator");

const ResidentValidation = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("mobileNumber").notEmpty().withMessage("Mobile number is required"),
  body("wing").notEmpty().withMessage("Wing is required"),
  body("flatNumber").notEmpty().withMessage("Flat number is required"),
  body("residentType").notEmpty().withMessage("Resident type is required")
];

module.exports = {
  ResidentValidation
};