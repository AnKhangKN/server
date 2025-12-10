const SearchServices = require("@services/shared/SearchServices");

const searchUserAndGroup = async (req, res, next) => {
  try {
    const keyword = req.query.keyword || "";

    const result = await SearchServices.searchUserAndGroup(keyword);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchUserAndGroup,
};
