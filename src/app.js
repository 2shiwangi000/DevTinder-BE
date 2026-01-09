const express = require("express");

const connectDB = require("../src/config/database");

const app = express();
const User = require("./models/user");

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

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Added Successfully ( : )");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;
  try {
    const users = await User.find({ emailId: emailId });
    if (users.length > 0) {
      res.send(users);
    } else {
      res.status(400).send("user not found");
    }
  } catch (err) {
    res.status(400).send(err, "something went wrong");
  }
});

app.get("/feed/all", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length > 0) {
      res.send(users);
    } else {
      res.status(400).send("no data found");
    }
  } catch (err) {
    res.status(400).send(err, "something went wrong");
  }
});

app.delete("/delete", async (req, res) => {
  try {
    const id = req.body.id;
    await User.findByIdAndDelete(id).then((responce) => {
      if (responce) {
        res.send("User deleted successfully");
      } else {
        res.status(404).send("somthing went wrong");
      }
    });
  } catch (err) {
    res.status(400).send(err, "something went wrong");
  }
});

app.patch("/update/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const is_allowed = ["age", "gender", "hobbies", "photo"];
    const isUpdateAllowed = Object.keys(data).every((i) =>
      is_allowed.includes(i)
    );
    if (!isUpdateAllowed) {
      throw new Error("Not Allowed");
    }
    await User.findByIdAndUpdate(id, data, {
      runValidators: true,
    }).then((responce) => {
      if (responce) {
        res.send("User updated :>");
      } else {
        res.status(400).send("something went wrong", id, data);
      }
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

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
