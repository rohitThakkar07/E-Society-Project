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
// @desc    Create a new event

router.post(
  "/create",
  createEvent
);
// @access  All logged-in users
router.get(
  "/list",
  getAllEvents
);
// @access  All logged-in users
router.get(
  "/:id",
  getEventById
);
// @access  Admin only
router.put(
  "/update/:id",
  updateEvent
);


// @desc    Delete event

router.delete(
  "/delete/:id",
  deleteEvent
);

module.exports = router;