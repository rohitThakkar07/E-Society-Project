const express = require("express");
const router = express.Router();

const controller = require("./lib/controller");
const validation = require("./lib/validation");

// Create
router.post("/create", validation.ResidentValidation, controller.createResident);

// List
router.get("/list", controller.getAllResidents);

// Get by id
router.get("/:id", controller.getResidentById);

// Update
router.put("/update/:id", controller.updateResident);

// Delete
router.delete("/delete/:id", controller.deleteResident);

module.exports = router;