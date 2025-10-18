const throwError = require("../utils/throwError");

// Hàm tiện ích kiểm tra trống
const checkRequired = (field, fieldName) => {
  if (!field || field.trim() === "") {
    throwError(`Hãy thêm ${fieldName} của bạn!`, 400);
  }
};

// Validator đăng ký
const registerValidator = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  checkRequired(firstName, "tên");
  checkRequired(lastName, "họ");
  checkRequired(email, "email");
  checkRequired(password, "mật khẩu");

  // Kiểm tra định dạng email
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    throwError("Email không hợp lệ!", 400);
  }

  // Kiểm tra độ dài mật khẩu
  if (password.length < 6) {
    throwError("Mật khẩu phải có ít nhất 6 ký tự!", 400);
  }

  next();
};

const loginValidator = (req, res, next) => {
  const { email, password } = req.body;

  checkRequired(email, "email");
  checkRequired(password, "mật khẩu");

  // Kiểm tra định dạng email
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    throwError("Email không hợp lệ!", 400);
  }

  // Kiểm tra độ dài mật khẩu
  if (password.length < 6) {
    throwError("Mật khẩu phải có ít nhất 6 ký tự!", 400);
  }
  next();
};

module.exports = {
  registerValidator,
  loginValidator,
};
