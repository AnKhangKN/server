const ChatServices = require("../../services/shared/ChatServices");

const getChats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await ChatServices.getChats(userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChats,
};
