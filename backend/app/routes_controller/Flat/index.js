const express = require("express");
const router = express.Router();

const flatController = require("./lib/controller");
const flatValidation = require("./lib/validation");

/* ===== CREATE FLAT ===== */

router.post(
  "/create",
  flatValidation.createFlatValidation,
  flatController.createFlat
);


/* ===== GET ALL FLATS ===== */

router.get(
  "/",
  flatController.getAllFlats
);


/* ===== GET FLAT BY ID ===== */

router.get(
  "/:id",
  flatController.getFlatById
);


/* ===== UPDATE FLAT ===== */

router.put(
  "/update/:id",
  flatController.updateFlat
);


/* ===== DELETE FLAT ===== */

router.delete(
  "/delete/:id",
  flatController.deleteFlat
);


module.exports = router;