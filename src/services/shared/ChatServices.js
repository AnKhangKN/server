const Chat = require("../../models/Chat");
const Message = require("../../models/Message");
const bcrypt = require("bcryptjs");

class ChatServices {
  async createChat(userId, senderId) {
    // Tìm xem chat giữa 2 người này đã tồn tại chưa
    let existingChat = await Chat.findOne({
      members: { $all: [userId, senderId] }, // chứa cả 2 id
      "members.2": { $exists: false }, // chỉ có đúng 2 thành viên
    }).populate();

    if (existingChat) {
      // Nếu đã có, trả về luôn
      return existingChat;
    }

    // Nếu chưa có, tạo mới
    const newChat = await Chat.create({
      members: [userId, senderId],
    });

    return newChat;
  }

  async createGroupChat(userId, members) {
    // Loại bỏ trùng lặp trong danh sách members
    const uniqueMembers = [...new Set(members)];

    // Nếu người tạo nhóm chưa có trong members thì thêm vào
    if (!uniqueMembers.includes(userId)) {
      uniqueMembers.push(userId);
    }

    const groupChat = await Chat.create({
      groupAdmin: [userId], // Người tạo nhóm là admin chính
      members: uniqueMembers, // Danh sách thành viên bao gồm người tạo nhóm
    });

    return {
      message: `Tạo nhóm thành công!`,
      data: groupChat,
    };
  }

  async sendMessage(chatId, senderId, text, medias, documents) {
    const chat = await Chat.findById(chatId);
    if (!chat) throwError("Chat không tồn tại");

    const message = await Message.create({
      chatId,
      senderId,
      text,
      medias,
      documents,
    });

    // Cập nhật lastMessage trong Chat
    chat.lastMessage = {
      text,
      senderId,
      createdAt: new Date(),
    };
    await chat.save();

    return { chat, message };
  }

  async getMessageHistory(chatId) {
    if (!chatId) {
      throwError("chatId không hợp lệ", 400);
    }

    const messages = await Message.find({ chatId })
      .populate("senderId", "userName userAvatar lastName firstName")
      .sort({ createdAt: 1 });

    return {
      message: "Lấy lịch sử chat thành công!",
      data: messages,
    };
  }

  async getAllChatList(userId) {
    // Lấy tất cả chat mà user tham gia
    const chats = await Chat.find({ members: userId })
      .populate("groupAdmin", "_id userName userAvatar lastName firstName")
      .populate("members", "_id userName userAvatar lastName firstName")
      .sort({ "lastMessage.createdAt": -1, updatedAt: -1 });

    // Tách ra 1:1 chat và group chat >2 thành viên nếu cần
    const oneToOneChats = chats.filter((c) => c.members.length === 2);
    const groupChats = chats.filter((c) => c.members.length > 2);

    // Nếu muốn FE chỉ cần 1 mảng chung sắp xếp theo lastMessage.createdAt
    const allChats = [...oneToOneChats, ...groupChats].sort((a, b) => {
      const aTime =
        a.lastMessage?.createdAt?.getTime() || a.updatedAt.getTime();
      const bTime =
        b.lastMessage?.createdAt?.getTime() || b.updatedAt.getTime();
      return bTime - aTime; // giảm dần
    });

    return {
      message: "Lấy tất cả chat thành công!",
      data: allChats,
    };
  }
}

module.exports = new ChatServices();
