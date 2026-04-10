const express = require("express");
const router = express.Router();
const controller = require("./lib/controller");

// Must come before /:id to avoid "check-availability" being parsed as an id
router.get("/check-availability", controller.checkAvailability);

router.post("/create", controller.createBooking);
router.get("/list", controller.getAllBookings);
router.get("/:id", controller.getBookingById);
router.put("/update/:id", controller.updateBooking);
router.delete("/delete/:id", controller.deleteBooking);

module.exports = router;