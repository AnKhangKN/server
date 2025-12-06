const ChatServices = require("@services/shared/ChatServices");
const throwError = require("../../utils/throwError");

const createChat = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { senderId } = req.body;

    const result = await ChatServices.createChat(userId, senderId);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const createGroupChat = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { members } = req.body;

    const result = await ChatServices.createGroupChat(userId, members);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.id;

    const { chatId, text, parentMessage, parentText } = req.body;

    const medias = req.cloudinary?.messageMedias || [];
    const documents = req.cloudinary?.messageDocuments || [];

    const result = await ChatServices.sendMessage(
      chatId,
      senderId,
      text,
      parentMessage,
      parentText,
      medias,
      documents
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getMessageHistory = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const result = await ChatServices.getMessageHistory(chatId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const result = await ChatServices.deleteMessage(messageId);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const editMessage = async (req, res, next) => {};

const getAllChatList = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const result = await ChatServices.getAllChatList(userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const createChatPassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { chatId, newPassword, confirmPassword } = req.body;

    console.log(chatId, newPassword, confirmPassword);

    if (!chatId || !newPassword || !confirmPassword) {
      throwError("Thiếu thông tin!", 400);
    }

    if (newPassword !== confirmPassword) {
      throwError("Mật khẩu xác thực không trùng!", 401);
    }

    const result = await ChatServices.createChatPassword(
      userId,
      chatId,
      newPassword
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getChatPassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    const result = await ChatServices.getChatPassword(userId, chatId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const verifyChatPassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { chatId, password } = req.body;

    const result = await ChatServices.verifyChatPassword(
      userId,
      chatId,
      password
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createChat,
  createGroupChat,
  sendMessage,
  getMessageHistory,
  deleteMessage,
  editMessage,
  getAllChatList,
  createChatPassword,
  getChatPassword,
  verifyChatPassword,
};
