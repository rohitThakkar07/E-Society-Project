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

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint
};