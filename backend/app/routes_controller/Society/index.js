const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const controller = require("./lib/controller");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, "logo-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/settings", controller.getSocietySettings);
router.post("/update", upload.single("logo"), controller.updateSocietySettings);

module.exports = router;
