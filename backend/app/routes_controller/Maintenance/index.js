const express = require("express");
const router  = express.Router();
const ctrl    = require("./lib/controller");

// Dashboard summary
router.get("/summary", ctrl.getDashboardSummary);

// CRUD
router.post("/create",       ctrl.createMaintenance);
router.get("/list",          ctrl.getAllMaintenance);
router.get("/my",            ctrl.getMyMaintenance);
router.get("/:id",           ctrl.getMaintenanceById);
router.put("/update/:id",    ctrl.updateMaintenance);
router.delete("/delete/:id", ctrl.deleteMaintenance);

// Payment actions
router.post("/add-payment/:id", ctrl.addPayment);
router.post("/mark-paid/:id",   ctrl.markAsPaid);

module.exports = router;