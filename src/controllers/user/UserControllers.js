const UserServices = require("../../services/user/UserServices");
const throwError = require("../../utils/throwError");

const getFriendsSuggest = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return throwError("Người dùng không tồn tại!", 400);
    }

    const result = await UserServices.getFriendsSuggest(userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const followFriend = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { friendId } = req.body;

    if (!userId || !friendId) {
      return throwError("Không tồn tại người dùng và người theo dỗi!", 400);
    }

    const result = await UserServices.followFriend(userId, friendId);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const hiddenOrBlockFriend = async (req, res, next) => {
  try {
    const { type, friendId } = req.body;

    const userId = req.user.id;

    const result = await UserServices.hiddenOrBlockFriend(
      userId,
      friendId,
      type
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { userName } = req.params;

    const result = await UserServices.getProfile(userName);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getFollower = async (req, res, next) => {
  try {
    const { userName } = req.params;

    const result = await UserServices.getFollower(userName);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getFollowing = async (req, res, next) => {
  try {
    const { userName } = req.params;

    const result = await UserServices.getFollowing(userName);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFriendsSuggest,
  followFriend,
  hiddenOrBlockFriend,
  getProfile,
  getFollowing,
  getFollower,
};
