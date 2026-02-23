// Basic Express server for DevTinder: DB connect, middleware, routes
const express = require("express");
const connectDB = require("../src/config/database");
const app = express();
var cors = require("cors");
const cookieParser = require("cookie-parser");

console.log(process.env)
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

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
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
