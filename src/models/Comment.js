const mongoose = require("mongoose");

// Schema chung cho media hoặc document
const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "video", "file"], required: true },
  name: { type: String, required: true },
});

const commentSchema = new mongoose.Schema(
  {
    // Thuộc bài post
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    // Người tạo comment
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Nội dung chữ
    content: {
      type: String,
      trim: true,
      default: "",
    },

    medias: [mediaSchema], // ảnh/video
    documents: [mediaSchema], // file tài liệu

    // Danh sách user tim
    hearts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Heart" }],
    heartsCount: { type: Number, default: 0 },

    // Comment cha
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },

    // Đếm số reply con
    repliesCount: { type: Number, default: 0 },

    // Status
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
