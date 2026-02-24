const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const connectionRequests = require("../modelsOschemas/connectionRequest");
const User = require("../modelsOschemas/user");
const sendEmail = require("../utils/sendEmail");
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

      const emailRes = await sendEmail.run(
        "New connection request on DevTalk 🚀",
        user.firstName,
        isUserOrNot.emailId,
      );

      console.log(emailRes);
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
  },
);

requestRouter.post(
  "/request/review/:status/:reqID",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const loggedinId = user._id;
      const reqId = req.params.reqID;
      const allowedStatus = ["accepted", "rejected"];
      const status = req.params.status;
      const isUser = await User.findById(reqId);
      if (!isUser) {
        return res.status(404).json({
          message: `user doesnt exist`,
        });
      }
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: `Invalid Status Type: ` + status,
        });
      }
      const existingRequestOrNot = await connectionRequests.findOne({
        fromUserId: reqId,
        toUserId: loggedinId,
      });

      if (!existingRequestOrNot) {
        return res.status(400).json({
          message: `request doesn't exist`,
        });
      }
      if (!existingRequestOrNot.status === "interested") {
        return res.status(400).json({
          message: `you cannot change status of ignored request`,
        });
      }
      existingRequestOrNot.status = status;
      existingRequestOrNot.save();
      res.json({
        message: `request ${status}`,
        data: existingRequestOrNot,
      });
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  },
);

module.exports = requestRouter;
