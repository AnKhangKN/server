const User = require("@models/User");
const throwError = require("../../utils/throwError");

class UserServices {
  async getDetailUser(userId) {
    const user = await User.findById(userId).select("-password");

    if (!user) throwError("Người dùng không tồn tại!", 401);

    return {
      message: "Lấy thông tin người dùng thành công!",
      user,
    };
  }

  async updateUserAvatar(userId, userAvatar) {
    const user = await User.findById(userId);

    if (!user) {
      throwError("Không tìm thấy người dùng!", 400);
    }

    user.userAvatar = userAvatar; // set field mới
    await user.save(); // lưu vào DB

    return {
      message: "Đã cập nhật avatar thành công",
    };
  }

  async updateUserCover(userId, userCover) {
    const user = await User.findById(userId);

    if (!user) {
      throwError("Không tìm thấy người dùng!", 400);
    }

    user.userCover = userCover;
    await user.save();

    return {
      message: "Đã cập nhật cover thành công",
    };
  }
}

module.exports = new UserServices();
