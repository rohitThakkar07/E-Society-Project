const express = require("express");
const router  = express.Router();
const ctrl    = require("./lib/controller");

router.get("/dashboard", ctrl.getDashboardSummary);
router.get("/report",    ctrl.getReport);

// CRUD
router.post("/create",       ctrl.createExpense);
router.get("/list",          ctrl.getAllExpenses);
router.get("/:id",           ctrl.getExpenseById);
router.put("/update/:id",    ctrl.updateExpense);
router.delete("/delete/:id", ctrl.deleteExpense);

module.exports = router;