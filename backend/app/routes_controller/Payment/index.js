const express = require("express");
const router = express.Router();
const paymentController = require("./lib/controller");

// Step 1 — Create Razorpay order before showing checkout
router.post("/initiate", paymentController.initiatePayment);

// Step 2 — Verify payment signature and save to database
router.post("/verify", paymentController.createPayment);

// Admin sees all receipts with filters
router.get("/list", paymentController.getAllPayments);

// Resident sees their own payment history
router.get("/my-history", paymentController.getMyPayments);

// Get specific payment details
router.get("/:paymentId", paymentController.getPaymentDetails);

// Get receipt for printing/download
router.get("/receipt/:receiptNumber", paymentController.getReceipt);

module.exports = router;