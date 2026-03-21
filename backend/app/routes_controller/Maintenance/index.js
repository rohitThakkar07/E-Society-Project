const express = require("express");
const router  = express.Router();
const ctrl    = require("./lib/controller");

// Dashboard summary
router.get("/dashboard", ctrl.getDashboardSummary);

// CRUD
router.post("/create",       ctrl.createMaintenance);
router.get("/list",          ctrl.getAllMaintenance);
router.get("/:id",           ctrl.getMaintenanceById);
router.put("/update/:id",    ctrl.updateMaintenance);
router.delete("/delete/:id", ctrl.deleteMaintenance);

// Payment actions
router.post("/:id/add-payment", ctrl.addPayment);
router.post("/:id/mark-paid",   ctrl.markAsPaid);

module.exports = router;