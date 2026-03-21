const Complaint = require("../../../db/models/complaintModel");

// Create Complaint
const createComplaint = async (req, res) => {
  try {

    const complaint = await Complaint.create(req.body);

    res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      data: complaint
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get All Complaints
const getAllComplaints = async (req, res) => {
  try {

    const complaints = await Complaint.find()
      .populate("resident")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: complaints
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Complaint By ID
const getComplaintById = async (req, res) => {
  try {

    const complaint = await Complaint.findById(req.params.id)
      .populate("resident");

    res.json({
      success: true,
      data: complaint
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update Complaint
const updateComplaint = async (req, res) => {
  try {

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Complaint updated successfully",
      data: complaint
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete Complaint
const deleteComplaint = async (req, res) => {
  try {

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Complaint deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // 1. Basic validation of allowed statuses
    const allowedStatuses = ["Pending", "In Progress", "Resolved", "Rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}`
      });
    }

    // 2. Update only the status field
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  updateComplaintStatus,
};