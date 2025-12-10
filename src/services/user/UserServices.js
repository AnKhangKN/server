const User = require("@models/User");
const Post = require("@models/Post");
const throwError = require("../../utils/throwError");
const Share = require("@models/Share");

class UserServices {
  async getFriendsSuggest(userId) {
    // 1️⃣ Lấy thông tin user hiện tại
    const user = await User.findById(userId).lean();
    if (!user) throwError("Không tìm thấy người dùng!", 400);

    // 2️⃣ Lấy danh sách ID bạn bè bị ẩn/chặn
    const hiddenIds =
      user.friendsHidden?.map((f) => f.friendId.toString()) || [];

    const now = new Date();

    console.log("User following:", user.following);

    // 3️⃣ Lấy danh sách user chưa bị ẩn/chặn, trừ chính mình, trừ các user là admin
    const users = await User.find({
      _id: { $nin: [...hiddenIds, userId] },
      isAdmin: false,
      statusAccount: "active",
      $or: [
        { lockedTime: { $exists: false } }, // user chưa bị khóa
        { lockedTime: { $lt: now } }, // user bị khóa nhưng đã hết hạn
      ],
    }).lean();

    // 4️⃣ Lọc những user chưa được following
    const notFollowingUsers = users.filter(
      (u) => !user.following.some((id) => id.toString() === u._id.toString())
    );

    return {
      message: "Lấy danh sách gợi ý bạn bè thành công!",
      data: notFollowingUsers,
    };
  }

  async followFriend(userId, friendId) {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) throwError("Không tìm thấy người dùng!", 400);

    let isFollowing = false;

    if (user.following.some((id) => id.toString() === friendId.toString())) {
      // Bỏ theo dõi nếu đã follow
      user.following = user.following.filter(
        (id) => id.toString() !== friendId.toString()
      );
      friend.followers = friend.followers.filter(
        (id) => id.toString() !== userId.toString()
      );
      await user.save();
      await friend.save();

      isFollowing = false;

      return {
        message: `Bạn đã bỏ theo dõi ${friend.firstName || "người này"}.`,
        isFollowing,
        following: user.following,
      };
    } else {
      // Theo dõi mới nếu chưa follow
      user.following.push(friendId);
      friend.followers.push(userId);
      await user.save();
      await friend.save();

      isFollowing = true;

      return {
        message: `Bạn đã theo dõi ${
          friend.firstName || "người này"
        } thành công!`,
        isFollowing,
        following: user.following,
      };
    }
  }

  async hiddenOrBlockFriend(userId, friendId, type) {
    const user = await User.findById(userId);
    if (!user) throwError("Không tìm thấy người dùng!", 400);

    const existing = user.friendsHidden.find(
      (item) => item.friendId.toString() === friendId.toString()
    );

    if (existing) {
      throwError("Người dùng đã bị ẩn/chặn trước đó!", 400);
    } else {
      user.friendsHidden.push({
        friendId,
        type,
        hiddenAt: new Date(),
      });
    }

    await user.save();

    return {
      message: `Người dùng ${friendId} đã bị ${
        type === "block" ? "chặn" : "ẩn"
      }!`,
      data: user,
    };
  }

  async getProfile(userName) {
    // 1. Tìm user
    const user = await User.findOne({ userName }).select("-password");
    if (!user) {
      throwError("Không tìm thấy người dùng!", 400);
    }

    // 2. Lấy tất cả bài viết của user
    const posts = await Post.find({ author: user._id })
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
      })
      .sort({ createdAt: -1 })
      .lean();

    // 3. Lấy tất cả bài share của user
    const shares = await Share.find({ author: user._id })
      .populate({
        path: "post",
        populate: [
          { path: "author", select: "firstName lastName userAvatar" },
          { path: "group", select: "groupName groupAvatar" },
          { path: "hearts", select: "author" },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();

    // 4. Gộp posts và shares để trả về
    const combinedPosts = [
      ...posts.map((p) => ({ type: "post", data: p })),
      ...shares.map((s) => ({ type: "share", data: s })),
    ].sort((a, b) => new Date(b.data.createdAt) - new Date(a.data.createdAt));

    // 5. Trả về kết quả
    return {
      message: "Lấy thông tin user và bài viết thành công",
      data: {
        user,
        posts: combinedPosts,
      },
    };
  }

  async getFollower(userName) {
    const user = await User.findOne({ userName })
      .select("_id userName")
      .populate("followers", "userAvatar userName lastName firstName");

    return {
      data: user,
    };
  }

  async getFollowing(userName) {
    const user = await User.findOne({ userName })
      .select("_id userName")
      .populate("following", "userAvatar userName lastName firstName");

    return {
      data: user,
    };
  }

  async getFriends(userId) {
    const user = await User.findById(userId)
      .populate("followers", "_id") // lấy danh sách followers
      .populate("following", "_id"); // lấy danh sách following

    if (!user) throwError("Người dùng không tồn tại!", 401);

    // Lấy danh sách id
    const followersIds = user.followers.map((u) => u._id.toString());
    const followingIds = user.following.map((u) => u._id.toString());

    // Lọc ra mutual friends (người vừa follow, vừa được follow)
    const mutualIds = followingIds.filter((id) => followersIds.includes(id));

    // Lấy thông tin người dùng theo danh sách mutualIds
    const friends = await User.find(
      { _id: { $in: mutualIds } },
      "_id userName lastName firstName userAvatar"
    );

    return friends;
  }

  async updateInfoUser(
    userId,
    lastName,
    firstName,
    userName,
    studentId,
    courses,
    major,
    gender,
    bio
  ) {
    // --------------------------
    // 1. CHECK UNIQUE USERNAME
    // --------------------------
    if (userName !== undefined) {
      const existedUserName = await User.findOne({
        userName,
        _id: { $ne: userId }, // không phải chính user đó
      });

      if (existedUserName) {
        return {
          status: 409,
          message: "Tên người dùng đã tồn tại",
          data: null,
        };
      }
    }

    // --------------------------
    // 2. CHECK UNIQUE STUDENT ID
    // --------------------------
    if (studentId !== undefined) {
      const existedStudentId = await User.findOne({
        studentId,
        _id: { $ne: userId },
      });

      if (existedStudentId) {
        return {
          status: 409,
          message: "Mã số sinh viên đã tồn tại",
          data: null,
        };
      }
    }

    // --------------------------
    // 3. UPDATE INFO
    // --------------------------
    const updates = {};

    if (lastName !== undefined) updates.lastName = lastName;
    if (firstName !== undefined) updates.firstName = firstName;
    if (userName !== undefined) updates.userName = userName;
    if (studentId !== undefined) updates.studentId = studentId;
    if (courses !== undefined) updates.courses = courses;
    if (major !== undefined) updates.major = major;
    if (gender !== undefined) updates.gender = gender;
    if (bio !== undefined) updates.bio = bio;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, upsert: false }
    );

    if (!user) {
      return {
        status: 404,
        message: "User không tồn tại",
        data: null,
      };
    }

    return {
      status: 200,
      message: "Cập nhật thông tin thành công",
      data: user,
    };
  }

  async updateOrderConnect(userId, orderConnect) {
    console.log(orderConnect);

    const user = await User.findByIdAndUpdate(
      userId,
      { orderConnect },
      { new: true }
    );

    return {
      message: "Cập nhật thành công!",
      data: user,
    };
  }

  async deleteUserHidden(userId, friendId) {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          friendsHidden: { friendId: friendId },
        },
      },
      { new: true }
    ).populate({
      path: "friendsHidden.friendId",
      select: "firstName lastName userAvatar userName",
    });

    return {
      message: "Xóa người dùng khỏi danh sách thành công!",
      data: user,
    };
  }
}

module.exports = new UserServices();
