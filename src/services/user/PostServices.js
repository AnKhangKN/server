const Heart = require("../../models/Heart");
const Post = require("../../models/Post");
const User = require("../../models/User");

class PostServices {
  async createNewPost({
    group,
    author,
    content,
    bgContent,
    hashtag,
    userTag,
    emotion,
    medias,
    documents,
    privacy,
  }) {
    // Tạo document mới
    const newPost = await Post.create({
      group,
      author,
      content,
      bgContent,
      hashtag,
      userTag,
      emotion,
      privacy,
      medias: medias || [],
      documents: documents || [],
    });

    await User.findByIdAndUpdate(
      author,
      { privacyPost: privacy },
      { new: true }
    );

    return newPost;
  }

  async getPosts() {
    const posts = await Post.find()
      .populate({
        path: "author",
        select: "firstName lastName userAvatar",
      })
      .populate({
        path: "group",
        select: "groupName groupAvatar",
      })
      .populate({
        path: "hearts",
        select: "author",
      })
      .sort({ createdAt: -1 }) // Mới nhất
      .lean();

    return {
      message: "Lấy danh sách bài viết thành công!",
      posts,
    };
  }

  async heartPost(userId, postId, targetType) {
    // Kiểm tra xem người dùng đã thả tim bài viết chưa
    const existedHeart = await Heart.findOne({
      author: userId,
      targetId: postId,
    });

    if (existedHeart) {
      // 🩶 Đã thả tim → bỏ tim
      await Heart.deleteOne({ _id: existedHeart._id });

      // Xóa heartId ra khỏi Post.hearts
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          $inc: { heartsCount: -1 },
          $pull: { hearts: existedHeart._id },
        },
        { new: true }
      );

      return {
        message: `Người dùng ${userId} đã bỏ tim bài viết ${postId}`,
        heartsCount: post.heartsCount,
        isHearted: false,
      };
    } else {
      //  Chưa thả tim → thêm tim
      const heart = await Heart.create({
        author: userId,
        targetId: postId,
        targetType,
      });

      // Thêm heartId vào Post.hearts
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          $inc: { heartsCount: 1 },
          $push: { hearts: heart._id },
        },
        { new: true }
      );

      return {
        message: `Người dùng ${userId} đã tim bài viết ${postId}`,
        heartsCount: post.heartsCount,
        isHearted: true,
      };
    }
  }
}

module.exports = new PostServices();
