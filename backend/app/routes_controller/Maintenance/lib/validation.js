const { body } = require("express-validator");

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

exports.createMaintenanceValidation = [
  body("month")
    .notEmpty().withMessage("Month is required")
    .isIn(MONTHS).withMessage("Invalid month"),

  body("year")
    .notEmpty().withMessage("Year is required")
    .isInt({ min: 2000, max: 2100 }).withMessage("Invalid year"),

  body("amount")
    .notEmpty().withMessage("Amount is required")
    .isNumeric().withMessage("Amount must be a number")
    .custom(v => v > 0).withMessage("Amount must be greater than 0"),

  body("dueDate")
    .notEmpty().withMessage("Due date is required")
    .isISO8601().withMessage("Invalid date format"),

  body("lateFee")
    .optional()
    .isNumeric().withMessage("Late fee must be a number")
    .custom(v => v >= 0).withMessage("Late fee cannot be negative"),
];

exports.markAsPaidValidation = [
  body("paymentMethod")
    .notEmpty().withMessage("Payment method is required")
    .isIn(["Cash", "UPI", "Bank Transfer", "Cheque"])
    .withMessage("Invalid payment method"),
];