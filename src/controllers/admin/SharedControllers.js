const SharedServices = require("@services/admin/SharedServices");

const getDashboard = async (req, res, next) => {
  try {
    const result = await SharedServices.getDashboard();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
};
