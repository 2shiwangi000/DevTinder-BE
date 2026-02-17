const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { handleProfileEditValidation } = require("../utils/validations");
const profileRouter = express.Router();
const validator = require("validator");
const bcrypt = require("bcrypt");

// GET /profile — protected, returns `req.user`
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json({ code: 200, data: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /profile — protected, returns `req.user`
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!handleProfileEditValidation(req)) {
      return res.status(400).json({
        message: "something went wrong",
      });
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    const userTosend = loggedInUser.toObject();
    delete userTosend.password;
    res.json({
      message: `${req.user.firstName}'s profile updated successfully`,
      code: 200,
      data: userTosend,
    });
  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { newPassword, oldPassword } = req.body;
    const user = req.user;
    const passwordCorrect = await user.passwordValidate(oldPassword);
    if (passwordCorrect) {
      if (!validator.isStrongPassword(newPassword)) {
        return res.status(400).json({
          message: "please enter strong password",
        });
      }
      const enc_pwd = await bcrypt.hash(newPassword, 10);
      user.password = enc_pwd;
      await user.save();
      res
        .cookie("token", null, {
          expires: new Date(Date.now()),
        })
        .json({
          code: 200,
          message: "Password updated successfully.Please login again",
        });
    } else {
      res.status(400).json({
        message: "Password doesnt match with old password",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
      code: 500,
    }); 
  }
});

module.exports = profileRouter;
