const express = require("express");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { isUser } = require("../../middlewares/role.middleware");
const GroupControllers = require("../../controllers/user/GroupControllers");
const route = express.Router();
const {
  uploadFiles,
  upload,
} = require("../../middlewares/uploadFilesMiddleware");

route.post(
  "/groups",
  verifyToken,
  isUser,
  upload.fields([
    { name: "groupAvatar", maxCount: 1 },
    { name: "groupCoverImage", maxCount: 1 },
  ]),
  uploadFiles,
  GroupControllers.createGroup
);

module.exports = route;
