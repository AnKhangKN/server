const User = require("../../models/User");

class UserServices {
  async getUsers() {
    const users = await User.find();

    return {
      message: "Lấy danh sách người dùng thành công!",
      users,
    };
  }
}

module.exports = new UserServices();
