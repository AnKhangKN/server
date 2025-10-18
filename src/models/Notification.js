const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // người nhận
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // người gửi
    type: {
      type: String,
      enum: ["heart", "comment", "share", "follow", "message", ],
      required: true,
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    message: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
