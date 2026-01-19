const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { handleProfileEditValidation } = require("../utils/validations");
const profileRouter = express.Router();

// GET /profile — protected, returns `req.user`
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// GET /profile — protected, returns `req.user`
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!handleProfileEditValidation(req)) {
      throw new Error("something went wrong");
    } else {
      const loggedInUser = req.user;
      Object.keys(req.body).forEach(
        (key) => (loggedInUser[key] = req.body[key])
      );
      await loggedInUser.save();
      const userTosend = loggedInUser.toObject();
      delete userTosend.password;
      res.json({
        message: `${req.user.firstName}'s profile updated successfully`,
        code: 200,
        data: userTosend,
      });
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
