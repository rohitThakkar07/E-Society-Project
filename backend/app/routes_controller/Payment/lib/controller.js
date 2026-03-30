const PaymentRecord = require("../../../db/models/paymentRecordModal");
const Maintenance   = require("../../../db/models/maintenanceModel");
const { createPaymentIntent, confirmPayment } = require("../../../../utils/stripe");

// ── STEP 1: Create Payment Intent ─────────────────────────────────────────────
// Frontend calls this first to get a clientSecret before showing payment UI
exports.initiatePayment = async (req, res) => {
  try {
    const { maintenanceId } = req.body;

    const bill = await Maintenance.findById(maintenanceId);
    if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });
    if (bill.status === "Paid") return res.status(400).json({ success: false, message: "Already paid" });

    const totalAmount = bill.amount + (bill.lateFee || 0);

    const intent = await createPaymentIntent({
      amount:   totalAmount,
      currency: "inr",
      metadata: { maintenanceId, resident: bill.resident.toString() },
    });

    res.json({
      success:         true,
      clientSecret:    intent.clientSecret,
      paymentIntentId: intent.paymentIntentId,
      amount:          totalAmount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── STEP 2: Confirm Payment ───────────────────────────────────────────────────
// Frontend calls this after user submits payment method
exports.createPayment = async (req, res) => {
  try {
    const { maintenanceId, paymentMethod, paymentIntentId, transactionId: manualTxnId } = req.body;

    const bill = await Maintenance.findById(maintenanceId);
    if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });
    if (bill.status === "Paid") return res.status(400).json({ success: false, message: "Already paid" });

    // Confirm through dummy Stripe
    const result = await confirmPayment({ paymentIntentId, paymentMethod });

    if (!result.success) {
      return res.status(402).json({ success: false, message: result.error });
    }

    const transactionId  = result.transactionId || manualTxnId;
    const receiptNumber  = `RCPT-${Date.now()}`;
    const totalAmount    = bill.amount + (bill.lateFee || 0);

    // Save payment record
    const payment = await PaymentRecord.create({
      maintenance:   maintenanceId,
      resident:      bill.resident,
      totalAmount,
      paymentMethod,
      transactionId,
      paidAt:        new Date(),
      receiptNumber,
    });

    // Update maintenance bill
    bill.status   = "Paid";
    bill.paidDate = new Date();
    bill.paymentHistory.push({
      amount:        totalAmount,
      mode:          paymentMethod,
      transactionId,
      date:          new Date(),
    });
    await bill.save();

    res.status(201).json({
      success: true,
      data: {
        payment,
        receiptNumber,
        transactionId,
        paidAt: result.paidAt,
      },
      message: "Payment Successful",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET ALL PAYMENTS (Admin) ───────────────────────────────────────────────────
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await PaymentRecord.find()
      .populate("resident", "firstName lastName flatNumber")
      .populate("maintenance", "month year amount")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET MY PAYMENTS (Resident) ─────────────────────────────────────────────────
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await PaymentRecord.find({ resident: req.user.profileId })
      .populate("maintenance", "month year amount lateFee")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};