const Facility = require("../../../db/models/facilityModel");

// Create Facility
const createFacility = async (req, res) => {
  try {

    const facility = await Facility.create(req.body);

    res.status(201).json({
      success: true,
      message: "Facility created successfully",
      data: facility
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get All Facilities
const getAllFacilities = async (req, res) => {
  try {

    const facilities = await Facility.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: facilities
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Facility By ID
const getFacilityById = async (req, res) => {
  try {

    const facility = await Facility.findById(req.params.id);

    res.json({
      success: true,
      data: facility
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update Facility
const updateFacility = async (req, res) => {
  try {

    const facility = await Facility.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Facility updated",
      data: facility
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete Facility
const deleteFacility = async (req, res) => {
  try {

    await Facility.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Facility deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFacility,
  getAllFacilities,
  getFacilityById,
  updateFacility,
  deleteFacility
};