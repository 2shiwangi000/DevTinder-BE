const express = require("express");
const { Chat } = require("../modelsOschemas/chat");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

chatRouter.get("/chat/:id", userAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: {
        $all: [userId, id],
      },
    }).populate({
        path:"messages.senderId",
        select:"firstName lastName"
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, id],
        messages: [],
      });
      await chat.save();
    }

    res.json({ data: chat, status: 200 });
  } catch (err) {
    console.log(err);
  }
});

module.exports = chatRouter;
