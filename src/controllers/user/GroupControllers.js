const GroupServices = require("@services/user/GroupServices");

const createGroup = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const groupAvatar = req.cloudinary.groupAvatar || null;
    const groupCoverImage = req.cloudinary.groupCoverImage || null;

    const { groupName, groupPrivacy, introduction } = req.body;

    const result = await GroupServices.createGroup({
      userId,
      groupName,
      groupPrivacy,
      introduction,
      groupAvatar,
      groupCoverImage,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGroup,
};
