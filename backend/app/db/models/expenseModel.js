const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    enum: ["Electricity", "Water", "Maintenance", "Salary", "Repair", "Other"],
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  paymentMethod: {
    type: String,
    enum: ["Cash", "UPI", "Bank Transfer"],
    required: true
  },

  expenseDate: {
    type: Date,
    default: Date.now
  },

  description: {
    type: String
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);