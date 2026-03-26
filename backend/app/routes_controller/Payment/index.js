const express = require("express");
const router = express.Router();
const paymentController = require("./lib/controller");
// const { protect, adminOnly } = require("../middleware/authMiddleware");

// Resident pays a bill
router.post("/add",
    //  protect, 
    paymentController.createPayment);

// Admin sees all receipts
router.get("/list",
    // protect, adminOnly,
    paymentController.getAllPayments);

// Resident sees their own history
router.get("/my-history",
    // protect,
    paymentController.getMyPayments);

module.exports = router;