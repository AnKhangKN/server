const ShareServices = require("@services/user/ShareServices");

const sharePost = async (req, res, next) => {
  try {
    const author = req.user.id;

    const { post, caption } = req.body;

    const result = await ShareServices.sharePost(post, author, caption);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sharePost,
};
