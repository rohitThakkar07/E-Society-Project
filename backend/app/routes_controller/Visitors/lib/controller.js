const Visitor = require("../../../db/models/visitorModel");

// Create Visitor Entry
const createVisitor = async (req, res) => {
  try {

    const visitor = await Visitor.create(req.body);

    res.status(201).json({
      success: true,
      message: "Visitor entry created",
      data: visitor
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Visitors
const getAllVisitors = async (req, res) => {
  try {

    const visitors = await Visitor.find()
      .populate("visitingResident")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: visitors
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Visitor by ID
const getVisitorById = async (req, res) => {
  try {

    const visitor = await Visitor.findById(req.params.id)
      .populate("visitingResident");

    res.json({
      success: true,
      data: visitor
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Visitor
const updateVisitor = async (req, res) => {
  try {

    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Visitor updated",
      data: visitor
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Visitor
const deleteVisitor = async (req, res) => {
  try {

    await Visitor.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Visitor deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createVisitor,
  getAllVisitors,
  getVisitorById,
  updateVisitor,
  deleteVisitor
};