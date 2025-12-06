const express = require("express");
const { verifyToken } = require("../../middlewares/auth.middleware");
const route = express.Router();
const ReportControllers = require("@controllers/shared/ReportControllers");

route.post("/reports", verifyToken, ReportControllers.createReport);

module.exports = route;
