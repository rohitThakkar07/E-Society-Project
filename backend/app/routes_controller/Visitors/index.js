// const express = require("express");
// const router = express.Router();
// const { validationResult } = require("express-validator");

// const controller = require("./lib/controller");
// const validation = require("./lib/validation");

// const validate = (req, res, next) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       success: false,
//       errors: errors.array()
//     });
//   }
//   next();
// };
// router.post("/create", validation.createVisitorValidation, validate, controller.addVisitor);

// router.post("/verify-otp", controller.verifyVisitorOtp);
// router.get("/list", controller.getAllVisitors);
// router.post("/exit", controller.exitVisitor);
// router.get("/search", controller.searchResident);

// router.get("/:id", controller.getVisitorById);

// router.put("/update/:id", controller.updateVisitor);

// router.delete("/delete/:id", controller.deleteVisitor);

// module.exports = router;

// routes/visitorRoutes.js
const express    = require("express");
const router     = express.Router();
const { body, validationResult } = require("express-validator");
const controller = require("./lib/controller");

// ─── Validation middleware ─────────────────────────────────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const createVisitorValidation = [
  body("visitorName").trim().notEmpty().withMessage("Visitor name is required"),
  body("mobileNumber")
    .notEmpty().withMessage("Mobile number is required")
    .isLength({ min: 10, max: 10 }).withMessage("Mobile number must be 10 digits"),
  body("visitingResident")
    .notEmpty().withMessage("Visiting resident ID is required")
    .isMongoId().withMessage("Invalid resident ID"),
  body("wing").notEmpty().withMessage("Wing is required"),
  body("flatNumber").notEmpty().withMessage("Flat number is required"),
  body("purpose")
    .optional()
    .isIn(["Visit", "Delivery", "Service", "Guest", "Other"])
    .withMessage("Invalid purpose"),
];

// ─── Routes ────────────────────────────────────────────────────────────────

// CRUD
router.post("/create", createVisitorValidation, validate, controller.createVisitor);
router.get("/list",    controller.getAllVisitors);
router.get("/stats/today", controller.getTodayStats);
router.get("/search-residents", controller.searchResidents);
router.get("/my/:residentId",   controller.getMyVisitors);
router.get("/:id",  controller.getVisitorById);
router.put("/update/:id", controller.updateVisitor);
router.delete("/delete/:id", controller.deleteVisitor);

// OTP & Entry Flow
router.post("/verify-otp/:id",  controller.verifyOTP);
router.post("/resend-otp/:id",  controller.resendOTP);
router.put("/allow-entry/:id",  controller.allowEntry);
router.put("/deny/:id",         controller.denyVisitor);
router.put("/exit/:id",         controller.markExit);

module.exports = router;