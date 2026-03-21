const Notice = require("../../../db/models/noticeModal");
const { validationResult } = require("express-validator");

// ── Create Notice ──
exports.createNotice = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, content, type, expiresAt, pollOptions, targetRoles, attachments, priority } = req.body;

    // Poll validation
    if (type === "Poll" && (!pollOptions || pollOptions.length < 2)) {
      return res.status(400).json({ success: false, message: "Polls require at least 2 options" });
    }

    // Build initial pollResults map
    let pollResults = {};
    if (type === "Poll" && pollOptions?.length) {
      pollOptions.forEach(opt => { pollResults[opt] = 0; });
    }

    const notice = await Notice.create({
      title,
      content,
      type: type || "General",
      postedBy: req.user.id,
      expiresAt: expiresAt || null,
      pollOptions: type === "Poll" ? pollOptions : [],
      pollResults,
      targetRoles: targetRoles || ["all"],
      attachments: attachments || [],
      priority: priority || "Normal",
    });

    res.status(201).json({ success: true, message: "Notice created successfully", data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get All Notices ──
exports.getAllNotices = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    // Auto-expire: mark notices past expiresAt as inactive
    await Notice.updateMany(
      { expiresAt: { $lt: new Date() }, isActive: true },
      { $set: { isActive: false } }
    );

    const notices = await Notice.find(filter)
      .populate("postedBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: notices.length, data: notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Notice By ID ──
exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate("postedBy", "name email role");

    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }
    res.json({ success: true, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Update Notice ──
exports.updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }
    res.json({ success: true, message: "Notice updated", data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Delete Notice ──
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }
    res.json({ success: true, message: "Notice deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Toggle Active Status ──
exports.toggleActive = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }
    notice.isActive = !notice.isActive;
    await notice.save();
    res.json({ success: true, message: `Notice ${notice.isActive ? "activated" : "deactivated"}`, data: notice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Vote on Poll ──
exports.votePoll = async (req, res) => {
  try {
    const { option } = req.body;
    const userId = req.user.id;

    if (!option) {
      return res.status(400).json({ success: false, message: "Option is required" });
    }

    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }
    if (notice.type !== "Poll") {
      return res.status(400).json({ success: false, message: "This notice is not a poll" });
    }
    if (!notice.isActive) {
      return res.status(400).json({ success: false, message: "This poll is closed" });
    }
    if (!notice.pollOptions.includes(option)) {
      return res.status(400).json({ success: false, message: "Invalid poll option" });
    }

    // Check if already voted
    const alreadyVoted = notice.votedUsers.some(id => id.toString() === userId);
    if (alreadyVoted) {
      return res.status(400).json({ success: false, message: "You have already voted on this poll" });
    }

    // Atomic increment using $inc on the Map field
    const updateKey = `pollResults.${option}`;
    await Notice.findByIdAndUpdate(req.params.id, {
      $inc: { [updateKey]: 1 },
      $push: { votedUsers: userId }
    });

    const updated = await Notice.findById(req.params.id);
    res.json({ success: true, message: "Vote recorded", data: updated.pollResults });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};