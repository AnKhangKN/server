const Chat = require("../../models/Chat");

class ChatServices {
  // Danh sách các đoạn chat
  async getChats(userId) {
    return await Chat.find({ members: userId }).populate("lastMessage");
  }

  // Tao group chat
  async createGroup() {}

  // Gửi tin nhắn
  async sendMessage() {}

  // Hiển thị lịch sử tin nhắn
  async getMessageHistory() {}
}

module.exports = new ChatServices();
