const UserServices = require("../../services/admin/UserServices");

const getUsers = async (req, res, next) => {
  try {
    const result = await UserServices.getUsers();

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
};
