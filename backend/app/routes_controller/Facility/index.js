const express = require("express");
const router = express.Router();
const facilityController = require("./lib/controller");
const auth = require("../../middlewares/authMiddleware"); // Protect these routes

// Description: Get all society facilities
router.get("/list", facilityController.getAllFacilities);

// Description: Get details for a specific facility
router.get("/:id", facilityController.getFacilityById);

// Description: Add a new facility (Admin only recommended)
router.post("/create", auth, facilityController.createFacility);

// Description: Update facility details/status
router.put("/update/:id", auth, facilityController.updateFacility);

// Description: Remove a facility
router.delete("/delete/:id", auth, facilityController.deleteFacility);

module.exports = router;