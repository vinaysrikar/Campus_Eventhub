const User = require("../models/User");

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

module.exports = { getOrganizers };
