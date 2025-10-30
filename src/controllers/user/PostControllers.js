const PostServices = require("../../services/user/PostServices");
const throwError = require("../../utils/throwError");

const createNewPost = async (req, res, next) => {
  try {
    const { group, content, bgContent, hashtag, userTag, emotion, privacy } =
      req.body;
    const medias = req.cloudinary?.medias || [];
    const documents = req.cloudinary?.documents || [];

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
    const user = req.user.id;

    if (!user) {
      throwError("Người dùng không tồn tại!", 400);
    }

    const result = await PostServices.getPosts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewPost,
  getPosts,
};
