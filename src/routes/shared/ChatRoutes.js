const express = require("express");
const { verifyToken } = require("../../middlewares/auth.middleware");
const ChatControllers = require("@controllers/shared/ChatControllers");
const {
  uploadFiles,
  upload,
} = require("../../middlewares/uploadFilesMiddleware");

const route = express.Router();

route.post("/chats", verifyToken, ChatControllers.createChat);

route.post("/groups", verifyToken, ChatControllers.createGroupChat);

route.post(
  "/messages",
  verifyToken,
  upload.fields([
    { name: "mediaMessages", maxCount: 10 }, // tối đa 10 ảnh và video
    { name: "documentMessages", maxCount: 10 }, // tối đa 10 document
  ]),
  uploadFiles,
  ChatControllers.sendMessage
);

route.get("/messages/:chatId", verifyToken, ChatControllers.getMessageHistory);

route.get("/chats", verifyToken, ChatControllers.getAllChatList);

route.post("/chatPassword", verifyToken, ChatControllers.createChatPassword);

route.get(
  "/chatPassword/:chatId",
  verifyToken,
  ChatControllers.getChatPassword
);

route.post(
  "/verifyChatPassword",
  verifyToken,
  ChatControllers.verifyChatPassword
);

module.exports = route;
