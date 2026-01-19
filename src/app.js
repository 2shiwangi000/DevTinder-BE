// Basic Express server for DevTinder: DB connect, middleware, routes
const express = require("express");
const connectDB = require("../src/config/database");
const app = express();

const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

// Connect to DB, then start server
connectDB()
  .then(() => {
    console.log("DB connected successfully");
    // Start Express server on port 4000
    app.listen(4000, () => {
      console.log("server is running on port 4000");
    });
  })
  .catch((err) => {
    console.log("DB connecttion err:", err);
    return err;
  });

// Middleware: parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
