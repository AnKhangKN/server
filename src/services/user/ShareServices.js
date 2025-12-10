const Post = require("@models/Post");
const Share = require("@models/Share");

class ShareServices {
  async sharePost(post, author, caption) {
    if (!post || !author) {
      throwError("Thiếu thông tin share!", 400);
    }

    // 1️⃣ Kiểm tra bài viết tồn tại
    const posts = await Post.findById(post);
    if (!posts) {
      throwError("Bài viết không tồn tại!", 404);
    }

    // 2️⃣ Tạo share
    const share = await Share.create({
      post: post,
      author: author,
      caption,
    });

    // 3️⃣ Tăng sharesCount thêm 1
    await Post.updateOne({ _id: post }, { $inc: { sharesCount: 1 } });

    return {
      message: "Share bài viết thành công!",
      data: share,
    };
  }
}

module.exports = new ShareServices();
