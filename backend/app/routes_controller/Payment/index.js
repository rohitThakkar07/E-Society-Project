const express = require("express");
const router = express.Router();
const paymentController = require("./lib/controller");

// Step 1 — get payment intent before showing checkout
router.post("/initiate", paymentController.initiatePayment);

// Step 2 — resident confirms and pays a bill
router.post("/add", paymentController.createPayment);

// Admin sees all receipts
router.get("/list", paymentController.getAllPayments);

// Resident sees their own history
router.get("/my-history", paymentController.getMyPayments);

module.exports = router;