const express = require("express");
const router  = express.Router();
const ctrl    = require("./lib/controller");

// Dashboard summary
router.get("/summary", ctrl.getDashboardSummary);

// CRUD
router.post("/create",       ctrl.createMaintenance);
router.get("/list",          ctrl.getAllMaintenance);
router.get("/my",            ctrl.getMyMaintenance);

// Payment actions
router.post("/add-payment/:id", ctrl.addPayment);
router.post("/mark-paid/:id",   ctrl.markAsPaid);


router.get("/settings",ctrl.getSettings);
router.put("/settings",ctrl.saveSettings);
router.post("/generate",ctrl.generateMonthlyBills);
router.post("/:id/resend-email", ctrl.resendEmail);
router.get("/:id",           ctrl.getMaintenanceById);
router.put("/update/:id",    ctrl.updateMaintenance);
router.delete("/delete/:id", ctrl.deleteMaintenance);
module.exports = router;