const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: [true, "Title is required"],
      trim:     true,
    },
    description: {
      type:    String,
      trim:    true,
      default: "",
    },
    date: {
      type:     Date,
      required: [true, "Date is required"],
    },
    time: {
      type:    String,
      trim:    true,
      default: "",
    },
    location: {
      type:    String,
      trim:    true,
      default: "Society Premises",
    },
    organizer: {
      type:    String,
      trim:    true,
      default: "",
    },
    category: {
      type:    String,
      trim:    true,
      default: "General",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);