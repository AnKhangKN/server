const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    // Bài post gì
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    // Ai là người tim
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null, // nếu là reply
    },

    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    repliesCount: { type: Number, default: 0 }, // đếm số reply con
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
