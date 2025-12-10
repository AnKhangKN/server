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

    // 1️⃣ Lấy danh sách group user đang tham gia (active)
    const groups = await Group.find({
      groupMember: userId,
      status: "active",
    })
      .sort({ createdAt: -1 })
      .lean();

    const groupIds = groups.map((g) => g._id);

    // Nếu không tham gia group nào ⇒ trả về rỗng
    if (groupIds.length === 0) {
      return {
        message: "Thành công",
        groups: [],
        posts: [],
      };
    }

    // 2️⃣ Lấy bài viết của các group này (KHÔNG lấy bài share)
    const posts = await Post.find({
      group: { $in: groupIds },
      status: "active", // thêm check status nếu có
    })
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
      })
      .lean();

    return {
      message: "Thành công",
      groups,
      posts: posts.map((p) => ({
        type: "post", // chuẩn hoá giống feed (không ảnh hưởng frontend)
        data: p,
      })),
    };
  }

  async getGroupDetail(groupId) {
    // 1️⃣ Kiểm tra group hợp lệ
    const group = await Group.findOne({
      _id: groupId,
      status: "active",
    }).lean();

    if (!group) throwError("Nhóm không tồn tại hoặc đã bị khóa!", 404);

    // 2️⃣ Lấy bài viết (không bao gồm share)
    const posts = await Post.find({
      group: groupId,
      status: "active",
    })
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
      })
      .lean();

    // 🔥 Chuẩn hoá output cho frontend
    const formattedPosts = posts.map((post) => ({
      type: "post",
      data: post,
    }));

    return {
      message: "Thành công",
      data: {
        group,
        posts: formattedPosts,
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
