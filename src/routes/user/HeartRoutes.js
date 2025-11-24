const express = require("express");
const route = express.Router();
const { verifyToken } = require("../../middlewares/auth.middleware");
const { isUser } = require("../../middlewares/role.middleware");
const HeartControllers = require("../../controllers/user/HeartControllers");

route.post("/hearts", verifyToken, isUser, HeartControllers.heartTarget);

module.exports = route;
