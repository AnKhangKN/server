const throwError = require("../utils/throwError");

// 🔹 Hàm tiện ích kiểm tra dữ liệu bắt buộc
const checkRequired = (field, fieldName) => {
  if (!field || String(field).trim() === "") {
    throwError(`Hãy nhập ${fieldName} của bạn!`, 400);
  }
};

// 🔹 Validator đăng ký
const registerValidator = (req, res, next) => {
  try {
    const { lastName, firstName, email, password, confirmPassword } = req.body;

    // --- 1️⃣ Kiểm tra bắt buộc ---
    checkRequired(lastName, "họ");
    checkRequired(firstName, "tên");
    checkRequired(email, "email");
    checkRequired(password, "mật khẩu");
    checkRequired(confirmPassword, "xác nhận mật khẩu");

    // --- 2️⃣ Kiểm tra định dạng email ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throwError("Email không hợp lệ!", 400);
    }

    // --- 3️⃣ Kiểm tra độ dài mật khẩu ---
    if (password.length < 6) {
      throwError("Mật khẩu phải có ít nhất 6 ký tự!", 400);
    }

    // --- 4️⃣ Kiểm tra trùng khớp mật khẩu ---
    if (password !== confirmPassword) {
      throwError("Mật khẩu và xác nhận mật khẩu không khớp!", 400);
    }

    next();
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || "Dữ liệu không hợp lệ!",
    });
  }
};

// 🔹 Validator đăng nhập
const loginValidator = (req, res, next) => {
  try {
    const { email, password } = req.body;

    checkRequired(email, "email");
    checkRequired(password, "mật khẩu");

    // --- 1️⃣ Kiểm tra định dạng email ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throwError("Email không hợp lệ!", 400);
    }

    next();
  } catch (error) {
    res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || "Dữ liệu không hợp lệ!",
    });
  }
};

module.exports = {
  registerValidator,
  loginValidator,
};
