const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: {
    type: String,
    enum: ["Cleaner", "Electrician", "Plumber", "Security", "Gardener", "Lift Operator", "Other"],
    required: true,
  },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  salary: { type: Number },
  joiningDate: { type: Date },
  status: {
    type: String,
    enum: ["Active", "Inactive", "On Leave"],
    default: "Active",
  },
  assignedArea: { type: String },
  photo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Staff", staffSchema);