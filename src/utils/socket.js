const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.LOCAL_URL,
    },
  });

  io.on("connection", (socket) => {});
};

module.exports = initializeSocket;
