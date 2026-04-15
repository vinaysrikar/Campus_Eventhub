const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, `event-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.webp') {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  }
});

// POST /api/upload/event-image  (protected)
const uploadEventImage = [
  upload.single("image"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });
    
    // Create an absolute URL to the uploads folder
    const port = process.env.PORT || 5000;
    const baseUrl = `http://localhost:${port}`;
    res.json({ url: `${baseUrl}/uploads/${req.file.filename}`, publicId: req.file.filename });
  },
];

module.exports = { uploadEventImage };
