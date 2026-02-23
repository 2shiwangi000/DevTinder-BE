const mongoose = require("mongoose");

// Connect to MongoDB. Keep this function small — it should resolve when the
// connection is ready so the caller can safely start the HTTP server.
const connectDB = async () => {
  // NOTE: connection string is hard-coded for development. Move to env var.
  await mongoose.connect(
    process.env.DB_CONNECTION_SECRET
  );
};

module.exports = connectDB;
