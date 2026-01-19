const express = require("express");
const {userAuth} = require('../middlewares/auth')
const requestRouter = express.Router();

// POST /sendConectionReq — protected example route
requestRouter.post("/sendConectionReq", userAuth, async (req, res) => {
  const user = req.user;
  res.send(
    "Connection Request Sent by " + user.firstName + " " + user.lastName
  );
});

module.exports = requestRouter;
