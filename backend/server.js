const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const rateLimit = require("express-rate-limit");
const { v2: cloudinary } = require("cloudinary");
const connectDB = require("./config/db");
const { startEventStatusCron } = require("./utils/eventStatusCron");

dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(helmet());
app.use(morgan("dev"));

// Strict CORS config matching CLIENT_URL
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:8080";
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin === allowedOrigin || origin === "http://localhost:8080" || origin === "http://localhost:5173" || origin === "http://localhost:3000") {
      return callback(null, true);
    }
    if (process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// Apply Rate Limiting to Auth Endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests from this IP, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth", authLimiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ─── Cloudinary config ──────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Routes ─────────────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const organizerRoutes = require("./routes/organizerRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/organizers", organizerRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/upload", uploadRoutes);

// ─── Health / status routes ─────────────────────────────────
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.get("/test", (req, res) => {
  res.send("TEST OK");
});

app.get("/api/db-status", (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const state = mongoose.connection.readyState;
  res.json({
    status: state,
    statusText: states[state] || "unknown",
    database: mongoose.connection.name || "none",
  });
});

// DB Events are handled by Mongoose globally

// ─── Mongoose connection events ─────────────────────────────
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected successfully");
  console.log("   Database:", mongoose.connection.name);
  console.log("   Host:", mongoose.connection.host);
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected");
});

// ─── Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  startEventStatusCron(); // Keep event statuses in sync
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();