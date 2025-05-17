const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
    });

    console.log(`MongoDB Connected: ${mongoose.connection.db.databaseName}`);

    // Add connection error handler
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    // Add reconnection handler
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected! Attempting to reconnect...");
      setTimeout(connectDB, 5000);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    // Retry connection instead of exiting
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
