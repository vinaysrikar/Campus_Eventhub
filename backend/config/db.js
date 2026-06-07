const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI is not defined in .env");
    process.exit(1);
  }

  console.log("Attempting MongoDB connection...");
  // Hide password in console logs
  console.log("   URI:", uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@"));

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Fail fast if database is unreachable
    });
  } catch (error) {
    console.error("❌ MongoDB connection FAILED:");
    console.error("   ", error.message);
    if (uri.includes("localhost") || uri.includes("127.0.0.1")) {
      console.error("");
      console.error("   ⚠️  You are using a LOCAL MongoDB URI but MongoDB");
      console.error("      is not running on this machine.");
      console.error("   👉 Either install & start MongoDB locally, or");
      console.error("      use a free MongoDB Atlas cluster instead.");
      console.error("      https://www.mongodb.com/atlas/database");
    }
    process.exit(1);
  }
};

module.exports = connectDB;
