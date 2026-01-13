const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // read token from cookies
    const { token } = req.cookies;
    if (!token) throw new Error("Unauthenticated User");

    // verify token and extract user id (dev secret hard-coded)
    const decodedData = jwt.verify(token, "DevShiwangi@2026");
    const { id } = decodedData;

    // attach user document to request for downstream handlers
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
