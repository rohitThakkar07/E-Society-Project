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
    month: {
      type: String, 
    },

    year: {
      type: Number,
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
    this.month = d.toLocaleString("default", { month: "long" }); 
    this.year  = d.getFullYear();                                 
  }
});

expenseSchema.index({ year: 1, month: 1, date: -1 });
expenseSchema.index({ category: 1, year: 1, month: 1 });
expenseSchema.index({ paymentMode: 1, date: -1 });

module.exports = mongoose.model("Expense", expenseSchema);