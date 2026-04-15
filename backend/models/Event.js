const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    department:  { type: String, required: true, enum: ["CSE","ECE","MECH","CIVIL","EEE","IT"] },
    date:        { type: String, required: true },   // "YYYY-MM-DD"
    time:        { type: String, required: true },   // "10:00 AM"
    venue:       { type: String, required: true },
    organizer:   { type: String, required: true },   // display name
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    image:       { type: String, default: "" },
    maxCapacity: { type: Number, required: true, min: 1 },
    status:      { type: String, enum: ["upcoming","ongoing","completed"], default: "upcoming" },
    tags:        [{ type: String }],
    featured:    { type: Boolean, default: false },
    googleFormUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// Index for fast date + department queries (Calendar, Dashboard)
eventSchema.index({ date: 1 });
eventSchema.index({ department: 1, date: 1 });
eventSchema.index({ featured: 1 });

module.exports = mongoose.model("Event", eventSchema);
