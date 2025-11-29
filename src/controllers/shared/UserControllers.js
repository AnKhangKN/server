const UserServices = require("@services/shared/UserServices");

const getDetailUser = async (req, res, next) => {
  try {
    const userId = req?.user?.id;

    const result = await UserServices.getDetailUser(userId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userAvatar = req.cloudinary?.userAvatar;

    const result = await UserServices.updateUserAvatar(userId, userAvatar);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updateUserCover = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userCover = req.cloudinary?.userCover;

    const result = await UserServices.updateUserCover(userId, userCover);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDetailUser,
  updateUserAvatar,
  updateUserCover,
};
