const express = require("express");
const UserControllers = require("../../controllers/admin/UserControllers");
const { isAdmin } = require("../../middlewares/role.middleware");
const { verifyToken } = require("../../middlewares/auth.middleware");

const route = express.Router();

route.get("/users", verifyToken, isAdmin, UserControllers.getUsers);

module.exports = route;
