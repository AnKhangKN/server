const ChatServices = require("../../services/shared/ChatServices");

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
    const { groupName, groupAvatar, members } = req.body;

    const result = await ChatServices.createGroupChat(
      groupAvatar,
      groupName,
      members
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.id;

    const { chatId, text } = req.body;

    const medias = req.cloudinary?.messageMedias || [];
    const documents = req.cloudinary?.messageDocuments || [];

    const result = await ChatServices.sendMessage(
      chatId,
      senderId,
      text,
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

    console.log(chatId);

    const result = await ChatServices.getMessageHistory(chatId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getChatList = async (req, res, next) => {
  try {
    const userId = req?.user?.id;

    console.log(userId);

    const result = await ChatServices.getChatList(userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createChat,
  createGroupChat,
  sendMessage,
  getMessageHistory,
  getChatList,
};
