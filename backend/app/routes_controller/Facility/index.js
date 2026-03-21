const express = require("express");
const router = express.Router();
const facilityController = require("./lib/controller");
const auth = require("../../middlewares/authMiddleware"); // Protect these routes

// @route   GET /api/facilities
// Description: Get all society facilities
router.get("/", facilityController.getAllFacilities);

// @route   GET /api/facilities/:id
// Description: Get details for a specific facility
router.get("/:id", facilityController.getFacilityById);

// @route   POST /api/facilities
// Description: Add a new facility (Admin only recommended)
router.post("/", auth, facilityController.createFacility);

// @route   PUT /api/facilities/:id
// Description: Update facility details/status
router.put("/:id", auth, facilityController.updateFacility);

// @route   DELETE /api/facilities/:id
// Description: Remove a facility
router.delete("/:id", auth, facilityController.deleteFacility);

module.exports = router;