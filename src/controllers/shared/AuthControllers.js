const AuthServices = require("../../services/shared/AuthServices");
const jwtServices = require("../../config/jwt");
const throwError = require("../../utils/throwError");

const registerController = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const result = await AuthServices.register(
      firstName,
      lastName,
      email,
      password
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password, platform } = req.body;

    const result = await AuthServices.login(email, password);
    const { refreshToken, ...newResult } = result;

    if (platform === "web") {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // Đổi thành true khi deploy với HTTPS
        sameSite: "strict",
        maxAge: 365 * 24 * 60 * 60 * 1000,
        path: "/",
      });

      return res.status(200).json(newResult); // Gửi accessToken và user
    } else {
      return res.status(200).json({
        ...newResult,
        refreshToken, // Cho mobile lưu
      });
    }
  } catch (error) {
    next(error);
  }
};

const handleRefreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) throwError("Người dùng chưa đăng nhập!", 401);

    const result = await jwtServices.handleRefreshToken(token);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const logoutController = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      status: "OK",
      message: "Đăng xuất thành công!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerController,
  loginController,
  handleRefreshToken,
  logoutController,
};
