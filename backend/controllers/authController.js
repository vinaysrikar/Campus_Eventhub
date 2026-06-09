const jwt    = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const User   = require("../models/User");
const OTP    = require("../models/OTP");
const { sendOTPEmail, sendPasswordResetEmail } = require("../utils/mailer");
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

    // 5-organizer limit per department
    const deptCount = await User.countDocuments({ department: dept, isAdmin: false });
    if (deptCount >= 5) {
      return res.status(400).json({
        error: `${dept} department already has 5 organizers. No more registrations allowed.`,
      });
    }

    // Generate 6-digit OTP
    const code = crypto.randomInt(100000, 999999).toString();
    console.log(`\n=========================================`);
    console.log(`🔑 DEV OTP for ${email}: ${code}`);
    console.log(`=========================================\n`);

    // Delete any old OTP for this email, save new one
    await OTP.deleteMany({ email });
    await OTP.create({ email, code });

    // Try to send email — always return code in development so registration can proceed
    try {
      await sendOTPEmail({ email, code });
    } catch (mailErr) {
      console.error("OTP email failed (non-fatal in dev):", mailErr.message);
    }

    // Always return code in dev mode so UI can show it even if email fails
    res.json({
      message: "Verification code sent to your email.",
      dept,
      ...(process.env.NODE_ENV === "development" && { code }),
    });

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

// ── Sample Events for Seeding ────────────────────────────────────────────────
const sampleEventsByDept = {
  CSE: [
    {
      title: "HackFusion 2026",
      description: "A 36-hour national level hackathon bringing together the brightest minds to solve real-world problems using cutting-edge technology. Build innovative solutions, win exciting prizes, and network with industry leaders.",
      venue: "Main Auditorium",
      maxCapacity: 300,
      tags: ["Hackathon", "Coding", "Innovation"]
    },
    {
      title: "AI/ML Bootcamp",
      description: "Intensive 3-day bootcamp covering machine learning fundamentals, deep learning architectures, and practical AI applications with hands-on projects using TensorFlow and PyTorch.",
      venue: "CS Lab Complex",
      maxCapacity: 200,
      tags: ["AI", "Machine Learning", "Bootcamp"]
    }
  ],
  ECE: [
    {
      title: "CircuitCraft Workshop",
      description: "Hands-on workshop on advanced PCB design, circuit simulation, and IoT integration with real-world applications. Learn to design and fabricate your own circuit boards.",
      venue: "ECE Lab Block",
      maxCapacity: 120,
      tags: ["Workshop", "IoT", "Hardware"]
    },
    {
      title: "VLSI Design Workshop",
      description: "Explore VLSI chip design methodologies with hands-on experience using industry-standard EDA tools. Covers RTL design, synthesis, and physical design flow.",
      venue: "VLSI Lab",
      maxCapacity: 80,
      tags: ["VLSI", "Workshop", "Chip Design"]
    }
  ],
  MECH: [
    {
      title: "RoboWars Championship",
      description: "Inter-college robotics competition featuring battle bots, line followers, and autonomous navigation challenges. Build, compete, and showcase your engineering prowess!",
      venue: "Mechanical Workshop",
      maxCapacity: 200,
      tags: ["Robotics", "Competition", "Engineering"]
    },
    {
      title: "AutoExpo Technical Fest",
      description: "Annual technical festival showcasing automobile innovations, EV prototypes, 3D-printed models, and advanced manufacturing techniques with live demonstrations.",
      venue: "Open Ground",
      maxCapacity: 500,
      tags: ["TechFest", "Automobile", "Exhibition"]
    }
  ],
  CIVIL: [
    {
      title: "Bridge Building Contest",
      description: "Design and build model bridges tested for load-bearing capacity. Combines creativity with structural engineering principles. Open to teams of 2-4 students.",
      venue: "Civil Engineering Lab",
      maxCapacity: 100,
      tags: ["Design", "Structural", "Contest"]
    },
    {
      title: "Smart City Hackathon",
      description: "Collaborative hackathon focused on developing innovative solutions for urban infrastructure challenges including traffic management, waste disposal, and water conservation.",
      venue: "Innovation Center",
      maxCapacity: 120,
      tags: ["Hackathon", "Smart City", "Urban"]
    }
  ],
  EEE: [
    {
      title: "Power Systems Symposium",
      description: "National symposium on renewable energy systems, smart grids, and the future of power distribution. Features keynotes from leading power sector professionals.",
      venue: "Seminar Hall A",
      maxCapacity: 150,
      tags: ["Symposium", "Energy", "Sustainability"]
    },
    {
      title: "Green Energy Expo",
      description: "Exhibition and seminar on solar panels, wind energy, battery storage innovations, and electric vehicle charging infrastructure. Live demonstrations of solar installations.",
      venue: "Exhibition Hall",
      maxCapacity: 250,
      tags: ["Expo", "Green Energy", "Innovation"]
    }
  ],
  IT: [
    {
      title: "CyberSec Summit",
      description: "Deep dive into cybersecurity threats, ethical hacking demonstrations, CTF challenges, and network defense strategies. Learn from certified security professionals.",
      venue: "IT Seminar Hall",
      maxCapacity: 180,
      tags: ["Security", "Hacking", "Network"]
    },
    {
      title: "Cloud Computing Workshop",
      description: "Learn to deploy, scale, and manage cloud infrastructure using AWS and Azure with live demonstrations. Covers EC2, S3, Lambda, and containerization with Docker.",
      venue: "IT Lab 3",
      maxCapacity: 100,
      tags: ["Cloud", "AWS", "Docker"]
    }
  ]
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

    // Final 5-organizer guard (sendOTP already cleared old ones, but safety check)
    const deptCount = await User.countDocuments({ department, isAdmin: false });
    if (deptCount >= 5) {
      return res.status(400).json({
        error: `${department} department already has 5 organizers. Registration not allowed.`,
      });
    }

    const user = await User.create({ name, email, password, department });

    // Seed sample events ONLY if this organizer doesn't already have them (prevent duplicates)
    const sampleEvents = sampleEventsByDept[department] || [];
    if (sampleEvents.length > 0) {
      const Event = require("../models/Event");
      for (let index = 0; index < sampleEvents.length; index++) {
        const e = sampleEvents[index];
        // Check if this organizer already has an event with the same title
        const alreadyExists = await Event.findOne({ organizerId: user._id, title: e.title });
        if (alreadyExists) continue; // skip duplicates

        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + 10 + index * 5); // +10 days, +15 days
        const dateString = dateObj.toISOString().split("T")[0];

        await Event.create({
          title:       e.title,
          description: e.description,
          department:  department,
          date:        dateString,
          time:        "10:00 AM",
          venue:       e.venue,
          organizer:   name,
          organizerId: user._id,
          maxCapacity: e.maxCapacity,
          status:      "upcoming",
          tags:        e.tags,
          featured:    index === 0,
        });
      }
    }

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

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No account found with that email." });
    }

    // Generate 6-digit OTP
    const code = crypto.randomInt(100000, 999999).toString();
    console.log(`\n=========================================`);
    console.log(`🔑 DEV MODE: Password reset code for ${email} is: ${code}`);
    console.log(`=========================================\n`);

    // Delete old OTPs and save new one
    await OTP.deleteMany({ email });
    await OTP.create({ email, code });

    try {
      await sendPasswordResetEmail({ email, code });
      if (process.env.NODE_ENV === "development") {
        res.json({ message: "Password reset code sent to your email.", code });
      } else {
        res.json({ message: "Password reset code sent to your email." });
      }
    } catch (mailErr) {
      console.error("Password reset email failed:", mailErr.message);
      if (process.env.NODE_ENV === "development") {
        return res.json({ message: "Email failed but allowing continuation with code.", code });
      } else {
        return res.status(500).json({ error: "Failed to send password reset email. Please try again later." });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/auth/reset-password ────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: "Email, code, and new password are required." });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const record = await OTP.findOne({ email });
    if (!record) {
      return res.status(400).json({ error: "Code expired or not requested." });
    }
    if (record.code !== String(code).trim()) {
      return res.status(400).json({ error: "Incorrect code. Please try again." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    // Update password (it will be hashed by the User model pre-save hook)
    user.password = newPassword;
    await user.save();

    // Delete OTP
    await OTP.deleteMany({ email });
    
    res.json({ message: "Password has been reset successfully. You can now login." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { sendOTP, verifyOTP, register, login, getMe, forgotPassword, resetPassword };
