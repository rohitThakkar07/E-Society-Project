const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema({
  flatNumber: { type: String, required: true, trim: true },
  floor:      { type: Number, required: true },
  wing:       { type: String, trim: true, required: true },
  type:       { type: String, enum: ["2BHK", "3BHK", "4BHK"], required: true },

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

  monthlyMaintenance: { type: Number, default: 0 },
}, { timestamps: true });

flatSchema.index({ flatNumber: 1, wing: 1 }, { unique: true });
module.exports = mongoose.model("Flat", flatSchema);