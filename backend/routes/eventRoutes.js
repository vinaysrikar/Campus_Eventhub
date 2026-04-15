const express = require("express");
const router  = express.Router();
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent, getStats } = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");
const { body }    = require("express-validator");

const eventValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("date").notEmpty().withMessage("Date is required"),
  body("time").notEmpty().withMessage("Time is required"),
  body("venue").notEmpty().withMessage("Venue is required"),
  body("maxCapacity").isInt({ min: 1 }).withMessage("Max capacity must be a positive number"),
];

// IMPORTANT: /stats must come BEFORE /:id, otherwise Express matches "stats" as an ID param
router.get("/stats", getStats);
router.get("/",      getEvents);
router.get("/:id",   getEvent);
router.post("/",     protect, eventValidation, createEvent);
router.put("/:id",   protect, updateEvent);
router.delete("/:id",protect, deleteEvent);

module.exports = router;
