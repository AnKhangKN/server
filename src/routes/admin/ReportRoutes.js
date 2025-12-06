const express = require("express");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { isAdmin } = require("../../middlewares/role.middleware");
const route = express.Router();
const ReportControllers = require("@controllers/admin/ReportControllers");

route.get(
  "/reports/:reportType",
  verifyToken,
  isAdmin,
  ReportControllers.getReports
);

route.post("/reports", verifyToken, isAdmin, ReportControllers.confirmReport);

route.put("/reports", verifyToken, isAdmin, ReportControllers.cancelReport);

module.exports = route;
