const Event        = require("../models/Event");
const Registration = require("../models/Registration");
const { validationResult } = require("express-validator");

// ── GET /api/events ───────────────────────────────────────────────────────────
const getEvents = async (req, res) => {
  try {
    const { department, status, search, featured } = req.query;
    const filter = {};

    if (department && department !== "ALL") filter.department = department;
    if (status)   filter.status   = status;
    if (featured === "true") filter.featured = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags:  { $regex: search, $options: "i" } },
        { venue: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch events + real registration count for each
    const events = await Event.find(filter).sort({ date: 1 }).lean();

    // Bulk-fetch registration counts in one query (much faster than N queries)
    const eventIds = events.map(e => e._id);
    const regCounts = await Registration.aggregate([
      { $match: { event: { $in: eventIds } } },
      { $group: { _id: "$event", count: { $sum: 1 } } },
    ]);
    const countMap = {};
    regCounts.forEach(r => { countMap[r._id.toString()] = r.count; });

    const result = events.map(e => ({
      ...e,
      registrations: countMap[e._id.toString()] || 0,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/events/stats ─────────────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const [totalEvents, upcomingEvents, ongoingEvents, completedEvents, totalRegistrations, depts] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ status: "upcoming" }),
      Event.countDocuments({ status: "ongoing" }),
      Event.countDocuments({ status: "completed" }),
      Registration.countDocuments(),
      Event.distinct("department"),
    ]);

    // Registrations per event (for bar chart)
    const events = await Event.find().lean();
    const regCounts = await Registration.aggregate([
      { $group: { _id: "$event", count: { $sum: 1 } } },
    ]);
    const regMap = {};
    regCounts.forEach(r => { regMap[r._id.toString()] = r.count; });

    const perEvent = events.map(e => ({
      name: e.title.length > 20 ? e.title.slice(0, 20) + '…' : e.title,
      registrations: regMap[e._id.toString()] || 0,
      capacity: e.maxCapacity,
      department: e.department,
    })).sort((a, b) => b.registrations - a.registrations).slice(0, 10);

    // Department-wise event count (for pie chart)
    const deptCounts = await Event.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const perDepartment = deptCounts.map(d => ({ name: d._id, value: d.count }));

    // Daily registrations for last 7 days (for line chart)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyRegs = await Registration.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing days with 0
    const dailyTrend = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const found = dailyRegs.find(r => r._id === dateStr);
      dailyTrend.push({ day: dayName, date: dateStr, registrations: found ? found.count : 0 });
    }

    res.json({
      totalEvents, upcomingEvents, ongoingEvents, completedEvents,
      totalRegistrations, activeDepartments: depts.length,
      perEvent, perDepartment, dailyTrend,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/events/:id ───────────────────────────────────────────────────────
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) return res.status(404).json({ error: "Event not found." });
    const regCount = await Registration.countDocuments({ event: req.params.id });
    res.json({ ...event, registrations: regCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/events ──────────────────────────────────────────────────────────
const createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    // Block past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(req.body.date);
    if (eventDate < today) {
      return res.status(400).json({ error: "Cannot create an event with a past date. Please select today or a future date." });
    }

    const event = await Event.create({
      ...req.body,
      department:  req.user.department,
      organizer:   req.user.name,
      organizerId: req.user._id,
    });
    res.status(201).json({ ...event.toObject(), registrations: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/events/:id ───────────────────────────────────────────────────────
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found." });

    if (event.organizerId?.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: "Not authorized to update this event." });
    }

    // Prevent changing department/organizer via body
    delete req.body.department;
    delete req.body.organizerId;
    delete req.body.organizer;

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    }).lean();
    const regCount = await Registration.countDocuments({ event: req.params.id });
    res.json({ ...updated, registrations: regCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/events/:id ────────────────────────────────────────────────────
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found." });

    if (event.organizerId?.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: "Not authorized to delete this event." });
    }

    await event.deleteOne();
    // Also clean up registrations for this event
    await Registration.deleteMany({ event: req.params.id });
    res.json({ message: "Event deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getEvents, getEvent, createEvent, updateEvent, deleteEvent, getStats };
