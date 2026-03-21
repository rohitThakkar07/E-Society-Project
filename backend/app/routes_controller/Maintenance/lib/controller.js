const Maintenance = require("../../../db/models/maintenanceModel");

// ── CREATE ────────────────────────────────────────────────────────────────────
const createMaintenance = async (req, res) => {
  try {
    const { resident, month, year, amount, lateFee, dueDate, description } = req.body;

    if (!resident || !month || !year || !amount || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "resident, month, year, amount and dueDate are required.",
      });
    }

    // Prevent duplicate charge for same resident + month + year
    const exists = await Maintenance.findOne({ resident, month, year });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: `Maintenance for ${month} ${year} already exists for this resident.`,
      });
    }

    const maintenance = await Maintenance.create({
      resident, month, year, amount, lateFee, dueDate, description,
    });

    const populated = await maintenance.populate("resident", "flatNumber name");

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET ALL ───────────────────────────────────────────────────────────────────
const getAllMaintenance = async (req, res) => {
  try {
    const { month, year, status } = req.query;
    const filter = {};
    if (month)  filter.month  = month;
    if (year)   filter.year   = Number(year);
    if (status) filter.status = status;

    const records = await Maintenance.find(filter)
      .populate("resident", "flatNumber name phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET ONE ───────────────────────────────────────────────────────────────────
const getMaintenanceById = async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id)
      .populate("resident", "flatNumber name phone");

    if (!record)
      return res.status(404).json({ success: false, message: "Record not found" });

    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── UPDATE ────────────────────────────────────────────────────────────────────
const updateMaintenance = async (req, res) => {
  try {
    const allowed = ["amount", "lateFee", "dueDate", "description", "status"];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const record = await Maintenance.findByIdAndUpdate(
      req.params.id, updates, { new: true, runValidators: true }
    ).populate("resident", "flatNumber name phone");

    if (!record)
      return res.status(404).json({ success: false, message: "Record not found" });

    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── ADD PAYMENT (partial payment support) ────────────────────────────────────
const addPayment = async (req, res) => {
  try {
    const { amount, mode, transactionId } = req.body;

    if (!amount || !mode)
      return res.status(400).json({ success: false, message: "amount and mode are required." });

    const record = await Maintenance.findById(req.params.id)
      .populate("resident", "flatNumber name");

    if (!record)
      return res.status(404).json({ success: false, message: "Record not found" });

    if (record.status === "Paid")
      return res.status(400).json({ success: false, message: "Already fully paid." });

    // Add to payment history
    record.paymentHistory.push({ amount, mode, transactionId, date: new Date() });

    // Check if fully paid
    const totalPaid = record.paymentHistory.reduce((sum, p) => sum + p.amount, 0);
    const totalDue  = record.amount + (record.lateFee || 0);

    if (totalPaid >= totalDue) {
      record.status   = "Paid";
      record.paidDate = new Date();
    }

    await record.save();

    res.json({ success: true, data: record, message: record.status === "Paid" ? "Fully paid!" : "Payment recorded." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── MARK AS PAID (full, one-shot) ─────────────────────────────────────────────
const markAsPaid = async (req, res) => {
  try {
    const { mode = "Cash", transactionId } = req.body;

    const record = await Maintenance.findById(req.params.id)
      .populate("resident", "flatNumber name");

    if (!record)
      return res.status(404).json({ success: false, message: "Record not found" });

    if (record.status === "Paid")
      return res.status(400).json({ success: false, message: "Already paid." });

    const totalDue  = record.amount + (record.lateFee || 0);
    const totalPaid = record.paymentHistory.reduce((sum, p) => sum + p.amount, 0);
    const remaining = totalDue - totalPaid;

    // Record the remaining amount as one payment
    if (remaining > 0) {
      record.paymentHistory.push({ amount: remaining, mode, transactionId, date: new Date() });
    }

    record.status   = "Paid";
    record.paidDate = new Date();
    await record.save();

    res.json({ success: true, data: record, message: "Marked as paid." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE ────────────────────────────────────────────────────────────────────
const deleteMaintenance = async (req, res) => {
  try {
    const record = await Maintenance.findByIdAndDelete(req.params.id);
    if (!record)
      return res.status(404).json({ success: false, message: "Record not found" });
    res.json({ success: true, message: "Deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DASHBOARD SUMMARY ─────────────────────────────────────────────────────────
const getDashboardSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = {};
    if (month) filter.month = month;
    if (year)  filter.year  = Number(year);

    const all = await Maintenance.find(filter);

    const totalCollection = all.reduce((sum, r) => sum + r.amount + (r.lateFee || 0), 0);
    const paidRecords     = all.filter((r) => r.status === "Paid");
    const paidAmount      = paidRecords.reduce((sum, r) => sum + r.amount + (r.lateFee || 0), 0);
    const pendingAmount   = totalCollection - paidAmount;

    // Monthly trend (last 6 months)
    const monthlyTrend = await Maintenance.aggregate([
      { $match: { status: "Paid" } },
      { $group: { _id: { month: "$month", year: "$year" }, total: { $sum: { $add: ["$amount", "$lateFee"] } } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
      { $project: { _id: 0, month: "$_id.month", year: "$_id.year", amount: "$total" } },
    ]);

    res.json({
      success: true,
      data: {
        totalCollection,
        paidAmount,
        pendingAmount,
        totalRecords:  all.length,
        paidCount:     paidRecords.length,
        pendingCount:  all.filter((r) => r.status === "Pending").length,
        overdueCount:  all.filter((r) => r.status === "Overdue").length,
        monthlyTrend,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  addPayment,
  markAsPaid,
  deleteMaintenance,
  getDashboardSummary,
};