const mongoose = require("mongoose");

// Connect to MongoDB. Keep this function small — it should resolve when the
// connection is ready so the caller can safely start the HTTP server.
const connectDB = async () => {
  // NOTE: connection string is hard-coded for development. Move to env var.
  await mongoose.connect(
    "mongodb+srv://2shiwangi000_db_user:yUhnahpTtsPZ2sQf@cluster0.f1pczgi.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
