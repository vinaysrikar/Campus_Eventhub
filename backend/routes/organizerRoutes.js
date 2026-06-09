const express = require("express");
const router = express.Router();
const { getOrganizers, deleteOrganizer } = require("../controllers/organizerController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getOrganizers);
router.delete("/:id", protect, adminOnly, deleteOrganizer);

module.exports = router;
