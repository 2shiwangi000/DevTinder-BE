// User model: schema, instance helpers (JWT, password check), and export
const mongoose = require("mongoose");
var validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Define User schema and lightweight validation rules
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
    // Primary contact identifier for a user — must be a valid email
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
    // Hashed password (never store plaintext). Hashing occurs at signup.
    password: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "lgbtq"],
        message: `{VALUES} not gender type`,
      },
      // validate(value) {
      //   if (!["male", "female", "lgbtq"].includes(value)) {
      //     throw new Error("Gender not valid");
      //   }
      // },
    },
    hobbies: {
      type: [String],
    },
    photo: {
      type: String,
      // default: function () {
      //   console.log(this.gender);
      //   return DEFAULT_AVATARS[this.gender] || DEFAULT_AVATARS.male;
      // },
    },
    about: {
      type: String,
      maxLength: 500,
      require: false,
    },
  },
  {
    timestamps: true,
  },
);

// Instance method: generate a JWT for this user
// NOTE: secret is hard-coded for dev; replace with env var in production
userSchema.methods.getJWTToken = async function () {
  const user = this;
  const token = await jwt.sign({ id: user._id }, "DevShiwangi@2026", {
    expiresIn: "1d",
  });
  return token;
};

// Instance method: compare a plaintext password with stored hashed password
userSchema.methods.passwordValidate = async function (password) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

userSchema.pre("save", function () {
  if (!this.photo) {
    const DEFAULT_AVATARS = {
      male: "https://dqysqvftxdrupwraetvt.supabase.co/storage/v1/object/public/DevTinder/Gemini_Generated_Image_a1d9hya1d9hya1d9.png",
      female:
        "https://dqysqvftxdrupwraetvt.supabase.co/storage/v1/object/public/DevTinder/Gemini_Generated_Image_7bqrz27bqrz27bqr.png",
      lgbtq:
        "https://dqysqvftxdrupwraetvt.supabase.co/storage/v1/object/public/DevTinder/Gemini_Generated_Image_94lrb194lrb194lr.png",
      default:
        "https://dqysqvftxdrupwraetvt.supabase.co/storage/v1/object/public/DevTinder/Gemini_Generated_Image_l3x1t8l3x1t8l3x1.png",
    };

    this.photo = DEFAULT_AVATARS[this.gender] || DEFAULT_AVATARS.default;
  }
  // next();
});

// Export Mongoose model
module.exports = mongoose.model("User", userSchema);
