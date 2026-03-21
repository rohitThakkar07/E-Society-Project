const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },

  content: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["General", "Event", "Maintenance", "Poll", "Emergency"],
    default: "General",
    required: true
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  expiresAt: {
    type: Date,
    default: null
  },

  // Poll fields (only used when type = "Poll")
  pollOptions: {
    type: [String],
    default: []
  },

  // { "Yes": 5, "No": 3 }
  pollResults: {
    type: Map,
    of: Number,
    default: {}
  },

  // Track which users have voted (prevent double voting)
  votedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

  targetRoles: {
    type: [String],
    enum: ["admin", "resident", "guard", "all"],
    default: ["all"]
  },

  attachments: {
    type: [String],
    default: []
  },

  priority: {
    type: String,
    enum: ["Low", "Normal", "High", "Urgent"],
    default: "Normal"
  }

}, { timestamps: true });

module.exports = mongoose.model("Notice", noticeSchema);