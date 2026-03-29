const Alert = require("../../../db/models/alertModal");
const { sendAlertEmail } = require("../../../../utils/sendAlertEmail");
const Resident = require("../../../db/models/residentsModel"); 

const createAlert = async (req, res) => {
  try {
    const { title, message, type } = req.body;
 
    if (!title || !message || !type)
      return res.status(400).json({
        success: false,
        message: "title, message and type are required.",
      });
 
    // 1. Save alert to DB
    const alert = await Alert.create(req.body);
 
    console.log("alert created successfully");   
    // 2. Fetch all active resident emails (non-blocking)
    Resident.find({ status: "Active" }, "email")
      .then((residents) => {
        const emails = residents
          .map((r) => r.email)
          .filter(Boolean); // remove null/empty
 
        if (emails.length > 0) {
          sendAlertEmail(emails, { title, message, type }).catch((err) =>
            console.error("Alert email send failed (non-critical):", err)
          );
        }
      })
      .catch((err) => console.error("Failed to fetch resident emails:", err));
 
    res.status(201).json({ success: true, data: alert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const getAllAlerts = async (req, res) => {
  try {
    const { type, severity, status } = req.query;
    const filter = {};
    if (type && type !== "All") filter.type = type;
    if (severity && severity !== "All") filter.severity = severity;
    if (status && status !== "All") filter.status = status;
    const alerts = await Alert.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ success: false, message: "Alert not found" });
    res.json({ success: true, data: alert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: "Resolved", resolvedAt: new Date() },
      { new: true }
    );
    if (!alert) return res.status(404).json({ success: false, message: "Alert not found" });
    res.json({ success: true, data: alert, message: "Alert resolved." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteAlert = async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Alert deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createAlert, getAllAlerts, getAlertById, resolveAlert, deleteAlert };