const Maintenance = require("../../../db/models/maintenanceModel");
const Resident = require("../../../db/models/residentsModel");
const Flat = require("../../../db/models/flatModal"); 
const MaintenanceSettings = require("../../../db/models/maintenanceSetting"); 
const { sendMaintenanceBillEmail, sendMaintenancePaymentReceiptEmail } = require("../../../../utils/maintenanceEmail"); 
const { syncMaintenanceRecord, syncMaintenanceRecords } = require("./lateFee");

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

// ── CREATE (manual - existing) ────────────────────────────────────────────────
const createMaintenance = async (req, res) => {
  try {
    const { resident, month, year, amount, dueDate, lateFee } = req.body;

    const residentDoc = await Resident.findById(resident);
    if (!residentDoc) return res.status(404).json({ success: false, message: "Resident not found" });

    // Check duplicate
    const existing = await Maintenance.findOne({ flat: residentDoc.flat, month, year });
    if (existing) return res.status(400).json({ success: false, message: "Bill already exists for this flat/month/year" });

    const maintenance = await Maintenance.create({
      resident,
      flat: residentDoc.flat,
      month,
      year,
      amount,
      lateFee: lateFee || 0,
      dueDate,
    });

    // Send email if resident has one
    const populated = await Maintenance.findById(maintenance._id)
      .populate("resident")
      .populate("flat");
    if (populated.resident?.email) {
      await sendMaintenanceBillEmail(populated.resident, populated.flat, populated);
    }

    res.status(201).json({ success: true, data: maintenance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GENERATE MONTHLY BILLS ────────────────────────────────────────────────────
const generateMonthlyBills = async (req, res) => {
  try {
    const now = new Date();
    const month = req.body.month || MONTHS[now.getMonth()];
    const year  = req.body.year  || now.getFullYear();

    if (!MONTHS.includes(month)) {
      return res.status(400).json({ success: false, message: "Invalid month name" });
    }

    const settings = await MaintenanceSettings.findOne();
    const dueDays        = settings?.dueDays ?? 10;
    const sendEmailOnGenerate = settings?.sendEmailOnGenerate !== false;

    const results = { created: [], skipped: [], errors: [] };

    // ✅ Query Active residents directly and populate their flat
    const residents = await Resident.find({ status: "Active" }).populate("flat");

    for (const resident of residents) {
      try {
        const flat = resident.flat;

        if (!flat) {
          results.skipped.push({ resident: resident.firstName, reason: "No flat linked" });
          continue;
        }

        // Skip if bill already exists
        const existing = await Maintenance.findOne({ flat: flat._id, month, year });
        if (existing) {
          results.skipped.push({ flatNumber: flat.flatNumber, reason: "Bill already exists" });
          continue;
        }

        const baseAmount = flat.monthlyMaintenance || 0;

        const dueDate = new Date(year, MONTHS.indexOf(month), dueDays);

        const maintenance = await Maintenance.create({
          resident: resident._id,
          flat:     flat._id,
          month,
          year,
          amount:   baseAmount,
          lateFee:  0,
          dueDate,
          status:   "Pending",
        });

        if (sendEmailOnGenerate && resident.email) {
          await sendMaintenanceBillEmail(resident, flat, maintenance);
        }

        results.created.push({
          flatNumber: flat.flatNumber,
          resident:   `${resident.firstName} ${resident.lastName || ""}`.trim(),
          amount:     baseAmount,
          lateFee:    0,
          email:      resident.email || "—",
        });

      } catch (err) {
        const flatDoc = resident.flat;
        const flatNum =
          (flatDoc && typeof flatDoc === "object" && flatDoc.flatNumber) ||
          resident.flatNumber ||
          "—";
        results.errors.push({
          flatNumber: flatNum,
          resident: `${resident.firstName} ${resident.lastName || ""}`.trim(),
          error: err.message,
        });
      }
    }

    res.json({
      success: true,
      message: `Bills generated for ${month} ${year}`,
      summary: {
        created: results.created.length,
        skipped: results.skipped.length,
        errors:  results.errors.length,
      },
      details: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── SETTINGS — GET ────────────────────────────────────────────────────────────
const getSettings = async (req, res) => {
  try {
    let settings = await MaintenanceSettings.findOne();
    if (!settings) settings = await MaintenanceSettings.create({});
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── SETTINGS — SAVE ───────────────────────────────────────────────────────────
const saveSettings = async (req, res) => {
  try {
    const {
      dueDays, lateFeeType, lateFeeAmount, lateFeePercent,
      autoGenerate, sendEmailOnGenerate, sendOverdueReminder, overdueReminderDays,
    } = req.body;

    let settings = await MaintenanceSettings.findOne();
    if (!settings) settings = new MaintenanceSettings();

    if (dueDays             !== undefined) settings.dueDays             = dueDays;
    if (lateFeeType         !== undefined) settings.lateFeeType         = lateFeeType;
    if (lateFeeAmount       !== undefined) settings.lateFeeAmount       = lateFeeAmount;
    if (lateFeePercent      !== undefined) settings.lateFeePercent      = lateFeePercent;
    if (autoGenerate        !== undefined) settings.autoGenerate        = autoGenerate;
    if (sendEmailOnGenerate !== undefined) settings.sendEmailOnGenerate = sendEmailOnGenerate;
    if (sendOverdueReminder !== undefined) settings.sendOverdueReminder = sendOverdueReminder;
    if (overdueReminderDays !== undefined) settings.overdueReminderDays = overdueReminderDays;
    settings.updatedBy = req.user?._id;

    await settings.save();
    res.json({ success: true, data: settings, message: "Settings saved" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── RESEND EMAIL ──────────────────────────────────────────────────────────────
const resendEmail = async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id)
      .populate("resident")
      .populate("flat");

    if (!record) return res.status(404).json({ success: false, message: "Bill not found" });
    if (!record.resident?.email) return res.status(400).json({ success: false, message: "Resident has no email" });

    const result = await sendMaintenanceBillEmail(record.resident, record.flat, record);
    if (result.success) {
      res.json({ success: true, message: "Email sent successfully" });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET MY MAINTENANCE (resident) ─────────────────────────────────────────────
const getMyMaintenance = async (req, res) => {
  try {
    const data = await Maintenance.find({ resident: req.user.profileId })
      .populate("resident", "firstName lastName flatNumber wing")
      .populate("flat", "flatNumber wing floor type");

    await syncMaintenanceRecords(data);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DASHBOARD SUMMARY ─────────────────────────────────────────────────────────
const getDashboardSummary = async (req, res) => {
  try {
    const all = await Maintenance.find();
    await syncMaintenanceRecords(all);

    const paid    = all.filter(r => r.status === "Paid");
    const pending = all.filter(r => r.status === "Pending");
    const overdue = all.filter(r => r.status === "Overdue");

    const monthlyMap = {};
    all.forEach(r => {
      const key = `${r.month}-${r.year}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = { month: `${r.month} ${r.year}`, collected: 0, pending: 0 };
      }
      if (r.status === "Paid") {
        monthlyMap[key].collected += r.amount + (r.lateFee || 0);
      } else {
        monthlyMap[key].pending += r.amount;
      }
    });

    res.json({
      success: true,
      data: {
        total:          all.length,
        paid:           paid.length,
        pending:        pending.length,
        overdue:        overdue.length,
        totalCollected: paid.reduce((sum, r) => sum + r.amount + (r.lateFee || 0), 0),
        totalPending:   pending.reduce((sum, r) => sum + r.amount, 0),
        totalOverdue:   overdue.reduce((sum, r) => sum + r.amount, 0),
        monthlyData:    Object.values(monthlyMap),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
      .populate("resident", "firstName lastName mobileNumber wing flatNumber")
      .populate("flat", "wing flatNumber type")
      .sort({ createdAt: -1 });

    await syncMaintenanceRecords(records);

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

    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    await syncMaintenanceRecord(record);
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
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const record = await Maintenance.findByIdAndUpdate(
      req.params.id, updates, { new: true, runValidators: true }
    ).populate("resident", "flatNumber name phone");

    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    await syncMaintenanceRecord(record);
    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── ADD PAYMENT (partial) ─────────────────────────────────────────────────────
const normalizeMode = (mode) => {
  const value = (mode || "").toString().toLowerCase();
  if (value === "card") return "Card";
  if (value === "netbanking" || value === "net banking") return "Net Banking";
  if (value === "upi") return "UPI";
  if (value === "wallet") return "Wallet";
  if (value === "emandate") return "E-Mandate";
  if (value === "razorpay") return "Razorpay";
  if (value === "cash") return "Cash";
  return "Other";
};

const addPayment = async (req, res) => {
  try {
    const { amount, mode, transactionId } = req.body;

    if (!amount || !mode)
      return res.status(400).json({ success: false, message: "amount and mode are required." });

    const record = await Maintenance.findById(req.params.id)
      .populate("resident", "flatNumber firstName lastName name email");

    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    await syncMaintenanceRecord(record);
    if (record.status === "Paid") return res.status(400).json({ success: false, message: "Already fully paid." });

    record.paymentHistory.push({ amount, mode: normalizeMode(mode), transactionId, date: new Date() });

    const totalPaid = record.paymentHistory.reduce((sum, p) => sum + p.amount, 0);
    const totalDue  = record.amount + (record.lateFee || 0);

    if (totalPaid >= totalDue) {
      record.status   = "Paid";
      record.paidDate = new Date();
    }

    await record.save();

    // Send Receipt if fully paid
    if (record.status === "Paid" && record.resident?.email) {
      const populated = await Maintenance.findById(record._id).populate("flat").populate("resident");
      await sendMaintenancePaymentReceiptEmail(populated.resident, populated.flat, populated);
    }

    res.json({
      success: true,
      data:    record,
      message: record.status === "Paid" ? "Fully paid!" : "Payment recorded.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── MARK AS PAID (one-shot) ───────────────────────────────────────────────────
const markAsPaid = async (req, res) => {
  try {
    const { mode = "Cash", transactionId } = req.body;

    const record = await Maintenance.findById(req.params.id)
      .populate("resident", "flatNumber firstName lastName name email");

    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    await syncMaintenanceRecord(record);
    if (record.status === "Paid") return res.status(400).json({ success: false, message: "Already paid." });

    const totalDue  = record.amount + (record.lateFee || 0);
    const totalPaid = record.paymentHistory.reduce((sum, p) => sum + p.amount, 0);
    const remaining = totalDue - totalPaid;

    if (remaining > 0) {
      record.paymentHistory.push({ amount: remaining, mode: normalizeMode(mode), transactionId, date: new Date() });
    }

    record.status   = "Paid";
    record.paidDate = new Date();
    await record.save();

    // Send Receipt if resident has email
    if (record.resident?.email) {
      const populated = await Maintenance.findById(record._id).populate("flat").populate("resident");
      await sendMaintenancePaymentReceiptEmail(populated.resident, populated.flat, populated);
    }

    res.json({ success: true, data: record, message: "Marked as paid." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE ────────────────────────────────────────────────────────────────────
const deleteMaintenance = async (req, res) => {
  try {
    const record = await Maintenance.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Record not found" });
    res.json({ success: true, message: "Deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  // existing
  createMaintenance,
  getMyMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  addPayment,
  markAsPaid,
  deleteMaintenance,
  getDashboardSummary,
  // new
  generateMonthlyBills,
  getSettings,
  saveSettings,
  resendEmail,
};



