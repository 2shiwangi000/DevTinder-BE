const mongoose = require("mongoose");
var validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      require: false,
      maxLength: 50,
    },
    emailId: {
      type: String,
      require: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Not a valid email");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    password: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "lgbtq"].includes(value)) {
          throw new Error("Gender not valid");
        }
      },
    },
    hobbies: {
      type: [String],
    },
    photo: {
      type: String,
      default:
        "https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWTToken = async function () {
  const user = this;
  const token = await jwt.sign({ id: user._id }, "DevShiwangi@2026", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.passwordValidate = async function (password) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
