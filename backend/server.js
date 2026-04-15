require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const morgan     = require("morgan");
const rateLimit  = require("express-rate-limit");
const connectDB  = require("./config/db");

const app = express();

connectDB();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // allow images from cloudinary
}));

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:8080",
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

// ── Rate limiting (relaxed for dev, strict for prod) ─────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a moment." },
});

// Stricter limit only on auth (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many auth attempts. Please wait 15 minutes." },
});

app.use("/api", apiLimiter);
app.use("/api/auth/login",      authLimiter);
app.use("/api/auth/send-otp",   authLimiter);
app.use("/api/auth/verify-otp", authLimiter);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static uploads
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",          require("./routes/authRoutes"));
app.use("/api/events",        require("./routes/eventRoutes"));
app.use("/api/registrations", require("./routes/registrationRoutes"));
app.use("/api/organizers",    require("./routes/organizerRoutes"));
app.use("/api/upload",        require("./routes/uploadRoutes"));

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime(), env: process.env.NODE_ENV })
);

// ── Error handlers ────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 EventHub API  →  http://localhost:${PORT}  [${process.env.NODE_ENV || "development"}]`);
  
  // Start auto status updater for events
  const { startEventStatusCron } = require("./utils/eventStatusCron");
  startEventStatusCron();
});
