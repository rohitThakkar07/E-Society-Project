const express = require("express");
const router = express.Router();
const ctrl = require("./lib/controller");

router.post("/create",        ctrl.createAlert);
router.get("/list",           ctrl.getAllAlerts);
router.get("/:id",            ctrl.getAlertById);
router.put("/resolve/:id",    ctrl.resolveAlert);
router.delete("/delete/:id",  ctrl.deleteAlert);

module.exports = router;
// Register in server.js: app.use("/alert", require("./alerts/alertRoutes"));