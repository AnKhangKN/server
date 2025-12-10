const Department = require("@models/Department");
const Group = require("@models/Group");
const Heart = require("@models/Heart");
const Post = require("@models/Post");
const Share = require("@models/Share");
const User = require("@models/User");

class PostServices {
  async createNewPost({
    group,
    department,
    author,
    content,
    bgContent,
    hashtag,
    userTag,
    emotion,
    medias,
    documents,
    privacy,
  }) {
    // Tạo document mới
    const newPost = await Post.create({
      group,
      department,
      author,
      content,
      bgContent,
      hashtag,
      userTag,
      emotion,
      privacy,
      medias: medias || [],
      documents: documents || [],
    });

    await User.findByIdAndUpdate(
      author,
      { privacyPost: privacy },
      { new: true }
    );

    return newPost;
  }

  async getPosts(userId) {
    // 1️⃣ Lấy danh sách user follow
    const user = await User.findById(userId).select("following").lean();
    const following = user.following || [];

    // 2️⃣ Lấy danh sách group user đã tham gia
    const groups = await Group.find({
      groupMember: userId,
    }).select("_id");
    const groupsJoined = groups.map((g) => g._id);

    // 3️⃣ Lấy danh sách Post
    const posts = await Post.find({
      status: "active",
      $or: [
        { department: { $ne: null } }, // bài viết department
        { group: { $in: groupsJoined } }, // bài viết group
        { author: { $in: following } }, // bài viết từ user follow
        {
          $and: [
            { group: null },
            { department: null },
            { author: userId }, // bài viết của bản thân
          ],
        },
      ],
    })
      .populate({
        path: "author",
        select: "firstName lastName userAvatar userName isTeacher",
      })
      .populate({
        path: "group",
        select: "groupName groupAvatar",
      })
      .populate({
        path: "department",
        select: "departmentName departmentCode",
      })
      .populate({
        path: "hearts",
        select: "author",
      })
      .lean();

    // 4️⃣ Lấy danh sách Share
    const shares = await Share.find({
      author: { $in: [userId, ...following] }, // share của bản thân hoặc người follow
    })
      .populate({
        path: "author",
        select: "firstName lastName userAvatar userName isTeacher",
      })
      .populate({
        path: "post",
        match: { status: "active" }, // chỉ lấy post đang active
        populate: [
          {
            path: "author",
            select: "firstName lastName userAvatar userName isTeacher",
          },
          { path: "group", select: "groupName groupAvatar" },
          { path: "department", select: "departmentName departmentCode" },
          { path: "hearts", select: "author" },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();

    // 5️⃣ Loại bỏ share không có post (post bị xóa)
    const validShares = shares.filter((s) => s.post);

    // 6️⃣ Gộp chung Post và Share theo thời gian
    const merged = [
      ...posts.map((p) => ({ type: "post", data: p, createdAt: p.createdAt })),
      ...validShares.map((s) => ({
        type: "share",
        data: s,
        createdAt: s.createdAt,
      })),
    ].sort((a, b) => b.createdAt - a.createdAt); // mới nhất lên đầu

    return {
      message: "Lấy danh sách bài viết và chia sẻ thành công!",
      posts: merged,
    };
  }

  async getPostById(postId) {
    const post = await Post.findById(postId)
      .populate({
        path: "author",
        select: "firstName lastName userAvatar",
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
      message: "Lấy bài viết thành công!",
      data: {
        type: "post",
        data: post,
      },
    };
  }

  async getPostsDepartment() {
    const posts = await Post.find({ department: { $ne: null } })
      .populate({
        path: "author",
        select: "firstName lastName userAvatar userName isTeacher",
      })
      .populate({
        path: "department",
        select: "departmentName departmentCode",
      })
      .populate({
        path: "hearts",
        select: "author",
      })
      .sort({ createdAt: -1 })
      .lean();

    return {
      message: "Lấy tất cả bài viết có department thành công!",
      data: posts.map((p) => ({
        type: "post", // chuẩn hoá giống feed (không ảnh hưởng frontend)
        data: p,
      })),
    };
  }

  async getPostsDepartmentDetail(departmentId) {
    const department = await Department.findById(departmentId);

    if (!department) {
      return {
        message: "Department không tồn tại",
        data: [],
      };
    }

    const posts = await Post.find({
      department: department._id, // Lấy bài viết thuộc department này
    })
      .populate({
        path: "author",
        select: "firstName lastName userAvatar userName isTeacher",
      })
      .populate({
        path: "department",
        select: "departmentName departmentCode",
      })
      .populate({
        path: "hearts",
        select: "author",
      })
      .sort({ createdAt: -1 })
      .lean();

    return {
      message: "Lấy bài viết thành công",
      data: posts.map((p) => ({
        type: "post", // chuẩn hoá giống feed (không ảnh hưởng frontend)
        data: p,
      })),
    };
  }
}

module.exports = new PostServices();
