const { body } = require("express-validator");

const expenseValidation = [

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["Electricity", "Water", "Maintenance", "Salary", "Repair", "Other"])
    .withMessage("Invalid category. Must be one of: Electricity, Water, Maintenance, Salary, Repair, Other"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number")
    .custom((value) => value >= 0)
    .withMessage("Amount must be a positive number"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["Cash", "UPI", "Bank Transfer"])
    .withMessage("Invalid payment method. Must be one of: Cash, UPI, Bank Transfer"),

  body("expenseDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),

  body("description")
    .optional()
    .trim(),

];

module.exports = { expenseValidation };