const express = require("express");
const router  = express.Router();
const { body } = require("express-validator");

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("./lib/controller");

// ─── Validation ───────────────────────────────────────────

// const eventValidation = [
//   body("title")
//     .notEmpty().withMessage("Title is required")
//     .trim(),
//   body("date")
//     .notEmpty().withMessage("Date is required")
//     .isISO8601().withMessage("Invalid date format"),
//   body("description")
//     .optional()
//     .trim(),
//   body("time")
//     .optional()
//     .trim(),
//   body("location")
//     .optional()
//     .trim(),
//   body("organizer")
//     .optional()
//     .trim(),
//   body("category")
//     .optional()
//     .trim(),
// ];

// ─── Routes ───────────────────────────────────────────────
// @desc    Create a new event
// @access  Admin only
router.post(
  "/create",
  createEvent
);

// @route   GET /api/event/list
// @desc    Get all events (supports ?category=X&upcoming=true)
// @access  All logged-in users
router.get(
  "/list",
  getAllEvents
);

// @route   GET /api/event/:id
// @desc    Get single event by ID
// @access  All logged-in users
router.get(
  "/:id",
  getEventById
);

// @route   PUT /api/event/update/:id
// @desc    Update event
// @access  Admin only
router.put(
  "/update/:id",
  updateEvent
);

// @route   DELETE /api/event/delete/:id
// @desc    Delete event
// @access  Admin only
router.delete(
  "/delete/:id",
  deleteEvent
);

module.exports = router;