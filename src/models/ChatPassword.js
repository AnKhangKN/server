// models/ChatPassword.js
const mongoose = require("mongoose");

const chatPasswordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // Không trả về mặc định
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatPassword", chatPasswordSchema);
