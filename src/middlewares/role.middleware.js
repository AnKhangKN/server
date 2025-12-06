const throwError = require("../utils/throwError");

// Kiểm tra quyền Admin
const isAdmin = (req, res, next) => {
  if (req.user?.isAdmin) return next();
  return next(throwError("Người dùng không phải Admin!", 403));
};

// Kiểm tra quyền User (người dùng thông thường)
const isUser = (req, res, next) => {
  if (!req.user?.isAdmin) return next();
  return next(throwError("Không phải người dùng!", 403));
};

module.exports = {
  isAdmin,
  isUser,
};
