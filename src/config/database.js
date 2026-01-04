const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://2shiwangi000_db_user:yUhnahpTtsPZ2sQf@cluster0.f1pczgi.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
