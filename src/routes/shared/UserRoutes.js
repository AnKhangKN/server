const express = require("express");
const UserControllers = require("../../controllers/shared/UserControllers");
const { verifyToken } = require("../../middlewares/auth.middleware");

const route = express.Router();

route.get("/profile", verifyToken, UserControllers.getDetailUser);

module.exports = route;
