const Maintenance = require("../../../db/models/maintenanceModel");
const PaymentRecord = require("../../../db/models/paymentRecordModal");
const Resident = require("../../../db/models/residentsModel");
const { validationResult } = require("express-validator");

// ── Create Maintenance (and auto-generate PaymentRecords for all active residents) ──
exports.createMaintenance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { month, year, amount, dueDate, lateFee, description } = req.body;

    // Check duplicate month+year
    const exists = await Maintenance.findOne({ month, year });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: `Maintenance for ${month} ${year} already exists`
      });
    }

    const maintenance = await Maintenance.create({
      month, year, amount, dueDate,
      lateFee: lateFee || 0,
      description
    });

    // Auto-generate one PaymentRecord per active resident
    const residents = await Resident.find({ status: "Active" });

    if (residents.length > 0) {
      const records = residents.map((r) => ({
        maintenance: maintenance._id,
        resident: r._id,
        month,
        year,
        amount,
        lateFee: 0,
        totalAmount: amount,
        status: "Pending"
      }));
      await PaymentRecord.insertMany(records, { ordered: false });
    }

    res.status(201).json({
      success: true,
      message: `Maintenance created and ${residents.length} payment records generated`,
      data: maintenance
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get All Maintenance Periods ──
exports.getAllMaintenance = async (req, res) => {
  try {
    const list = await Maintenance.find().sort({ year: -1, createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Single Maintenance Period ──
exports.getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);
    if (!maintenance) {
      return res.status(404).json({ success: false, message: "Maintenance not found" });
    }
    res.json({ success: true, data: maintenance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Update Maintenance Period ──
exports.updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!maintenance) {
      return res.status(404).json({ success: false, message: "Maintenance not found" });
    }
    res.json({ success: true, message: "Maintenance updated", data: maintenance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Delete Maintenance Period ──
exports.deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
    if (!maintenance) {
      return res.status(404).json({ success: false, message: "Maintenance not found" });
    }
    // Also remove all related payment records
    await PaymentRecord.deleteMany({ maintenance: req.params.id });

    res.json({ success: true, message: "Maintenance and related payment records deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get All Payment Records (with resident info) ──
exports.getAllPaymentRecords = async (req, res) => {
  try {
    const { month, year, status } = req.query;
    const filter = {};
    if (month) filter.month = month;
    if (year) filter.year = Number(year);
    if (status) filter.status = status;

    const records = await PaymentRecord.find(filter)
      .populate("resident", "firstName lastName wing flatNumber mobileNumber email")
      .populate("maintenance", "month year amount dueDate")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Single Payment Record ──
exports.getPaymentRecordById = async (req, res) => {
  try {
    const record = await PaymentRecord.findById(req.params.id)
      .populate("resident")
      .populate("maintenance");

    if (!record) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Mark Payment as Paid ──
exports.markAsPaid = async (req, res) => {
  try {
    const { paymentMethod, transactionId, remarks } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({ success: false, message: "Payment method is required" });
    }

    const record = await PaymentRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }
    if (record.status === "Paid") {
      return res.status(400).json({ success: false, message: "Already marked as paid" });
    }

    // Generate receipt number: RCPT-YEAR-MONTH-ID(last6)
    const receiptNumber = `RCPT-${record.year}-${record.month.slice(0, 3).toUpperCase()}-${record._id.toString().slice(-6).toUpperCase()}`;

    record.status = "Paid";
    record.paymentMethod = paymentMethod;
    record.transactionId = transactionId || null;
    record.remarks = remarks || null;
    record.paidAt = new Date();
    record.receiptNumber = receiptNumber;
    await record.save();

    res.json({ success: true, message: "Payment marked as paid", data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Mark as Overdue ──
exports.markAsOverdue = async (req, res) => {
  try {
    // Mark all pending records past due date as overdue
    const today = new Date();
    const result = await PaymentRecord.updateMany(
      { status: "Pending", dueDate: { $lt: today } },
      { $set: { status: "Overdue" } }
    );
    res.json({ success: true, message: `${result.modifiedCount} records marked as overdue` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Dashboard Summary ──
exports.getMaintenanceSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = {};
    if (month) filter.month = month;
    if (year) filter.year = Number(year);

    const [paid, pending, overdue, total] = await Promise.all([
      PaymentRecord.countDocuments({ ...filter, status: "Paid" }),
      PaymentRecord.countDocuments({ ...filter, status: "Pending" }),
      PaymentRecord.countDocuments({ ...filter, status: "Overdue" }),
      PaymentRecord.countDocuments(filter),
    ]);

    const paidAmount = await PaymentRecord.aggregate([
      { $match: { ...filter, status: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const pendingAmount = await PaymentRecord.aggregate([
      { $match: { ...filter, status: { $in: ["Pending", "Overdue"] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    res.json({
      success: true,
      data: {
        paid, pending, overdue, total,
        paidAmount: paidAmount[0]?.total || 0,
        pendingAmount: pendingAmount[0]?.total || 0,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};