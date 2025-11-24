const CommentServices = require("../../services/user/CommentServices");

const addComment = async (req, res) => {
  try {
    const { post, content } = req.body;
    const author = req.user.id;

    console.log(post);

    const medias = req.cloudinary?.commentMedias || [];
    const documents = req.cloudinary?.commentDocuments || [];

    const newComment = await CommentServices.addComment(
      post,
      author,
      content,
      medias,
      documents
    );
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

const getCommentsByPostId = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await CommentServices.getCommentsByPostId(postId);

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const deletedComment = await CommentServices.deleteComment(commentId);
    res.status(200).json(deletedComment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getCommentsByPostId,
  deleteComment,
};
