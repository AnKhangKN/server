const jwt = require("jsonwebtoken");
const throwError = require("../utils/throwError");
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = require("../config/env");

const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: "30s",
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "365d",
  });
};

const handleRefreshToken = async (refreshToken) => {
  try {
    const user = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const accessToken = generateAccessToken({
      id: user.id,
      isAdmin: user.isAdmin,
    });

    return {
      status: "OK",
      message: "Lấy token thành công!",
      accessToken,
    };
  } catch (error) {
    throwError(
      error.message || "Refresh token không hợp lệ hoặc đã hết hạn",
      401
    );
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  handleRefreshToken,
};
