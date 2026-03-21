const express = require("express");
const router = express.Router();
const ctrl = require("./staffController");

router.get("/dashboard", ctrl.getDashboardSummary);
router.post("/create", ctrl.createStaff);
router.get("/list", ctrl.getAllStaff);
router.get("/:id", ctrl.getStaffById);
router.put("/update/:id", ctrl.updateStaff);
router.delete("/delete/:id", ctrl.deleteStaff);

module.exports = router;
// Register in server.js: app.use("/staff", require("./staff/staffRoutes"));