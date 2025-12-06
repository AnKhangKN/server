const Report = require("@models/Report");
const User = require("@models/User");

class UserServices {
  async getUsers() {
    const users = await User.find()
      .sort({ createdAt: -1 }) // Mới nhất
      .lean();

    return {
      message: "Lấy danh sách người dùng thành công!",
      users,
    };
  }

  async updateRole(userId, role) {
    const user = await User.findById(userId);

    if (!user.isTeacher && role === "isAdmin") {
      user.isAdmin = true;
    }

    if (!user.isAdmin && role === "isTeacher") {
      user.isTeacher = true;
    }

    await user.save();

    return {
      message: "Cập nhật thành công!",
      user,
    };
  }
}

module.exports = new UserServices();
