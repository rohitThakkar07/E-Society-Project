const { body } = require("express-validator");

exports.noticeValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("content").trim().notEmpty().withMessage("Content is required"),
  body("type")
    .optional()
    .isIn(["General", "Event", "Maintenance", "Poll", "Emergency"])
    .withMessage("Invalid notice type"),
  body("expiresAt")
    .optional({ checkFalsy: true })
    .isISO8601().withMessage("Invalid expiry date"),
  body("pollOptions")
    .optional()
    .isArray().withMessage("Poll options must be an array"),
];