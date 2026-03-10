const socket = require("socket.io");
const crypto = require("crypto");

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

      console.log(firstName + "Joining Room :" + roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage", ({ firstName, userId, id, message }) => {
      const roomId = getSecretRoomId(userId, id);
      console.log(firstName + "-" + message);
      io.to(roomId).emit("messageReceived", {
        id: `${roomId}${new Date()}`,
        firstName,
        message,
      });
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
