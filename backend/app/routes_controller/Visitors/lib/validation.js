const { body } = require("express-validator");

const createVisitorValidation = [

  body("visitorName")
    .trim()
    .notEmpty()
    .withMessage("Visitor name is required"),

  body("mobileNumber")
    .notEmpty()
    .withMessage("Mobile number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be 10 digits"),

  body("visitingResident")
    .notEmpty()
    .withMessage("Visiting resident ID is required")
    .isMongoId()
    .withMessage("Invalid resident ID"),

  body("wing")
    .notEmpty()
    .withMessage("Wing is required"),

  body("flatNumber")
    .notEmpty()
    .withMessage("Flat number is required"),

  body("purpose")
    .optional()
    .isString()
    .withMessage("Purpose must be text")

];

module.exports = {
  createVisitorValidation
};