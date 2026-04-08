const { body } = require("express-validator");
const { STRONG_PASSWORD_REGEX, STRONG_PASSWORD_MESSAGE } = require("../../../../utils/passwordPolicy");

const ResidentValidation = [
  // Personal Info
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").optional({ checkFalsy: true }).trim(),
body("gender")
  .notEmpty().withMessage("Gender is required")
  .isIn(["Male", "Female"]).withMessage("Invalid selection"), 
   body("dateOfBirth").optional({ checkFalsy: true }).isISO8601().withMessage("Invalid date of birth"),
  
  // Contact Info
  body("mobileNumber").notEmpty().withMessage("Mobile number is required").matches(/^[0-9]{10}$/).withMessage("Mobile number must be exactly 10 digits"),
  body("email").optional({ checkFalsy: true }).trim().isEmail().withMessage("Invalid email").normalizeEmail(),

 // Flat Details - Allow fallback for denormalization
body("wing").trim().notEmpty().withMessage("Wing/Block is required"),
body("flatNumber").trim().notEmpty().withMessage("Flat number is required"),
 
  // Resident Details
  body("residentType").notEmpty().withMessage("Resident type is required").isIn(["Owner", "Tenant"]).withMessage("Resident type must be Owner or Tenant"),
  body("moveInDate").optional({ checkFalsy: true }).isISO8601().withMessage("Invalid move in date"),
  
  // Identity Details
  body("idProofType").optional({ checkFalsy: true }).isIn(["Aadhaar", "PAN", "Driving License", "Passport"]).withMessage("Invalid ID proof type"),
  body("idProofNumber").optional({ checkFalsy: true }).trim(),
  
  // Emergency Contact
  body("emergencyContactName").optional({ checkFalsy: true }).trim(),
  body("emergencyContactNumber").optional({ checkFalsy: true }).matches(/^[0-9]{10}$/).withMessage("Emergency contact number must be exactly 10 digits"),
  
  // Status & Account
  body("status").optional({ checkFalsy: true }).isIn(["Active", "Inactive"]).withMessage("Status must be Active or Inactive"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .matches(STRONG_PASSWORD_REGEX).withMessage(STRONG_PASSWORD_MESSAGE)
];

module.exports = {
  ResidentValidation
};
