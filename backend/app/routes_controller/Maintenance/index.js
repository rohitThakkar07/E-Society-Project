const express = require("express");
const router = express.Router();
const { validationResult } = require("express-validator");
const controller = require("./lib/controller");
const { createMaintenanceValidation, markAsPaidValidation } = require("./lib/validation");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// ── Maintenance Periods ──────────────────────────────
// POST   /api/maintenance/create        Create period + auto-generate payment records
router.post("/create", createMaintenanceValidation, validate, controller.createMaintenance);

// GET    /api/maintenance/list          All maintenance periods
router.get("/list", controller.getAllMaintenance);

// GET    /api/maintenance/summary       Dashboard summary (paid/pending/overdue counts + amounts)
router.get("/summary", controller.getMaintenanceSummary);

// GET    /api/maintenance/:id           Single maintenance period
router.get("/:id", controller.getMaintenanceById);

// PUT    /api/maintenance/update/:id    Update maintenance period
router.put("/update/:id", controller.updateMaintenance);

// DELETE /api/maintenance/delete/:id   Delete period + all its payment records
router.delete("/delete/:id", controller.deleteMaintenance);

// ── Payment Records ──────────────────────────────────
// GET    /api/maintenance/payments/list          All payment records (filterable by month/year/status)
router.get("/payments/list", controller.getAllPaymentRecords);

// GET    /api/maintenance/payments/:id           Single payment record
router.get("/payments/:id", controller.getPaymentRecordById);

// PATCH  /api/maintenance/payments/:id/pay       Mark a record as paid
router.patch("/payments/:id/pay", markAsPaidValidation, validate, controller.markAsPaid);

// PATCH  /api/maintenance/payments/mark-overdue  Mark all overdue records
router.patch("/payments/mark-overdue", controller.markAsOverdue);

module.exports = router;