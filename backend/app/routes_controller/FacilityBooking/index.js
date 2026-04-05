const express = require("express");
const router = express.Router();
const controller = require("./lib/controller");

router.post("/preview", controller.previewBooking);
router.get("/check-availability", controller.checkAvailability);
router.get("/availability-range", controller.availabilityRange);
router.get("/my", controller.getMyBookings);

router.post("/create", controller.createBooking);
router.get("/list", controller.getAllBookings);
router.get("/:id", controller.getBookingById);
router.put("/update/:id", controller.updateBooking);
router.delete("/delete/:id", controller.deleteBooking);

module.exports = router;
