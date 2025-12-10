const NotificationServices = require("@services/shared/NotificationServices");

const createNotification = async (req, res, next) => {
  try {
    const sender = req.user.id;

    const { user, isAdmin, group, type, post, message } = req.body;

    const result = await NotificationServices.createNotification(
      user,
      isAdmin,
      group,
      sender,
      type,
      post,
      message
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await NotificationServices.getNotification(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getNotificationAdmin = async (req, res, next) => {
  try {
    const result = await NotificationServices.getNotificationAdmin();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const readNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    const result = await NotificationServices.readNotification(notificationId);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNotification,
  getNotification,
  getNotificationAdmin,
  readNotification,
};
