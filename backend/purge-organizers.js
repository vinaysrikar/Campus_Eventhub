/**
 * purge-organizers.js
 * Removes ALL non-admin organizers + their events + their event registrations.
 * Run once: node purge-organizers.js
 */
require("dotenv").config();
const mongoose = require("mongoose");

const User         = require("./models/User");
const Event        = require("./models/Event");
const Registration = require("./models/Registration");

async function purge() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Find all non-admin organizers
  const organizers = await User.find({ isAdmin: false }).select("_id name email department");
  console.log(`Found ${organizers.length} organizers to remove:`);
  organizers.forEach(u => console.log(`  - [${u.department}] ${u.name} (${u.email})`));

  const orgIds = organizers.map(u => u._id);

  // Find their events
  const events = await Event.find({ organizerId: { $in: orgIds } }).select("_id title");
  const eventIds = events.map(e => e._id);
  console.log(`\nFound ${events.length} events to remove`);

  // Delete registrations → events → users (in order)
  const r1 = await Registration.deleteMany({ event: { $in: eventIds } });
  console.log(`🗑️  Deleted ${r1.deletedCount} registrations`);

  const r2 = await Event.deleteMany({ organizerId: { $in: orgIds } });
  console.log(`🗑️  Deleted ${r2.deletedCount} events`);

  const r3 = await User.deleteMany({ isAdmin: false });
  console.log(`🗑️  Deleted ${r3.deletedCount} organizers`);

  console.log("\n✅ All done! Database is now clean.");
  console.log("   Admin account is preserved.");
  process.exit(0);
}

purge().catch(err => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
