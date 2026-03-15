const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema(
  {
    wing: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },

    flatNumber: {
      type: String,
      required: true,
      trim: true
    },

    floorNumber: {
      type: Number,
      required: true
    },

    flatType: {
      type: String,
      required: true,
      enum: ["1BHK", "2BHK", "3BHK", "4BHK"]
    },

    status: {
      type: String,
      enum: ["Occupied", "Vacant"],
      default: "Vacant"
    }
  },
  { timestamps: true }
);

flatSchema.index({ wing: 1, flatNumber: 1 }, { unique: true });

module.exports = mongoose.model("Flat", flatSchema);