const express = require("express");
const router = express.Router();
const { uploadEventImage } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");

router.post("/event-image", protect, uploadEventImage);

module.exports = router;
