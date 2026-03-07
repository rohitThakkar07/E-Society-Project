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

// Create visitor
router.post(
  "/create",
  validation.createVisitorValidation,
  validate,
  controller.createVisitor
);

router.get("/list", controller.getAllVisitors);

router.get("/:id", controller.getVisitorById);

router.put("/update/:id", controller.updateVisitor);

router.delete("/delete/:id", controller.deleteVisitor);

module.exports = router;