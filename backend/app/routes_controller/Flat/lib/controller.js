const Flat = require("../../../db/models/flatModal");
const { validationResult } = require("express-validator");

/* ================= CREATE FLAT ================= */

exports.createFlat = async (req, res) => {
    console.log(req.body)
  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const flat = await Flat.create(req.body);

    res.status(201).json({
      success: true,
      message: "Flat created successfully",
      data: flat
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Flat already exists in this wing"
      });
    }

    res.status(500).json({
      success: false,
      message: "Unable to create flat"
    });
  }
};


/* ================= GET ALL FLATS ================= */

exports.getAllFlats = async (req, res) => {
  try {

    const flats = await Flat.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: flats
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Unable to fetch flats"
    });

  }
};


/* ================= GET FLAT BY ID ================= */

exports.getFlatById = async (req, res) => {
  try {

    const flat = await Flat.findById(req.params.id);

    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat not found"
      });
    }

    res.json({
      success: true,
      data: flat
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Unable to fetch flat"
    });

  }
};


/* ================= UPDATE FLAT ================= */

exports.updateFlat = async (req, res) => {
  try {

    const flat = await Flat.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat not found"
      });
    }

    res.json({
      success: true,
      message: "Flat updated successfully",
      data: flat
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Unable to update flat"
    });

  }
};


/* ================= DELETE FLAT ================= */

exports.deleteFlat = async (req, res) => {
  try {

    const flat = await Flat.findByIdAndDelete(req.params.id);

    if (!flat) {
      return res.status(404).json({
        success: false,
        message: "Flat not found"
      });
    }

    res.json({
      success: true,
      message: "Flat deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Unable to delete flat"
    });

  }
};