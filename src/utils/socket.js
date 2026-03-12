const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../modelsOschemas/chat");

const getSecretRoomId = ({ userId, id }) => {
  return crypto
    .createHash("sha256")
    .update([userId, id].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.LOCAL_URL,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, id }) => {
      const roomId = getSecretRoomId(userId, id);

      console.log(firstName + " Joining Room :" + roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ firstName, userId, id, message }) => {
      try {
        const roomId = getSecretRoomId(userId, id);
        console.log(firstName + "-" + message);
        let chat = await Chat.findOne({
          participants: {
            $all: [userId, id],
          },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, id],
            messages: [],
          });
        }
        chat.messages.push({
          senderId: userId,
          message,
        });

        await chat.save();
        io.to(roomId).emit("messageReceived", {
          id: `${roomId}${new Date()}`,
          firstName,
          message,
        });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
