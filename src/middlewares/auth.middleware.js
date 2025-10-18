const jwt = require("jsonwebtoken");
const throwError = require("../utils/throwError");
const { JWT_ACCESS_SECRET } = require("../config/env");

// 🧱 Hàm tách token từ header
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  // Loại bỏ "Bearer " + bỏ ngoặc kép nếu có
  return authHeader.split(" ")[1].replace(/"/g, "");
};

// 🛡 Middleware xác thực token
const verifyToken = (req, res, next) => {
  const token = extractToken(req);

  if (!token) return next(throwError("Token không tồn tại!", 401));

  jwt.verify(token, JWT_ACCESS_SECRET, (err, decoded) => {
    if (err)
      return next(throwError("Token không hợp lệ hoặc đã hết hạn!", 403));

    // Lưu thông tin người dùng vào req
    req.user = decoded;
    next();
  });
};

module.exports = {
  verifyToken,
};
