const express = require("express");
const CommentControllers = require("@controllers/user/CommentControllers");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { isUser } = require("../../middlewares/role.middleware");
const {
  uploadFiles,
  upload,
} = require("../../middlewares/uploadFilesMiddleware");

const route = express.Router();

route.post(
  "/comments",
  verifyToken,
  isUser,
  upload.fields([
    { name: "mediaComments", maxCount: 1 }, // tối đa 1 ảnh và video
    { name: "documentComments", maxCount: 2 }, // tối đa 1 document
  ]),
  uploadFiles,
  CommentControllers.addComment
);

route.get(
  "/comments/posts/:postId",
  verifyToken,
  isUser,
  CommentControllers.getCommentsByPostId
);

route.delete(
  "/comments/:commentId",
  verifyToken,
  isUser,
  CommentControllers.deleteComment
);

route.get(
  "/repliesComment/:commentId",
  verifyToken,
  isUser,
  CommentControllers.getCommentsReplyByCommentId
);

module.exports = route;
