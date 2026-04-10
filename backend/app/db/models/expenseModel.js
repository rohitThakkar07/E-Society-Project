const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    category: {
      type: String,
      enum: ["Electricity", "Water", "Salary", "Maintenance", "Other"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    date: {
      type: Date,
      required: true,
    },

    paymentMode: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer"],
      required: true,
    },

    description: {
      type: String,
    },

    // Derived from date — auto-filled by pre-save hook
    month: {
      type: String, // e.g. "March"
    },

    year: {
      type: Number, // e.g. 2026
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// FIX: Use async pre-save (no next parameter) — compatible with Mongoose 6+
expenseSchema.pre("save", async function () {
  if (this.date) {
    const d = new Date(this.date);
    this.month = d.toLocaleString("default", { month: "long" }); // "March"
    this.year  = d.getFullYear();                                  // 2026
  }
});

module.exports = mongoose.model("Expense", expenseSchema);