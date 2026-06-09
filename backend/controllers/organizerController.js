const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

// GET /api/organizers  (public - for OrgChart page)
const getOrganizers = async (req, res) => {
  try {
    const { department } = req.query;
    const filter = { isAdmin: false };
    if (department) filter.department = department;
    
    // Select only public fields, exclude password etc.
    const organizers = await User.find(filter)
      .select("-password")
      .sort({ department: 1, role: 1 });
      
    res.json(organizers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/organizers/:id (protected - admin only)
const deleteOrganizer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find organizer
    const organizer = await User.findById(id);
    if (!organizer) {
      return res.status(404).json({ error: "Organizer not found." });
    }
    
    if (organizer.isAdmin) {
      return res.status(400).json({ error: "Cannot delete admin account." });
    }
    
    // Delete events associated with this organizer, and their registrations
    const events = await Event.find({ organizerId: id });
    const eventIds = events.map(e => e._id);
    
    await Registration.deleteMany({ event: { $in: eventIds } });
    await Event.deleteMany({ organizerId: id });
    
    await User.findByIdAndDelete(id);
    
    res.json({ message: "Organizer and their events deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getOrganizers, deleteOrganizer };
