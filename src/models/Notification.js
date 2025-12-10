const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // người nhận
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // Group bị báo cáo
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // người gửi
    type: {
      type: String,
      enum: ["heart", "comment", "share", "follow", "report", "message"],
      required: true,
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    isAdmin: { type: Boolean, default: false },
    message: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
