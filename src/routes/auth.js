const express = require("express");
const User = require("../models/user");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { handleSignupValidation } = require("../../src/utils/validations");

// POST /signup — validate, hash password, create user
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate input
    handleSignupValidation(req);

    const { firstName, lastName, emailId, password } = req.body;

    // Hash password and save user
    const enc_pwd = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, emailId, password: enc_pwd });
    await user.save();
    res.send("User Added Successfully ( : )");
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

// POST /login — authenticate and set token cookie
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Look up user by email (using find here; could use findOne)
    const user = await User.find({ emailId: emailId });
    if (!user[0]) {
      // Avoid leaking which part failed (email vs password) in prod —
      // here we return a clear message for development purposes.
      throw new Error("User doesnt exist with such mailid");
    } else {
      // Verify password via model method
      const passwordCorrect = await user[0].passwordValidate(password);
      if (passwordCorrect) {
        const token = await user[0].getJWTToken();
        res.cookie("token", token);
        res.send("login successfull");
      } else {
        throw new Error("password or email not correct");
      }
    }
  } catch (err) {
    res.status(400).send(err?.message);
  }
});

// POST /logout — logout
authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    }).send("logout successfull");
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

module.exports = authRouter;
