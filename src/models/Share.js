const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema(
  {
    // Người chia sẻ
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Bài viết gốc được chia sẻ
    originalPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    // Nội dung người chia sẻ thêm (tùy chọn)
    caption: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    // Người đã thích share này
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Người đã bình luận share này
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    // Quyền hiển thị: công khai, bạn bè, chỉ mình tôi
    privacy: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Share", shareSchema);
