const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configure upload destination
const upload = multer({ dest: "uploads/" }); 

const guardController = require("./lib/controller");

// @route   GET /api/guards/list
router.get("/list", guardController.getAllGuards);

// @route   GET /api/guards/:id
// router.get("/:id", guardController.getGuardById);

// @route   POST /api/guards/create
router.post("/create", upload.single("idImage"), guardController.createGuard);

// @route   PUT /api/guards/:id
// router.put("/:id", upload.single("idImage"), guardController.updateGuard);

// @route   DELETE /api/guards/:id
router.delete('/:id', guardController.deleteGuard);

module.exports = router;