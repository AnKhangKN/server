const { Server } = require("socket.io");

let io; // Biến toàn cục để có thể dùng ở các file khác nếu cần

let onlineUsers = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Chấp nhận mọi domain (production nên giới hạn)
      methods: ["GET", "POST"],
    },
  });

  // Khi client kết nối
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Client gửi event "setup" với userId → join room riêng
    socket.on("setup", (userId) => {
      socket.join(userId); // Tạo phòng tên userId
      console.log(`User ${userId} joined their personal room.`);
    });

    socket.on("disconnect", () => {
      for (let [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit("online_users", [...onlineUsers.keys()]);
    });
  });
};

module.exports = {
  initSocket,
};
