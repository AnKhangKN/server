const Group = require("@models/Group");
const throwError = require("../../utils/throwError");

class GroupServices {
  async createGroup({
    userId,
    groupName,
    groupPrivacy,
    introduction,
    groupAvatar,
    groupCoverImage,
  }) {
    if (!groupName) throwError("Tên nhóm không được để trống!", 401);
    if (!userId) throwError("Không xác định được người tạo nhóm!", 401);

    const group = await Group.create({
      groupName: groupName.trim(),
      groupPrivacy: groupPrivacy || "public", // mặc định công khai
      introduction: introduction || "",
      groupAvatar: groupAvatar || "",
      groupCoverImage: groupCoverImage || "",
      groupAdmin: [userId], // danh sách admin, mặc định có người tạo
      members: [userId], // thêm chính người tạo vào danh sách thành viên
    });

    return {
      message: "Tạo nhóm thành công!",
      data: group,
    };
  }
}

module.exports = new GroupServices();
