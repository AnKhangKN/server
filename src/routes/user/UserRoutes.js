const express = require("express");
const UserControllers = require("../../controllers/user/UserControllers");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { isUser } = require("../../middlewares/role.middleware");

const route = express.Router();

route.get("/users", verifyToken, isUser, UserControllers.getFriendsSuggest);

route.post("/follow", verifyToken, isUser, UserControllers.followFriend);

route.post("/hidden", verifyToken, isUser, UserControllers.hiddenOrBlockFriend);

route.get(
  "/profiles/:userName",
  verifyToken,
  isUser,
  UserControllers.getProfile
);

route.get(
  "/follower/:userName",
  verifyToken,
  isUser,
  UserControllers.getFollower
);

route.get(
  "/following/:userName",
  verifyToken,
  isUser,
  UserControllers.getFollowing
);

route.get("/friends", verifyToken, isUser, UserControllers.getFriends);

module.exports = route;
