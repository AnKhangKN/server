const mongoose = require("mongoose");

// Schema chung cho media hoặc document
const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "video", "file"], required: true },
  name: { type: String, required: true },
});

const postSchema = new mongoose.Schema(
  {
    // Nếu là đăng bài trong group
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: false,
    },
    // Nếu là đăng bài trong khoa
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: false,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: { type: String, required: true, trim: true },
    bgContent: { type: String, default: "" },
    hashtag: [{ type: String, trim: true }],
    userTag: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    ],
    emotion: { type: String, default: "" },

    medias: [mediaSchema], // ảnh/video
    documents: [mediaSchema], // file tài liệu

    privacy: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },
    hearts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Heart" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "Share" }],

    heartsCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "deleted", "locked"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
