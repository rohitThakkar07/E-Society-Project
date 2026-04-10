const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{
    text:  { type: String, required: true },
    votes: { type: Number, default: 0 },
    votedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resident" }],
  }],
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  expiresAt:  { type: Date, required: true },
  isActive:   { type: Boolean, default: true },
  totalVotes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Poll", pollSchema);