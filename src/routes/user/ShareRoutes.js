const express = require("express");
const { verifyToken } = require("../../middlewares/auth.middleware");
const route = express.Router();
const ShareControllers = require("@controllers/user/ShareControllers");

route.post("/share/posts", verifyToken, ShareControllers.sharePost);

module.exports = route;
