const GroupServices = require("@services/user/GroupServices");

const createGroup = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const groupAvatar = req.cloudinary?.groupAvatar || "";
    const groupCoverImage = req.cloudinary?.groupCoverImage || "";

    const { groupName, groupPrivacy, introduction, groupMember } = req.body;

    const result = await GroupServices.createGroup({
      userId,
      groupName,
      groupPrivacy,
      introduction,
      groupAvatar,
      groupCoverImage,
      groupMember,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getGroupsJoin = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await GroupServices.getGroupsJoin(userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getGroupDetail = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const result = await GroupServices.getGroupDetail(groupId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getGroupsNotJoined = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await GroupServices.getGroupsNotJoined(userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGroup,
  getGroupsJoin,
  getGroupDetail,
  getGroupsNotJoined,
};
