const Resident =  require("../../../db/models/residentsModel");

// Create Resident
exports.createResident = async (req, res) => {
  try {
    const resident = await Resident.create(req.body);

    res.status(201).json({
      success: true,
      message: "Resident added successfully",
      data: resident
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get All Residents
exports.getAllResidents = async (req, res) => {
  try {

    const residents = await Resident.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: residents
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Resident By ID
exports.getResidentById = async (req, res) => {
  try {

    const resident = await Resident.findById(req.params.id);

    res.json({
      success: true,
      data: resident
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update Resident
exports.updateResident = async (req, res) => {
  try {

    const resident = await Resident.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Resident updated successfully",
      data: resident
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete Resident
exports.deleteResident = async (req, res) => {
  try {

    await Resident.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Resident deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};