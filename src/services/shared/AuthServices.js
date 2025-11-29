const User = require("@models/User");
const { compareSync, hashSync } = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../config/jwt");
const throwError = require("../../utils/throwError");

class AuthServices {
  async register(firstName, lastName, email, password) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throwError("Email đã được sử dụng!", 400);

    const hashedPassword = hashSync(password, 10);

    // Tạo base username (họ + tên, viết thường, không dấu)
    let baseUsername = `${firstName}${lastName}`
      .toLowerCase()
      .replace(/\s+/g, "");
    baseUsername = baseUsername
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Hàm tạo chuỗi ngẫu nhiên (gồm chữ, số, _, .)
    const randomSuffix = (length = 3) => {
      const chars = "abcdefghijklmnopqrstuvwxyz0123456789_.";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    // Sinh username với vị trí thêm hợp lý (trước / giữa / sau)
    let finalUsername = baseUsername;
    let attempt = 0;

    while (await User.findOne({ userName: finalUsername })) {
      attempt++;
      if (attempt > 10) {
        finalUsername = `${baseUsername}_${Date.now().toString().slice(-4)}`;
        break;
      }

      const randomPart = randomSuffix(2);
      const style = Math.floor(Math.random() * 3); // 0 = trước, 1 = giữa, 2 = sau

      switch (style) {
        case 0:
          // trước
          finalUsername = `${randomPart}${baseUsername}`;
          break;
        case 1:
          // giữa họ và tên
          const splitPoint = Math.floor(firstName.length); // giữa tên và họ
          finalUsername = `${firstName.toLowerCase()}${randomPart}${lastName
            .toLowerCase()
            .replace(/\s+/g, "")}`;
          finalUsername = finalUsername
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          break;
        case 2:
          // sau
          finalUsername = `${baseUsername}${randomPart}`;
          break;
      }
    }

    // Tạo user
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userName: finalUsername,
    });

    return {
      message: "Tạo tài khoản thành công!",
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) throwError("Email không tồn tại!", 404);

    const isMatch = compareSync(password, user.password);
    if (!isMatch) throwError("Mật khẩu không đúng!", 401);

    const payload = {
      id: user._id,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
    };

    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    return {
      message: "Đăng nhập thành công!",
      accessToken,
      refreshToken,
    };
  }
}

module.exports = new AuthServices();
