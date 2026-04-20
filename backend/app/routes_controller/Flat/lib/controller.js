const Flat = require("../../../db/models/flatModal");
const User = require("../../../db/models/userModel");
const Resident = require("../../../db/models/residentsModel");
const createFlat = async (req, res) => {
  try {
    const { flatNumber, floor, wing, type } = req.body;
    if (!flatNumber || floor === undefined || !wing || !type)
      return res.status(400).json({ success: false, message: "flatNumber, floor, wing and type are required." });
    
    const exists = await Flat.findOne({ flatNumber, wing });
    if (exists) return res.status(409).json({ success: false, message: `Flat ${flatNumber} already exists in ${wing}.` });
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
    const flats = await Flat.find(filter)
      .populate("resident", "firstName lastName mobileNumber email")
      .sort({ flatNumber: 1 })
      .lean();
    res.json({ success: true, data: flats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFlatById = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id)
      .populate("resident", "firstName lastName mobileNumber email")
      .lean();
    if (!flat) return res.status(404).json({ success: false, message: "Flat not found" });
    res.json({ success: true, data: flat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const getResidentFlat = async (req, res) => {
  try {
    // userId comes in → look up user → get profileId → find resident
    const user = await User.findById(req.params.userId).select("profileId role").lean();

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role !== "resident") return res.status(403).json({ success: false, message: "Not a resident" });

    const resident = await Resident.findById(user.profileId).populate("flat").lean();

    if (!resident) return res.status(404).json({ success: false, message: "Resident not found" });
    if (!resident.flat) return res.status(404).json({ success: false, message: "No flat assigned" });

    res.json({ success: true, data: resident.flat });
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
    const stats = await Flat.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          occupied: {
            $sum: { $cond: [{ $eq: ["$status", "Occupied"] }, 1, 0] },
          },
          vacant: {
            $sum: { $cond: [{ $eq: ["$status", "Vacant"] }, 1, 0] },
          },
          underMaintenance: {
            $sum: { $cond: [{ $eq: ["$status", "Under Maintenance"] }, 1, 0] },
          },
          ownerOccupied: {
            $sum: { $cond: [{ $eq: ["$occupancyType", "Owner"] }, 1, 0] },
          },
          tenantOccupied: {
            $sum: { $cond: [{ $eq: ["$occupancyType", "Tenant"] }, 1, 0] },
          },
        },
      },
    ]);
    const summary = stats[0] || {
      total: 0,
      occupied: 0,
      vacant: 0,
      underMaintenance: 0,
      ownerOccupied: 0,
      tenantOccupied: 0,
    };

    res.json({
      success: true,
      data: {
        total: summary.total,
        occupied: summary.occupied,
        vacant: summary.vacant,
        underMaintenance: summary.underMaintenance,
        ownerOccupied: summary.ownerOccupied,
        tenantOccupied: summary.tenantOccupied,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createFlat, getAllFlats, getFlatById, getResidentFlat, updateFlat, deleteFlat, getDashboardSummary };
