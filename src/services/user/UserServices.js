const User = require("../../models/User");
const throwError = require("../../utils/throwError");

class UserServices {
  async getFriendsSuggest(userId) {
    // 1️⃣ Lấy thông tin user hiện tại
    const currentUser = await User.findById(userId).lean();
    if (!currentUser) throwError("Không tìm thấy người dùng!", 400);

    // 2️⃣ Lấy danh sách ID bạn bè bị ẩn/chặn
    const hiddenIds =
      currentUser.friendsHidden?.map((f) => f.friendId.toString()) || [];

    // 3️⃣ Lấy danh sách user chưa bị ẩn/chặn, trừ chính mình
    const users = await User.find({
      _id: { $nin: [...hiddenIds, userId] },
    })
    .lean();

    // 4️⃣ Lọc những user chưa được following
    const notFollowingUsers = users.filter(
      (u) =>
        !currentUser.following.some((id) => id.toString() === u._id.toString())
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
      data: user.friendsHidden,
    };
  }
}

module.exports = new UserServices();
