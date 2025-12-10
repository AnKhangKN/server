const Notification = require("@models/Notification");

class NotificationServices {
  async createNotification(user, isAdmin, group, sender, type, post, message) {
    const notification = await Notification.create({
      user,
      isAdmin,
      group,
      sender,
      type,
      post,
      message,
    });

    console.log("Đã comment");

    return {
      message: `Thông báo tới ${user} đã thực hiện ${type} xong!`,
      data: notification,
    };
  }

  async getNotification(userId) {
    const notifications = await Notification.find({
      user: userId,
      isAdmin: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("sender", "firstName lastName userName userAvatar");

    return {
      message: "Lấy thông báo thành công",
      data: notifications,
    };
  }

  async getNotificationAdmin() {
    // 1. Lấy toàn bộ thông báo chưa đọc
    const unread = await Notification.find({
      isAdmin: true,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "firstName lastName userName userAvatar");

    // Nếu còn thông báo chưa đọc → trả toàn bộ unread
    if (unread.length > 0) {
      return {
        message: "Lấy thông báo chưa đọc thành công",
        data: unread,
      };
    }

    // 2. Nếu tất cả đã đọc → lấy 10 thông báo gần nhất
    const read = await Notification.find({
      isAdmin: true,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("sender", "firstName lastName userName userAvatar");

    return {
      message: "Tất cả đã đọc — lấy 10 thông báo gần nhất",
      data: read,
    };
  }

  async readNotification(notificationId) {
    // Cập nhật và trả về bản ghi mới nhất
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true } // quan trọng: trả về document đã update
    );

    // Nếu không tìm thấy
    if (!notification) {
      return {
        message: "Không tìm thấy thông báo",
        data: null,
      };
    }

    return {
      message: "Đánh dấu đã đọc thành công",
      data: notification,
    };
  }
}

module.exports = new NotificationServices();
