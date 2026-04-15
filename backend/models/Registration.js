const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    department: { type: String, default: "" },
    year: { type: String, default: "" },
  },
  { timestamps: true }
);

// Prevent double registration for same event + email
registrationSchema.index({ event: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
