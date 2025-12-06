const UserServices = require("@services/admin/UserServices");

const getUsers = async (req, res, next) => {
  try {
    const result = await UserServices.getUsers();

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const result = await UserServices.updateRole(userId, role);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  updateRole,
};
