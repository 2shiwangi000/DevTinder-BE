const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequests = require("../modelsOschemas/connectionRequest");

//get all the pending connection requests #status:interested

const safe_connections = [
  "firstName",
  "lastName",
  "photo",
  "age",
  "gender",
  "hobbies",
  "about",
];

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedinId = req.user._id;
    const filteredConnections = await connectionRequests
      .find({
        status: "interested",
        toUserId: loggedinId,
      })
      .populate("fromUserId", safe_connections);
    res.send(filteredConnections);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message,
    });
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const filteredConnections = await connectionRequests
      .find({
        $or: [
          { status: "accepted", toUserId: user._id },
          { status: "accepted", fromUserId: user._id },
        ],
      })
      .populate("fromUserId", safe_connections)
      .populate("toUserId", safe_connections);
    let data = filteredConnections.map((item) =>
      item.fromUserId._id.toString() === user._id.toString()
        ? item.toUserId
        : item.fromUserId
    );
    res.json({ data });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = userRouter;
