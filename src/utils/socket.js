const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.LOCAL_URL,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", () => {});

    socket.on("sendMessage", () => {});

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
