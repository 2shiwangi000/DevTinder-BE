const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const connectionRequests = require("../modelsOschemas/connectionRequest");
const User = require("../modelsOschemas/user");

// POST /sendConectionReq — protected example route
requestRouter.post(
  "/request/send/:status/:userid",
  userAuth,
  async (req, res) => {
    try {
      const allowedStatus = ["interested", "ignored"];
      const user = req.user;
      const fromUserId = user._id;
      const toUserId = req.params.userid;
      const status = req.params.status;
      const isUserOrNot = await User.findById(toUserId);
    //   if (fromUserId.equals(toUserId)) {
    //     return res.status(400).json({
    //       message: `cant send request to own`,
    //     });
    //   }
      if (!isUserOrNot) {
        return res.status(404).json({
          message: `user doesnt exist`,
        });
      }
      const existingRequestOrNot = await connectionRequests.findOne({
        $or: [
          {
            fromUserId: fromUserId,
            toUserId: toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: `Invalid Status Type: ` + status,
        });
      }
      if (existingRequestOrNot) {
        return res.status(400).json({
          message: `Connection request already exists`,
        });
      }
      const connectionRequest = new connectionRequests({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: `request sent`,
        code: 200,
        data,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: err.message,
      });
    }
  }
);

module.exports = requestRouter;
