const express = require("express");
const UserControllers = require("../../controllers/user/UserControllers");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { isUser } = require("../../middlewares/role.middleware");

const route = express.Router();

route.get("/users", verifyToken, isUser, UserControllers.getFriendsSuggest);

route.post("/users/follow", verifyToken, isUser, UserControllers.followFriend);

route.post(
  "/users/hidden",
  verifyToken,
  isUser,
  UserControllers.hiddenOrBlockFriend
);

module.exports = route;
