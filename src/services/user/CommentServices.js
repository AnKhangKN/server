const Comment = require("@models/Comment");
const Post = require("@models/Post");

class CommentServices {
  async addComment(post, author, content, parentComment, medias, documents) {
    // 1️⃣ Tạo comment mới
    let newComment = await Comment.create({
      post,
      author,
      content,
      medias: medias || [],
      documents: documents || [],
      parentComment: parentComment || null,
    });

    // 2️⃣ Tăng tổng commentsCount của Post (dù là comment thường hay reply)
    await Post.findByIdAndUpdate(post, {
      $inc: { commentsCount: 1 },
    });

    // 3️⃣ Nếu là reply → tăng repliesCount của comment cha
    if (parentComment) {
      await Comment.findByIdAndUpdate(parentComment, {
        $inc: { repliesCount: 1 },
      });
    }

    // 4️⃣ Populate author
    newComment = await newComment.populate(
      "author",
      "firstName lastName userAvatar"
    );

    return newComment;
  }

  async getCommentsByPostId(postId) {
    const comments = await Comment.find({
      post: postId,
      parentComment: null,
    })
      .populate("author", "userName userAvatar lastName firstName _id")
      .populate({
        path: "hearts",
        select: "author",
      })
      .populate("medias")
      .populate("documents")
      .sort({ createdAt: -1 });

    return comments;
  }

  async updateComment(commentId, updateData) {
    // Logic to update a comment by ID
  }

  async deleteComment(commentId) {
    // Logic to delete a comment by ID
    const deletedComment = await Comment.findByIdAndUpdate(
      commentId,
      { isDeleted: true },
      { new: true }
    );
    return deletedComment;
  }

  async getCommentsReplyByCommentId(commentId) {
    const repliesComment = await Comment.find({
      parentComment: commentId,
    })
      .populate("author", "userName userAvatar lastName firstName _id")
      .populate({
        path: "hearts",
        select: "author",
      })
      .populate("medias")
      .populate("documents")
      .sort({ createdAt: -1 });

    return repliesComment;
  }
}

module.exports = new CommentServices();
