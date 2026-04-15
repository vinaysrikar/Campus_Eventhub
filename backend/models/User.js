const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:   { type: String, required: true, minlength: 6 },
    department: { type: String, enum: ["CSE","ECE","MECH","CIVIL","EEE","IT"], default: "CSE" },
    role: {
      type: String,
      default: "Organizer",
    },
    avatar:  { type: String, default: "" },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Single pre-save hook: hash password + generate avatar initials
userSchema.pre("save", async function (next) {
  // Hash password only when modified
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  // Auto-generate avatar if empty
  if (!this.avatar && this.name) {
    this.avatar = this.name
      .split(" ")
      .filter(Boolean)
      .map(w => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);
