const Group = require("@models/Group");
const User = require("@models/User");

class SearchServices {
  async searchUserAndGroup(keyword) {
    const regex = new RegExp(keyword, "i"); // tìm không phân biệt hoa/thường
    const now = new Date();

    // Tìm user active, chưa bị khóa và không phải admin
    const users = await User.find({
      statusAccount: "active",
      isAdmin: { $ne: true }, // bỏ qua admin
      $or: [
        { lockedTime: { $exists: false } }, // chưa bị khóa
        { lockedTime: { $lt: now } }, // đã hết thời gian khóa
      ],
      $or: [
        { firstName: regex },
        { lastName: regex },
        { userName: regex },
        { email: regex },
      ],
    }).select("firstName lastName userName userAvatar");

    // Tìm group active và tên group chứa keyword
    const groups = await Group.find({
      status: "active",
      groupName: regex,
    }).select("groupName groupAvatar");

    return { users, groups };
  }
}

module.exports = new SearchServices();
