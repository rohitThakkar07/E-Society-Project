const Staff = require("../../../db/models/staffModal");

const createStaff = async (req, res) => {
  try {
    const { name, role, phone } = req.body;
    if (!name || !role || !phone)
      return res.status(400).json({ success: false, message: "name, role and phone are required." });
    const staff = await Staff.create(req.body);
    res.status(201).json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllStaff = async (req, res) => {
  try {
    const { role, status } = req.query;
    const filter = {};
    if (role && role !== "All") filter.role = role;
    if (status && status !== "All") filter.status = status;
    const staff = await Staff.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: "Staff not found" });
    res.json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!staff) return res.status(404).json({ success: false, message: "Staff not found" });
    res.json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: "Staff not found" });
    res.json({ success: true, message: "Staff deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const all = await Staff.find();
    const summary = {
      total:     all.length,
      active:    all.filter(s => s.status === "Active").length,
      inactive:  all.filter(s => s.status === "Inactive").length,
      onLeave:   all.filter(s => s.status === "On Leave").length,
      byRole:    {},
    };
    all.forEach(s => { summary.byRole[s.role] = (summary.byRole[s.role] || 0) + 1; });
    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createStaff, getAllStaff, getStaffById, updateStaff, deleteStaff, getDashboardSummary };