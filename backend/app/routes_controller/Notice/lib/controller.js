const Notice = require("../../../db/models/noticeModal");

const createNotice = async (req, res) => {
  try {
    const { title, content, category, priority, expiresAt } = req.body;
    if (!title || !content)
      return res.status(400).json({ success: false, message: "title and content are required." });
    const notice = await Notice.create({ title, content, category, priority, expiresAt });
    res.status(201).json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllNotices = async (req, res) => {
  try {
    const { category, priority, isActive } = req.query;
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (priority && priority !== "All") filter.priority = priority;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    const notices = await Notice.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: notices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: "Notice not found" });
    res.json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateNotice = async (req, res) => {
  try {
    const allowed = ["title", "content", "category", "priority", "isActive", "expiresAt"];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const notice = await Notice.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!notice) return res.status(404).json({ success: false, message: "Notice not found" });
    res.json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: "Notice not found" });
    res.json({ success: true, message: "Notice deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createNotice, getAllNotices, getNoticeById, updateNotice, deleteNotice };