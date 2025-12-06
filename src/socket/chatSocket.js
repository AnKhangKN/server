const { getMessageHistory } = require("@services/shared/ChatServices");

module.exports = (io, socket) => {
  // Khi user join chat room
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat room: ${chatId}`);
  });

  // Khi user gửi tin nhắn
  socket.on("sendMessage", (msg) => {
    // Gửi lại tin nhắn tới tất cả user trong room
    io.to(msg.chatId).emit("receiveMessage", msg);
  });

  socket.on("deleteMessage", (msg) => {
    // Gửi lại tin nhắn tới tất cả user trong room
    io.to(msg.chatId).emit("messageDeleted", msg._id);
  });
};
