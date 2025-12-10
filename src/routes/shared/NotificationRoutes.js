const express = require("express");
const { verifyToken } = require("../../middlewares/auth.middleware");
const NotificationControllers = require("@controllers/shared/NotificationControllers");
const { isAdmin } = require("../../middlewares/role.middleware");
const route = express.Router();

route.post(
  "/notifications",
  verifyToken,
  NotificationControllers.createNotification
);

route.get(
  "/notifications",
  verifyToken,
  NotificationControllers.getNotification
);

route.get(
  "/notifications/admin",
  verifyToken,
  isAdmin,
  NotificationControllers.getNotificationAdmin
);

route.put(
  "/notifications/:notificationId",
  verifyToken,
  NotificationControllers.readNotification
);

module.exports = route;
