const mongoose = require("mongoose");

const societySchema = new mongoose.Schema({
  name: { type: String, default: "E-SOCIETY" },
  logo: { type: String }, // Path to logo image
  address: { type: String },
  contactNumber: { type: String },
  email: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Society", societySchema);
