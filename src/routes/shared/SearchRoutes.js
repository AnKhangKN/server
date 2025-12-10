const express = require("express");
const route = express.Router();
const SearchControllers = require("@controllers/shared/SearchControllers");
const { verifyToken } = require("../../middlewares/auth.middleware");

route.get("/search", verifyToken, SearchControllers.searchUserAndGroup);

module.exports = route;
