const Comment = require("../../models/Comment");
const Heart = require("../../models/Heart");
const { throwError } = require("../../utils/throwError");

class CommentServices {
  async addComment(post, author, content, medias, documents) {
    const newComment = await Comment.create({
      post,
      author,
      content,
      medias: medias || [],
      documents: documents || [],
    });

    return newComment;
  }

  async getCommentsByPostId(postId) {
    const comments = await Comment.find({ post: postId, isDeleted: false })
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
}

module.exports = new CommentServices();
