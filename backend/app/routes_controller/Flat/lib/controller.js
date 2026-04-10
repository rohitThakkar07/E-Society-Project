const Flat = require("../../../db/models/flatModal");

const createFlat = async (req, res) => {
  try {
    const { flatNumber, floor, type } = req.body;
    if (!flatNumber || floor === undefined || !type)
      return res.status(400).json({ success: false, message: "flatNumber, floor and type are required." });
    const exists = await Flat.findOne({ flatNumber });
    if (exists) return res.status(409).json({ success: false, message: `Flat ${flatNumber} already exists.` });
    const flat = await Flat.create(req.body);
    res.status(201).json({ success: true, data: flat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllFlats = async (req, res) => {
  try {
    const { block, status, type, occupancyType } = req.query;
    const filter = {};
    if (block && block !== "All") filter.block = block;
    if (status && status !== "All") filter.status = status;
    if (type && type !== "All") filter.type = type;
    if (occupancyType && occupancyType !== "All") filter.occupancyType = occupancyType;
    const flats = await Flat.find(filter).populate("resident", "name phone").sort({ flatNumber: 1 });
    res.json({ success: true, data: flats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFlatById = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id).populate("resident", "name phone email");
    if (!flat) return res.status(404).json({ success: false, message: "Flat not found" });
    res.json({ success: true, data: flat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateFlat = async (req, res) => {
  try {
    const flat = await Flat.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate("resident", "name phone");
    if (!flat) return res.status(404).json({ success: false, message: "Flat not found" });
    res.json({ success: true, data: flat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteFlat = async (req, res) => {
  try {
    const flat = await Flat.findByIdAndDelete(req.params.id);
    if (!flat) return res.status(404).json({ success: false, message: "Flat not found" });
    res.json({ success: true, message: "Flat deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const all = await Flat.find();
    res.json({
      success: true,
      data: {
        total:            all.length,
        occupied:         all.filter(f => f.status === "Occupied").length,
        vacant:           all.filter(f => f.status === "Vacant").length,
        underMaintenance: all.filter(f => f.status === "Under Maintenance").length,
        ownerOccupied:    all.filter(f => f.occupancyType === "Owner").length,
        tenantOccupied:   all.filter(f => f.occupancyType === "Tenant").length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createFlat, getAllFlats, getFlatById, updateFlat, deleteFlat, getDashboardSummary };


// const Flat = require("../../../db/models/flatModal");
// const { validationResult } = require("express-validator");

// /* ================= CREATE FLAT ================= */

// exports.createFlat = async (req, res) => {
//     console.log(req.body)
//   try {

//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: errors.array()[0].msg
//       });
//     }

//     const flat = await Flat.create(req.body);

//     res.status(201).json({
//       success: true,
//       message: "Flat created successfully",
//       data: flat
//     });

//   } catch (error) {

//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Flat already exists in this wing"
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "Unable to create flat"
//     });
//   }
// };


// /* ================= GET ALL FLATS ================= */

// exports.getAllFlats = async (req, res) => {
//   try {

//     const flats = await Flat.find().sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: flats
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch flats"
//     });

//   }
// };


// /* ================= GET FLAT BY ID ================= */

// exports.getFlatById = async (req, res) => {
//   try {

//     const flat = await Flat.findById(req.params.id);

//     if (!flat) {
//       return res.status(404).json({
//         success: false,
//         message: "Flat not found"
//       });
//     }

//     res.json({
//       success: true,
//       data: flat
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: "Unable to fetch flat"
//     });

//   }
// };


// /* ================= UPDATE FLAT ================= */

// exports.updateFlat = async (req, res) => {
//   try {

//     const flat = await Flat.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     if (!flat) {
//       return res.status(404).json({
//         success: false,
//         message: "Flat not found"
//       });
//     }

//     res.json({
//       success: true,
//       message: "Flat updated successfully",
//       data: flat
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: "Unable to update flat"
//     });

//   }
// };


// /* ================= DELETE FLAT ================= */

// exports.deleteFlat = async (req, res) => {
//   try {

//     const flat = await Flat.findByIdAndDelete(req.params.id);

//     if (!flat) {
//       return res.status(404).json({
//         success: false,
//         message: "Flat not found"
//       });
//     }

//     res.json({
//       success: true,
//       message: "Flat deleted successfully"
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: "Unable to delete flat"
//     });

//   }
// };