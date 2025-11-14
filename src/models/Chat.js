const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    // Tên nhóm nếu tạo nhóm.
    groupName: {
      type: String,
    },

    groupAvatar: {
      type: String,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    lastMessage: {
      text: { type: String },
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
