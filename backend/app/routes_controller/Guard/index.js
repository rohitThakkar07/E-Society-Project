const express = require("express");
const router = express.Router();
const multer = require("multer");

// Configure where to save uploaded images
const upload = multer({ dest: "uploads/" }); 


const guardController = require("./lib/controller");
// const validation = require("./lib/validation");

// Route to get all guards
router.get("/list", guardController.getAllGuards);

// "idImage" must match the key name used in frontend formData.append("idImage", ...)
router.post("/create", upload.single("idImage"), guardController.createGuard);

// @route   POST /api/guards/create
router.post('/create', guardController.createGuard);


// @route   DELETE /api/guards/:id
router.delete('/:id', guardController.deleteGuard);

module.exports = router;