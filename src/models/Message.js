const mongoose = require("mongoose");

// Schema chung cho media hoặc document
const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "video", "file"], required: true },
  name: { type: String, required: true },
});

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: false,
    },

    hearts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Heart" }],

    heartsCount: { type: Number, default: 0 },

    medias: [mediaSchema], // ảnh/video

    documents: [mediaSchema], // file tài liệu

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
