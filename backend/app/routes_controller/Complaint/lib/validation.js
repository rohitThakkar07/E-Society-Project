const { body } = require("express-validator");

const complaintValidation = [

  body("resident")
    .notEmpty()
    .withMessage("Resident ID is required")
    .isMongoId()
    .withMessage("Invalid resident ID"),

  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .notEmpty()
    .withMessage("Description is required"),

  body("category")
    .isIn(["Water", "Electricity", "Security", "Maintenance", "Other"])
    .withMessage("Invalid category")

];

module.exports = {
  complaintValidation
};