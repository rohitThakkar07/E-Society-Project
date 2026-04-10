const express = require("express");
const router  = express.Router();
const ctrl    = require("./lib/controller");

// Must be before /:id to avoid route conflict
router.get("/dashboard", ctrl.getDashboardSummary);
router.get("/report",    ctrl.getReport);

// CRUD
router.post("/create",       ctrl.createExpense);
router.get("/list",          ctrl.getAllExpenses);
router.get("/:id",           ctrl.getExpenseById);
router.put("/update/:id",    ctrl.updateExpense);
router.delete("/delete/:id", ctrl.deleteExpense);

module.exports = router;
// const express = require("express");
// const router = express.Router();
// const { validationResult } = require("express-validator");

// const controller = require("./lib/controller");
// const validation = require("./lib/validation");

// const validate = (req, res, next) => {

//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       success: false,
//       errors: errors.array()
//     });
//   }

//   next();
// };


// // Create Expense
// router.post(
//   "/create",
//   validation.expenseValidation,
//   validate,
//   controller.createExpense
// );


// // Get All Expenses
// router.get(
//   "/list",
//   controller.getAllExpenses
// );


// // Get Expense By ID
// router.get(
//   "/:id",
//   controller.getExpenseById
// );


// // Update Expense
// router.put(
//   "/update/:id",
//   controller.updateExpense
// );


// // Delete Expense
// router.delete(
//   "/delete/:id",
//   controller.deleteExpense
// );

// module.exports = router;