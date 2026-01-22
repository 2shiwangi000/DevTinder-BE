const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequests = require("../modelsOschemas/connectionRequest");

//get all the pending connection requests #status:interested

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedinId = req.user._id;
    const filteredConnections = await connectionRequests.find({
      status: "interested",
      toUserId: loggedinId,
    });
    res.send(filteredConnections);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = userRouter;
