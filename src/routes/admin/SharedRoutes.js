const express = require("express");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { isAdmin } = require("../../middlewares/role.middleware");
const SharedControllers = require("@controllers/admin/SharedControllers");

const route = express.Router();

route.get("/dashboards", verifyToken, isAdmin, SharedControllers.getDashboard);

module.exports = route;
