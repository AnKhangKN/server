const UserServices = require("../../services/shared/UserServices");

const getDetailUser = async (req, res, next) => {
  try {
    const userId = req?.user?.id;

    const result = await UserServices.getDetailUser(userId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDetailUser,
};
