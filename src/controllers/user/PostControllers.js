const PostServices = require("@services/user/PostServices");
const throwError = require("../../utils/throwError");

const createNewPost = async (req, res, next) => {
  try {
    const { group, content, bgContent, hashtag, userTag, emotion, privacy } =
      req.body;

    const medias = req.cloudinary?.postMedias || [];
    const documents = req.cloudinary?.postDocuments || [];

    const post = await PostServices.createNewPost({
      group,
      author: req.user._id || req.user.id,
      content,
      bgContent,
      hashtag,
      userTag,
      emotion,
      medias,
      documents,
      privacy,
    });

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const result = await PostServices.getPosts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      throwError("Post ID không được để trống!", 400);
    }

    const post = await PostServices.getPostById(postId);

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewPost,
  getPosts,
  getPostById,
};
