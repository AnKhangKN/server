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
    groupMember = [],
  }) {
    if (!groupName) throwError("Tên nhóm không được để trống!", 401);
    if (!userId) throwError("Không xác định được người tạo nhóm!", 401);

    console.log("groupMember raw:", groupMember);
    console.log("IsArray:", Array.isArray(groupMember));

    let members = [];

    if (Array.isArray(groupMember)) {
      members = [...groupMember];
    } else if (typeof groupMember === "string" && groupMember.trim() !== "") {
      members = [groupMember]; // ép string thành array
    }

    members = [...new Set([userId, ...members])];

    console.log("members to save:", members);

    const group = await Group.create({
      groupName: groupName.trim(),
      groupPrivacy: groupPrivacy || "public",
      introduction: introduction || "",
      groupAvatar: groupAvatar || "",
      groupCoverImage: groupCoverImage || "",
      groupAdmin: [userId],
      groupMember: members,
    });

    return {
      message: "Tạo nhóm thành công!",
      data: group,
    };
  }

  async getGroupsJoin(userId) {
    if (!userId) throwError("Không xác định được người dùng!", 400);

    const groups = await Group.find({
      groupMember: userId, // user có trong groupMember
      status: "active", // nhớ dùng string, không phải biến
    });

    return groups;
  }

  async getGroupDetail(groupId) {
    const group = await Group.findOne({
      _id: groupId,
      status: "active",
    });

    return group;
  }
}

module.exports = new GroupServices();
