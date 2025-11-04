module.exports = (io, socket) => {
  socket.on("joinChat", (roomId) => {
    socket.join(roomId);

    console.log(`User joined chat room: ${roomId}`);
  });

  socket.on("sendMessage", (messageData) => {
    const { roomId, senderId, content } = messageData;

    // Gửi tin nhắn cho roomId.
    io.to(roomId).emit("receiveMessage", {
      senderId,
      content,
      time: new Date(),
    });
  });
};
