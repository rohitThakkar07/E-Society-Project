// routes/guardRoutes.js (FIXED)
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const guardController = require("./lib/controller");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/guards/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "guard-" + uniqueSuffix + path.extname(file.originalname));
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

// SPECIFIC ROUTES FIRST (more specific routes before generic ones)
router.get("/list", guardController.getAllGuards);

router.post("/create", upload.single("idImage"), guardController.createGuard);

router.put("/update/:id", upload.single("idImage"), guardController.updateGuard);

router.put("/status/:id", guardController.updateGuardStatus);

// GENERIC ROUTES LAST (wildcard :id routes at the end)
router.get("/:id", guardController.getGuardById);

router.delete("/delete/:id", guardController.deleteGuard);

module.exports = router;