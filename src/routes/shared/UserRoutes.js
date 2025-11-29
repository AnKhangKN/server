const express = require("express");
const UserControllers = require("@controllers/shared/UserControllers");
const { verifyToken } = require("../../middlewares/auth.middleware");
const {
  uploadFiles,
  upload,
} = require("../../middlewares/uploadFilesMiddleware");

const route = express.Router();

route.get("/profiles", verifyToken, UserControllers.getDetailUser);

route.post(
  "/userAvatar",
  verifyToken,
  upload.fields([{ name: "userAvatar", maxCount: 1 }]),
  uploadFiles,
  UserControllers.updateUserAvatar
);

route.post(
  "/userCover",
  verifyToken,
  upload.fields([{ name: "userCover", maxCount: 1 }]),
  uploadFiles,
  UserControllers.updateUserCover
);

module.exports = route;
