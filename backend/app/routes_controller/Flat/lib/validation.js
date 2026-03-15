const { body } = require("express-validator");

exports.createFlatValidation = [
  body("wing")
    .notEmpty()
    .withMessage("Wing is required"),

  body("flatNumber")
    .notEmpty()
    .withMessage("Flat number is required"),

  body("floorNumber")
    .notEmpty()
    .withMessage("Floor number is required")
    .isNumeric()
    .withMessage("Floor number must be a number"),

  body("flatType")
    .notEmpty()
    .withMessage("Flat type is required")
    .isIn(["1BHK", "2BHK", "3BHK", "4BHK"])
    .withMessage("Invalid flat type"),

  body("status")
    .optional()
    .isIn(["Occupied", "Vacant"])
    .withMessage("Status must be Occupied or Vacant")
];