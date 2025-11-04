const { Server } = require("socket.io");
const userSocket = require("./userSocket");
const chatSocket = require("./chatSocket");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected: ", socket.id);

    // Các module
    userSocket(io, socket);

    chatSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });
  });
};

module.exports = {
  initSocket,
};
