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
      .sort({ createdAt: -1 }) // Mới nhất
      .lean();

    return {
      message: "Lấy danh sách bài viết thành công!",
      posts,
    };
  }
}

module.exports = new PostServices();
