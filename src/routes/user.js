const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequests = require("../modelsOschemas/connectionRequest");
const User = require("../modelsOschemas/user");

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
    res.json({ data: filteredConnections });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message,
    });
  }
});

userRouter.get("/user/requests/count", userAuth, async (req, res) => {
  try {
    const loggedinId = req.user._id;
    const total = await connectionRequests.countDocuments({
      status: "interested",
      toUserId: loggedinId,
    });
    res.json({ count: total, code: 200 });
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
        : item.fromUserId,
    );
    res.json({ data });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message,
    });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const user = req.user;
    const connectionRequest = await connectionRequests
      .find({
        $or: [
          {
            fromUserId: user._id,
          },
          {
            toUserId: user._id,
          },
        ],
      })
      .select("fromUserId toUserId");
    const hideUsersSet = new Set();
    connectionRequest.forEach((req) => {
      hideUsersSet.add(req.fromUserId.toString());
      hideUsersSet.add(req.toUserId.toString());
    });

    const filter = {
      $and: [
        { _id: { $nin: Array.from(hideUsersSet) } },
        { _id: { $ne: user._id } },
      ],
    };

    const getTotal = await User.countDocuments(filter);
    const paginatedData = await User.find(filter)
      .find({
        $and: [
          { _id: { $nin: Array.from(hideUsersSet) } },
          {
            _id: { $ne: user._id },
          },
        ],
      })
      .select("-password")
      .skip(skip)
      .limit(limit);

    res.json({
      code: 200,
      data: {
        data: paginatedData,
        page: Number(page),
        limit: Number(limit),
        total: getTotal,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = userRouter;
