const jwt    = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User   = require("../models/User");
const OTP    = require("../models/OTP");
const { sendOTPEmail } = require("../utils/mailer");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// ── POST /api/auth/send-otp ──────────────────────────────────────────────────
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });

    // Must be name.dept@gmail.com  e.g. srikar.cse@gmail.com
    const collegeEmailRegex = /^[a-zA-Z0-9._%+-]+\.(cse|ece|mech|civil|eee|it)@gmail\.com$/i;
    if (!collegeEmailRegex.test(email)) {
      return res.status(400).json({
        error: "Only college department emails are allowed. Format: name.dept@gmail.com  (e.g. srikar.cse@gmail.com)",
      });
    }

    // Already registered?
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "This email is already registered. Please login instead." });
    }

    // Extract dept from email  e.g. srikar.cse@gmail.com → CSE
    const deptMatch = email.match(/\.([a-zA-Z]+)@gmail\.com$/i);
    const dept = deptMatch ? deptMatch[1].toUpperCase() : null;
    if (!dept) return res.status(400).json({ error: "Could not detect department from email." });

    // 5-organizer limit per department (exclude admin accounts)
    const deptCount = await User.countDocuments({ department: dept, isAdmin: false });
    if (deptCount >= 5) {
      return res.status(400).json({
        error: `${dept} department already has 5 organizers. No more registrations allowed for this department.`,
      });
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any old OTP for this email, save new one
    await OTP.deleteMany({ email });
    await OTP.create({ email, code });

    // Send email
    try {
      await sendOTPEmail({ email, code });
      res.json({ message: "Verification code sent to your email.", dept });
    } catch (mailErr) {
      console.error("OTP email failed:", mailErr.message);
      return res.status(500).json({ error: "Failed to send email. Check EMAIL_* config." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/auth/verify-otp ────────────────────────────────────────────────
const verifyOTP = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: "Email and code are required." });

    const record = await OTP.findOne({ email });
    if (!record) return res.status(400).json({ error: "OTP expired or not requested. Please request a new code." });
    if (record.code !== String(code).trim()) return res.status(400).json({ error: "Incorrect code. Please try again." });

    // Delete after successful verify
    await OTP.deleteMany({ email });
    res.json({ message: "Email verified successfully.", verified: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/auth/register ──────────────────────────────────────────────────
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, department } = req.body;

  try {
    // Re-validate email format (belt-and-suspenders)
    const collegeEmailRegex = /^[a-zA-Z0-9._%+-]+\.(cse|ece|mech|civil|eee|it)@gmail\.com$/i;
    if (!collegeEmailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid college email format." });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered." });

    // Final 5-organizer guard
    const deptCount = await User.countDocuments({ department, isAdmin: false });
    if (deptCount >= 5) {
      return res.status(400).json({
        error: `${department} department already has 5 organizers. Registration not allowed.`,
      });
    }

    const user = await User.create({ name, email, password, department });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id:         user._id,
        name:       user.name,
        email:      user.email,
        department: user.department,
        role:       user.role,
        avatar:     user.avatar,
        isAdmin:    user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id:         user._id,
        name:       user.name,
        email:      user.email,
        department: user.department,
        role:       user.role,
        avatar:     user.avatar,
        isAdmin:    user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/auth/me (protected) ─────────────────────────────────────────────
const getMe = async (req, res) => {
  res.json({
    id:         req.user._id,
    name:       req.user.name,
    email:      req.user.email,
    department: req.user.department,
    role:       req.user.role,
    avatar:     req.user.avatar,
    isAdmin:    req.user.isAdmin,
  });
};

module.exports = { sendOTP, verifyOTP, register, login, getMe };
