const express = require("express");
const router = express.Router();
const { registerForEvent, getEventRegistrations } = require("../controllers/registrationController");
const { protect } = require("../middleware/authMiddleware");
const { body } = require("express-validator");

router.post(
  "/",
  [
    body("eventId").notEmpty().withMessage("Event ID is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
  ],
  registerForEvent
);

router.get("/event/:eventId", protect, getEventRegistrations);

module.exports = router;
