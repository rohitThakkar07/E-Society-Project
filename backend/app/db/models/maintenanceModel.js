const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({

  month: {
    type: String,
    enum: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    required: true
  },

  amount: {
    type: Number,
    required: true
  },
   year: {
    type: Number,
    required: true
  },

  dueDate: {
    type: Date,
    required: true
  },

  lateFee: {
    type: Number,
    default: 0
  },

  description: {
    type: String
  },

}, { timestamps: true });

module.exports = mongoose.model("Maintenance", maintenanceSchema);