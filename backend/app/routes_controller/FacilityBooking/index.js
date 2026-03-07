const express = require("express");
const router = express.Router();

const controller = require("./lib/controller");

// Create booking
router.post("/create", controller.createBooking);

// Get all bookings
router.get("/list", controller.getAllBookings);

// Get booking by ID
router.get("/:id", controller.getBookingById);

// Update booking
router.put("/update/:id", controller.updateBooking);

// Delete booking
router.delete("/delete/:id", controller.deleteBooking);

module.exports = router;