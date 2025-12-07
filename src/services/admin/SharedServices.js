const Department = require("@models/Department");
const Group = require("@models/Group");
const User = require("@models/User");

class SharedServices {
  async getDashboard() {
    // Chỉ lấy các trường cần thiết
    const user = await User.find({}, "isTeacher createdAt");
    const teacher = await User.find({ isTeacher: true }, "createdAt");
    const group = await Group.find({}, "createdAt");
    const department = await Department.find({}, "createdAt");

    return {
      message: "Lấy thông tin cho dashboard!",
      user,
      teacher,
      group,
      department,
    };
  }
}

module.exports = new SharedServices();
