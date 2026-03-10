const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.LOCAL_URL,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userID, id }) => {
      const room = [userID, id].sort().join("_");

      console.log(firstName + ":" + "Room joining ..." + room);
      socket.join(room);
    });

    socket.on("sendMessage", ({ firstName, userId, id, message }) => {
      const roomId = [userId, id].sort().join("_");
      console.log(firstName + "-" + message);
     try{
       io.to(roomId).emit("messageReceived", { firstName, message });
     }
     catch(err){
      console.log(err);
     }
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
