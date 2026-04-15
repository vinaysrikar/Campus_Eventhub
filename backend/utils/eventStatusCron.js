const Event = require("../models/Event");

/**
 * Auto-update event statuses based on their dates.
 * - Past events → "completed"
 * - Today's events → "ongoing"  
 * - Future events → "upcoming"
 * 
 * Runs once on server startup and then every hour.
 */
const updateEventStatuses = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

    // Mark past events as completed
    const pastResult = await Event.updateMany(
      { date: { $lt: today }, status: { $ne: "completed" } },
      { $set: { status: "completed" } }
    );

    // Mark today's events as ongoing
    const ongoingResult = await Event.updateMany(
      { date: today, status: { $ne: "ongoing" } },
      { $set: { status: "ongoing" } }
    );

    // Mark future events as upcoming (in case someone edits a completed event's date)
    const upcomingResult = await Event.updateMany(
      { date: { $gt: today }, status: { $ne: "upcoming" } },
      { $set: { status: "upcoming" } }
    );

    const total = pastResult.modifiedCount + ongoingResult.modifiedCount + upcomingResult.modifiedCount;
    if (total > 0) {
      console.log(`📅 Event status sync: ${pastResult.modifiedCount} completed, ${ongoingResult.modifiedCount} ongoing, ${upcomingResult.modifiedCount} upcoming`);
    }
  } catch (err) {
    console.error("Event status update failed:", err.message);
  }
};

// Start the auto-updater: runs immediately then every hour
const startEventStatusCron = () => {
  updateEventStatuses(); // Run immediately on server start
  setInterval(updateEventStatuses, 60 * 60 * 1000); // Every 1 hour
  console.log("⏰ Event status auto-updater started (runs every hour)");
};

module.exports = { startEventStatusCron, updateEventStatuses };
