const mongoose = require("mongoose");

const organizerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: {
      type: String,
      enum: ["CSE", "ECE", "MECH", "CIVIL", "EEE", "IT"],
      required: true,
    },
    role: { type: String, required: true },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Organizer", organizerSchema);
