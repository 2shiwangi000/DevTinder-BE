const express = require("express");

const connectDB = require("../src/config/database");

const app = express();
const User = require("./models/user");
const { handleSignupValidation } = require("./utils/validations");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");

connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(4000, () => {
      console.log("server is running on port 4000");
    });
  })
  .catch((err) => {
    console.log("DB connecttion err:", err);
    return err;
  });

app.use(express.json());
app.use(cookieParser());

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.find({ emailId: emailId });
    if (!user[0]) {
      throw new Error("User doesnt exist with such mailid");
    } else {
      const passwordCorrect = await user[0].passwordValidate(password);
      if (passwordCorrect) {
        //generation of token
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/signup", async (req, res) => {
  try {
    handleSignupValidation(req);
    const { firstName, lastName, emailId, password } = req.body;
    const enc_pwd = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, emailId, password: enc_pwd });
    await user.save();
    res.send("User Added Successfully ( : )");
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

app.post("/sendConectionReq", userAuth, async (req, res) => {
  const user = req.user;
  res.send(
    "Connection Request Sent by " + user.firstName + " " + user.lastName
  );
});

// app.get("/user", userAuth, async (req, res) => {
//   const emailId = req.body.emailId;
//   try {
//     const users = await User.find({ emailId: emailId });
//     if (users.length > 0) {
//       res.send(users);
//     } else {
//       res.status(400).send("user not found");
//     }
//   } catch (err) {
//     res.status(400).send(err, "something went wrong");
//   }
// });

// app.get("/feed/all", userAuth, async (req, res) => {
//   try {
//     const users = await User.find({});
//     if (users.length > 0) {
//       res.send(users);
//     } else {
//       res.status(400).send("no data found");
//     }
//   } catch (err) {
//     res.status(400).send(err, "something went wrong");
//   }
// });

// app.delete("/delete", userAuth, async (req, res) => {
//   try {
//     const id = req.body.id;
//     await User.findByIdAndDelete(id).then((responce) => {
//       if (responce) {
//         res.send("User deleted successfully");
//       } else {
//         res.status(404).send("somthing went wrong");
//       }
//     });
//   } catch (err) {
//     res.status(400).send(err, "something went wrong");
//   }
// });

// app.patch("/update/user/:id", userAuth, async (req, res) => {
//   try {
//     const id = req.params.id;
//     const data = req.body;
//     const is_allowed = ["age", "gender", "hobbies", "photo"];
//     const isUpdateAllowed = Object.keys(data).every((i) =>
//       is_allowed.includes(i)
//     );
//     if (!isUpdateAllowed) {
//       throw new Error("Not Allowed");
//     }
//     await User.findByIdAndUpdate(id, data, {
//       runValidators: true,
//     }).then((responce) => {
//       if (responce) {
//         res.send("User updated :>");
//       } else {
//         res.status(400).send("something went wrong", id, data);
//       }
//     });
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });

// app.use('/hello/2', (req, res) => {
//     res.send('Hello from Hello Page 2!');
// });

// app.use('/hello', (req, res) => {
//     res.send('Hello from Hello Page!');
// });

// app.use('/', (req, res) => {
//     res.send('Hello from Express server!');
// });

// app.use('/helloworld', (req, res) => {
//     res.send('Hello from Hello Page!');
// });

// app.get('/user', (req, res) => {
//     res.send('User route');
// });

// app.post('/user', (req, res) => {
//     res.send('User POST route');
// });

// app.get('/user',(req,res,next) => {
//     console.log('user console 1')
//     next()
// },(req,res,next) => {
//     console.log('user console 2');
//     next()
// },(req,res,next) => {
//     console.log('user console 3')
//     res.send('uuser consolle 3')
// })
