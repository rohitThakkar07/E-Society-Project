const PaymentRecord = require("../../../db/models/paymentRecordModal");
const Maintenance = require("../../../db/models/maintenanceModel");
const Resident = require("../../../db/models/residentsModel");
const { createOrder, verifyPaymentSignature, fetchPaymentDetails } = require("../../../../utils/razorpay");
const { normalizePaymentMode, toSchemaPaymentMethod } = require("./paymentHelpers");

// ── STEP 1: Create Razorpay Order ───────────────────────────────────────────
// Frontend calls this first to get orderId and payment details
exports.initiatePayment = async (req, res) => {
  try {
    const { maintenanceId } = req.body;

    // Validate maintenance bill exists
    const bill = await Maintenance.findById(maintenanceId).populate("resident");
    if (!bill) {
      return res.status(404).json({ success: false, message: "Maintenance bill not found" });
    }

    if (bill.status === "Paid") {
      return res.status(400).json({ success: false, message: "Bill already paid" });
    }

    const totalAmount = bill.amount + (bill.lateFee || 0);

    // Create Razorpay Order
    const orderResult = await createOrder({
      amount: totalAmount,
      currency: "INR",
      metadata: {
        maintenanceId: maintenanceId,
        resident: bill.resident._id.toString(),
        flatNumber: bill.resident.flatNumber,
        month: bill.month,
        year: bill.year,
      },
    });

    if (!orderResult.success) {
      return res.status(500).json({ success: false, message: orderResult.error });
    }

    res.json({
      success: true,
      data: {
        orderId: orderResult.orderId,
        amount: orderResult.amount,
        amountInPaise: orderResult.amountInPaise,
        currency: orderResult.currency,
        resident: {
          id: bill.resident._id,
          name: `${bill.resident.firstName} ${bill.resident.lastName || ""}`.trim(),
          email: bill.resident.email || "",
          phone: bill.resident.mobileNumber || bill.resident.mobile || "",
          flatNumber: bill.resident.flatNumber,
        },
        billDetails: {
          maintenanceId,
          month: bill.month,
          year: bill.year,
          baseAmount: bill.amount,
          lateFee: bill.lateFee || 0,
        },
      },
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Payment initiation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── STEP 2: Verify Payment & Save to Database ────────────────────────────────
// Frontend calls this after successful payment confirmation
exports.createPayment = async (req, res) => {
  try {
    const { maintenanceId, orderId, paymentId, signature } = req.body;

    // Validate inputs
    if (!maintenanceId || !orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment details",
      });
    }

    // Verify Razorpay signature (CRITICAL for security)
    const isSignatureValid = verifyPaymentSignature({
      orderId,
      paymentId,
      signature,
    });

    if (!isSignatureValid) {
      return res.status(403).json({
        success: false,
        message: "Payment signature verification failed - possible fraud",
      });
    }

    // Fetch payment details from Razorpay
    const paymentDetails = await fetchPaymentDetails(paymentId);
    if (!paymentDetails.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch payment details",
      });
    }

    // Verify bill exists and not already paid
    const bill = await Maintenance.findById(maintenanceId).populate("resident");
    if (!bill) {
      return res.status(404).json({ success: false, message: "Bill not found" });
    }

    const existingPayment = await PaymentRecord.findOne({ maintenance: maintenanceId, resident: bill.resident, status: "successful" });
    if (existingPayment && bill.status !== "Paid") {
      bill.status = "Paid";
      bill.paidDate = new Date();
      bill.paymentHistory.push({
        amount: existingPayment.totalAmount,
        mode: normalizePaymentMode(existingPayment.paymentMethod),
        transactionId: existingPayment.razorpayPaymentId,
        date: existingPayment.paidAt || new Date(),
      });
      await bill.save();
    }

    if (bill.status === "Paid") {
      if (existingPayment) {
        return res.status(200).json({
          success: true,
          data: {
            payment: {
              id: existingPayment._id,
              receiptNumber: existingPayment.receiptNumber,
              amount: existingPayment.totalAmount,
              status: existingPayment.status,
              paymentId: existingPayment.razorpayPaymentId,
              orderId: existingPayment.razorpayOrderId,
              paidAt: existingPayment.paidAt,
            },
            billDetails: {
              maintenanceId,
              month: bill.month,
              year: bill.year,
            },
          },
          message: "Bill already marked paid; existing payment returned",
        });
      }

      return res.status(400).json({ success: false, message: "Bill already paid" });
    }

    const totalAmount = bill.amount + (bill.lateFee || 0);

    const paymentMode = normalizePaymentMode(paymentDetails.method);
    const schemaMethod = toSchemaPaymentMethod(paymentDetails.method);

    const paidAmt = Number(paymentDetails.amount);
    const dueAmt = Number(totalAmount);
    if (!Number.isFinite(paidAmt) || Math.abs(paidAmt - dueAmt) > 0.05) {
      return res.status(400).json({
        success: false,
        message: "Payment amount does not match bill amount",
      });
    }

    // Create receipt number
    const receiptNumber = `RZP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Save payment record
    let payment;
    try {
      payment = await PaymentRecord.create({
        maintenance: maintenanceId,
        resident: bill.resident,
        totalAmount,
        lateFee: bill.lateFee || 0,
        paymentGateway: "razorpay",
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        signature_verified: true,
        paymentMethod: schemaMethod,
        cardDetails: schemaMethod === "card" ? {
          last4: paymentDetails.cardId?.last4,
          brand: paymentDetails.cardId?.issuer,
        } : undefined,
        upiId: paymentDetails.method === "upi" ? paymentDetails.vpa : undefined,
        status: "successful",
        receiptNumber,
        paidAt: new Date(),
        notes: {
          month: bill.month,
          year: bill.year,
          description: `Maintenance payment for ${bill.month} ${bill.year}`,
        },
      });
    } catch (err) {
      if (err.code === 11000) {
        const existingPayment = await PaymentRecord.findOne({ maintenance: maintenanceId, resident: bill.resident, status: "successful" });
        if (existingPayment) {
          if (bill.status !== "Paid") {
            bill.status = "Paid";
            bill.paidDate = existingPayment.paidAt || new Date();
            bill.paymentHistory.push({
              amount: existingPayment.totalAmount,
              mode: normalizePaymentMode(existingPayment.paymentMethod),
              transactionId: existingPayment.razorpayPaymentId,
              date: existingPayment.paidAt || new Date(),
            });
            await bill.save();
          }

          return res.status(200).json({
            success: true,
            data: {
              payment: {
                id: existingPayment._id,
                receiptNumber: existingPayment.receiptNumber,
                amount: existingPayment.totalAmount,
                status: existingPayment.status,
                paymentId: existingPayment.razorpayPaymentId,
                orderId: existingPayment.razorpayOrderId,
                paidAt: existingPayment.paidAt,
              },
              billDetails: {
                maintenanceId,
                month: bill.month,
                year: bill.year,
              },
            },
            message: "Duplicate payment prevented; existing payment returned",
          });
        }
      }
      throw err;
    }

    // Update maintenance bill status
    bill.status = "Paid";
    bill.paidDate = new Date();
    bill.paymentHistory.push({
      amount: totalAmount,
      mode: paymentMode,
      transactionId: paymentId,
      date: new Date(),
    });
    await bill.save();

    res.status(201).json({
      success: true,
      data: {
        payment: {
          id: payment._id,
          receiptNumber,
          amount: totalAmount,
          status: "successful",
          paymentId,
          orderId,
          paidAt: payment.paidAt,
        },
        billDetails: {
          maintenanceId,
          month: bill.month,
          year: bill.year,
        },
      },
      message: "Payment successful and verified",
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET ALL PAYMENTS (Admin) ───────────────────────────────────────────────────
exports.getAllPayments = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.paidAt = {};
      if (startDate) filter.paidAt.$gte = new Date(startDate);
      if (endDate) filter.paidAt.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch payments with pagination
    const payments = await PaymentRecord.find(filter)
      .populate("resident", "firstName lastName flatNumber email mobile")
      .populate("maintenance", "month year amount lateFee")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await PaymentRecord.countDocuments(filter);

    res.json({
      success: true,
      data: payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET MY PAYMENTS (Resident) ─────────────────────────────────────────────────
exports.getMyPayments = async (req, res) => {
  try {
    // Get resident profile ID from authenticated user
    const residentId = req.user?.profileId;

    if (!residentId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const payments = await PaymentRecord.find({ resident: residentId })
      .populate("maintenance", "month year amount lateFee status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PaymentRecord.countDocuments({ resident: residentId });

    res.json({
      success: true,
      data: payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get my payments error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET PAYMENT DETAILS ────────────────────────────────────────────────────────
exports.getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await PaymentRecord.findById(paymentId)
      .populate("resident", "firstName lastName flatNumber email mobile")
      .populate("maintenance", "month year amount lateFee");

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GENERATE RECEIPT ────────────────────────────────────────────────────────────
exports.getReceipt = async (req, res) => {
  try {
    const { receiptNumber } = req.params;

    const payment = await PaymentRecord.findOne({ receiptNumber })
      .populate("resident", "firstName lastName flatNumber email mobile")
      .populate("maintenance", "month year amount lateFee");

    if (!payment) {
      return res.status(404).json({ success: false, message: "Receipt not found" });
    }

    // Return receipt data (frontend can generate PDF or use a PDF library)
    res.json({
      success: true,
      data: {
        receiptNumber: payment.receiptNumber,
        paymentId: payment.razorpayPaymentId,
        orderId: payment.razorpayOrderId,
        resident: {
          name: `${payment.resident.firstName} ${payment.resident.lastName}`,
          flatNumber: payment.resident.flatNumber,
          email: payment.resident.email,
          phone: payment.resident.mobile,
        },
        amount: payment.totalAmount,
        baseAmount: payment.totalAmount - (payment.lateFee || 0),
        lateFee: payment.lateFee || 0,
        month: payment.notes?.month,
        year: payment.notes?.year,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};