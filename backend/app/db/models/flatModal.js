const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema({
  flatNumber: { type: String, required: true, unique: true, trim: true },
  floor:      { type: Number, required: true },
  block:      { type: String, trim: true },
  type:       { type: String, enum: ["1BHK", "2BHK", "3BHK", "4BHK"], required: true },
  area:       { type: Number },
  owner: {
    name:  { type: String },
    phone: { type: String },
    email: { type: String },
  },
  status: {
    type: String,
    enum: ["Occupied", "Vacant", "Under Maintenance"],
    default: "Vacant",
  },
  occupancyType: {
    type: String,
    enum: ["Owner", "Tenant", "Vacant"],
    default: "Vacant",
  },
  resident: { type: mongoose.Schema.Types.ObjectId, ref: "Resident" },
  //parkingSlot: { type: String },
  monthlyMaintenance: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Flat", flatSchema);

// const mongoose = require("mongoose");

// const flatSchema = new mongoose.Schema(
//   {
//     wing: {
//       type: String,
//       required: true,
//       trim: true,
//       uppercase: true
//     },

//     flatNumber: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     floorNumber: {
//       type: Number,
//       required: true
//     },

//     flatType: {
//       type: String,
//       required: true,
//       enum: ["1BHK", "2BHK", "3BHK", "4BHK"]
//     },

//     status: {
//       type: String,
//       enum: ["Occupied", "Vacant"],
//       default: "Vacant"
//     }
//   },
//   { timestamps: true }
// );

// flatSchema.index({ wing: 1, flatNumber: 1 }, { unique: true });

// module.exports = mongoose.model("Flat", flatSchema);