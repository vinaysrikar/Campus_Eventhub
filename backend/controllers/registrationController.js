const Registration = require("../models/Registration");
const Event = require("../models/Event");
const { validationResult } = require("express-validator");
const { sendConfirmationEmail } = require("../utils/mailer");

// POST /api/registrations  (public)
const registerForEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { eventId, name, email, phone, department, year } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found." });

    // Check capacity
    const count = await Registration.countDocuments({ event: eventId });
    if (count >= event.maxCapacity) {
      return res.status(400).json({ error: "Event is at full capacity." });
    }

    // Create registration (unique index prevents duplicates)
    const registration = await Registration.create({
      event: eventId,
      name,
      email,
      phone,
      department,
      year,
    });

    // Send confirmation email with QR code (non-blocking)
    const regId = `EVH-${registration._id.toString().slice(-8).toUpperCase()}`;
    sendConfirmationEmail({ name, email, event, registrationId: regId }).catch((err) =>
      console.error("Email send failed:", err.message)
    );

    res.status(201).json({
      message: "Registration successful!",
      registration,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "You are already registered for this event." });
    }
    res.status(500).json({ error: error.message });
  }
};

// GET /api/registrations/event/:eventId  (protected - organizer)
const getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found." });

    // Only event's dept organizer or admin
    if (event.department !== req.user.department && !req.user.isAdmin) {
      return res.status(403).json({ error: "Not authorized." });
    }

    const registrations = await Registration.find({ event: req.params.eventId }).sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerForEvent, getEventRegistrations };
