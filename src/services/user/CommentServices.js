const Comment = require("@models/Comment");

class CommentServices {
  async addComment(post, author, content, parentComment, medias, documents) {
    let newComment;

    if (!parentComment) {
      newComment = await Comment.create({
        post,
        author,
        content,
        medias: medias || [],
        documents: documents || [],
      });
    } else {
      newComment = await Comment.create({
        post,
        author,
        content,
        medias: medias || [],
        documents: documents || [],
        parentComment,
      });

      // Tăng repliesCount của comment cha
      await Comment.findByIdAndUpdate(parentComment, {
        $inc: { repliesCount: 1 },
      });
    }

    // Populate thông tin author (tên, avatar…)
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
