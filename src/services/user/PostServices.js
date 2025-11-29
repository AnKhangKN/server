const Heart = require("@models/Heart");
const Post = require("@models/Post");
const User = require("@models/User");

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
        select: "firstName lastName userAvatar userName",
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

  async getPostById(postId) {
    const post = await Post.findById(postId)
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
      });

    return post;
  }
}

module.exports = new PostServices();
