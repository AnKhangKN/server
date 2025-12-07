const Group = require("@models/Group");
const throwError = require("../../utils/throwError");
const Post = require("@models/Post");

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

    // 1️⃣ Lấy tất cả các group mà user đang tham gia và đang active
    const groups = await Group.find({
      groupMember: userId,
      status: "active",
    }).sort({ createdAt: -1 });

    const groupIds = groups.map((g) => g._id);

    // Nếu user không tham gia group nào thì trả về mảng rỗng
    if (groupIds.length === 0) return [];

    // 2️⃣ Lấy tất cả bài viết của các nhóm này
    const posts = await Post.find({
      group: { $in: groupIds },
    })
      .sort({ createdAt: -1 }) // mới nhất lên đầu
      .populate({
        path: "author",
        select: "firstName lastName userAvatar userName",
      })
      .populate({
        path: "group",
        select: "groupName groupAvatar",
      })
      .populate({
        path: "hearts",
        select: "author",
      });

    return {
      message: "Thanh cong",
      groups,
      posts,
    };
  }

  async getGroupDetail(groupId) {
    const group = await Group.findOne({
      _id: groupId,
      status: "active",
    });

    const posts = await Post.find({ group: groupId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "firstName lastName userAvatar userName",
      })
      .populate({
        path: "group",
        select: "groupName groupAvatar",
      })
      .populate({
        path: "hearts",
        select: "author",
      });

    return {
      message: "Thanh cong",
      data: {
        group,
        posts,
      },
    };
  }

  async getGroupsNotJoined(userId) {
    if (!userId) throwError("Không xác định được người dùng!", 400);
    console.log(userId);

    const groups = await Group.find({
      groupMember: { $nin: [userId] }, // lọc những group mà userId không có trong groupMember
      status: "active", // nếu muốn chỉ lấy group đang active
    }).sort({ createdAt: -1 }); // mới nhất lên đầu

    return {
      message: "Thanh cong",
      data: groups,
    };
  }
}

module.exports = new GroupServices();
