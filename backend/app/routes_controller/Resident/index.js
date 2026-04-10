const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const controller = require("./lib/controller");
const validation = require("./lib/validation");

// Configure multer for resident profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/residents/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "resident-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});

// Create
router.post("/create", upload.single("profileImage"), validation.ResidentValidation, controller.createResident);

// List
router.get("/list", controller.getAllResidents);

// Get by id
router.get("/:id", controller.getResidentById);

// Update
router.put("/update/:id", upload.single("profileImage"), controller.updateResident);

// Delete
router.delete("/delete/:id", controller.deleteResident);

module.exports = router;