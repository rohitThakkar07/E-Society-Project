const express = require("express");
const router = express.Router();
const ctrl = require("./lib/controller");

router.get("/dashboard", ctrl.getDashboardSummary);
router.post("/create", ctrl.createFlat);
router.get("/list", ctrl.getAllFlats);
router.get("/:id", ctrl.getFlatById);
router.put("/update/:id", ctrl.updateFlat);
router.delete("/delete/:id", ctrl.deleteFlat);

module.exports = router;
// Register in server.js: app.use("/flat", require("./flats/flatRoutes"));
// const express = require("express");
// const router = express.Router();

// const flatController = require("./lib/controller");
// const flatValidation = require("./lib/validation");

// /* ===== CREATE FLAT ===== */

// router.post(
//   "/create",
//   flatValidation.createFlatValidation,
//   flatController.createFlat
// );


// /* ===== GET ALL FLATS ===== */

// router.get(
//   "/",
//   flatController.getAllFlats
// );


// /* ===== GET FLAT BY ID ===== */

// router.get(
//   "/:id",
//   flatController.getFlatById
// );


// /* ===== UPDATE FLAT ===== */

// router.put(
//   "/update/:id",
//   flatController.updateFlat
// );


// /* ===== DELETE FLAT ===== */

// router.delete(
//   "/delete/:id",
//   flatController.deleteFlat
// );


// module.exports = router;