const express = require("express");
const router = express.Router();

const controller = require("./lib/controller");
const validation = require("./lib/validation");

/* Register */

router.post(
  "/register",
  validation.registerValidation,
  controller.register
);

/* Login */

router.post(
  "/login",
  validation.loginValidation,
  controller.login
);

module.exports = router;