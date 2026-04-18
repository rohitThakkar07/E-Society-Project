const Complaint = require("../../../db/models/complaintModel");
const { sendComplaintResolutionEmail } = require("../../../../utils/complaintEmail");


// ─────────────────────────────────────────────
// Create Complaint
// ─────────────────────────────────────────────
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority, resident } = req.body;

    if (!resident) {
      return res.status(400).json({
        success: false,
        message: "Resident ID is required"
      });
    }

    // FIX: store a relative URL path instead of the full OS file path
    // Previously: attachment = req.file.path  → "/home/.../uploads/complaints/file.jpg" (unusable by client)
    // Now:        attachment = "/uploads/complaints/filename" (usable as an API URL)
    let attachment = null;
    if (req.file) {
      attachment = `/uploads/complaints/${req.file.filename}`;
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      resident,
      attachment
    });

    res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      data: complaint
    });
  } catch (error) {
    // Handle Mongoose validation errors with a clear message
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// Get All Complaints
// ─────────────────────────────────────────────
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("resident")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// Get Complaint By ID
// ─────────────────────────────────────────────
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("resident");

    // FIX: was returning 200 with null data for unknown IDs
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    res.json({ success: true, data: complaint });
  } catch (error) {
    // Catches CastError when req.params.id is not a valid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid complaint ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// Update Complaint
// ─────────────────────────────────────────────
const updateComplaint = async (req, res) => {
  try {
    // FIX: whitelist allowed fields — previously req.body was passed directly,
    // allowing overwrite of resident, _id, status, timestamps, etc.
    const { title, description, category, priority } = req.body;
    const allowedUpdates = { title, description, category, priority };

    // Remove undefined keys so partial updates work correctly
    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true, runValidators: true }
    );

    // FIX: added 404 check — previously no check was done
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    res.json({
      success: true,
      message: "Complaint updated successfully",
      data: complaint
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid complaint ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// Delete Complaint
// ─────────────────────────────────────────────
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    // FIX: was returning success:true even when the document didn't exist
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    res.json({ success: true, message: "Complaint deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid complaint ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// Update Complaint Status
// ─────────────────────────────────────────────
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const allowedStatuses = ["Pending", "In Progress", "Resolved", "Rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}`
      });
    }

    const updateData = { status };

    // FIX: automatically set resolvedAt when status changes to "Resolved"
    // Previously resolvedAt was never set even though the schema had the field
    if (status === "Resolved") {
      updateData.resolvedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("resident");

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    // NEW: If status is Resolved, send resolution email to the resident
    if (complaint.status === "Resolved" && complaint.resident) {
      // We don't await this so it doesn't block the response, 
      // but you can if you want to ensure it's sent before responding.
      sendComplaintResolutionEmail(complaint.resident, complaint);
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: complaint
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid complaint ID format" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  updateComplaintStatus
};