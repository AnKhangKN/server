const express = require("express");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { isUser } = require("../../middlewares/role.middleware");
const PostControllers = require("../../controllers/user/PostControllers");
const {
  uploadFiles,
  upload,
} = require("../../middlewares/uploadFilesMiddleware");

const route = express.Router();

route.post(
  "/posts",
  verifyToken,
  isUser,
  upload.fields([
    { name: "mediaPosts", maxCount: 10 }, // tối đa 10 ảnh và video
    { name: "documentPosts", maxCount: 10 }, // tối đa 10 document
  ]),
  uploadFiles,
  PostControllers.createNewPost
);

route.get("/posts", verifyToken, isUser, PostControllers.getPosts);

route.get("/posts/:postId", verifyToken, isUser, PostControllers.getPostById);

module.exports = route;
