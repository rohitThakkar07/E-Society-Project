const Society = require("../../../db/models/societyModel");

// Get settings
exports.getSocietySettings = async (req, res) => {
  try {
    let society = await Society.findOne();
    if (!society) {
      // Create default if not exists
      society = await Society.create({ name: "E-SOCIETY" });
    }
    res.json({ success: true, data: society });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update settings
exports.updateSocietySettings = async (req, res) => {
  try {
    const { name, address, contactNumber, email } = req.body;
    let society = await Society.findOne();
    
    const updateData = { name, address, contactNumber, email };
    if (req.file) {
      updateData.logo = req.file.path;
    }

    if (!society) {
      society = await Society.create(updateData);
    } else {
      society = await Society.findByIdAndUpdate(society._id, updateData, { new: true });
    }

    res.json({ success: true, message: "Society settings updated", data: society });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
