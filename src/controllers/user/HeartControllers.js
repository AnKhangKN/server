const HeartServices = require("../../services/user/heartServices");

const heartTarget = async (req, res, next) => {
  try {
    const { targetId, targetType } = req.body;
    const userId = req.user.id;
    const result = await HeartServices.heartTarget(
      targetId,
      targetType,
      userId
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  heartTarget,
};
