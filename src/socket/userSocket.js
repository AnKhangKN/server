const User = require("@models/User");

let onlineUsers = new Map();

module.exports = (io, socket) => {
  // Lấy mutual friends online của 1 user
  const getOnlineMutualFriends = async (userId) => {
    try {
      const user = await User.findById(userId)
        .populate("followers", "_id userName userAvatar lastName firstName")
        .populate("following", "_id userName userAvatar lastName firstName")
        .lean();

      if (!user) return [];

      const followersIds = user.followers.map((u) => u._id.toString());
      const followingIds = user.following.map((u) => u._id.toString());

      // mutual follow = đang follow nhau
      const mutualIds = followingIds.filter((id) => followersIds.includes(id));

      // lọc mutual đang online thực sự
      const onlineMutualIds = mutualIds.filter(
        (id) => onlineUsers.has(id) && onlineUsers.get(id).size > 0
      );

      return user.following.filter((f) =>
        onlineMutualIds.includes(f._id.toString())
      );
    } catch (err) {
      console.error("getOnlineMutualFriends error:", err);
      return [];
    }
  };

  // User kết nối
  socket.on("setup", async (userId) => {
    // Thêm socket vào onlineUsers
    if (onlineUsers.has(userId)) {
      onlineUsers.get(userId).add(socket.id);
    } else {
      onlineUsers.set(userId, new Set([socket.id]));
    }

    socket.join(userId);
    console.log(`✅ User ${userId} connected.`);

    // Gửi mutual friends online cho user này
    const onlineFriends = await getOnlineMutualFriends(userId);
    io.to(userId).emit("onlineFriends", onlineFriends);

    // Cập nhật realtime cho tất cả mutual friends của user
    onlineFriends.forEach(async (friend) => {
      const friendsList = await getOnlineMutualFriends(friend._id.toString());
      io.to(friend._id.toString()).emit("onlineFriends", friendsList);
    });
  });

  // 🔹 User logout
  socket.on("logout", async (userId) => {
    if (onlineUsers.has(userId)) {
      const socketIds = onlineUsers.get(userId);
      socketIds.delete(socket.id);
      if (socketIds.size === 0) onlineUsers.delete(userId);
    }
    console.log(`🚪 User ${userId} logged out.`);

    // Cập nhật mutual friends của user
    const onlineFriends = await getOnlineMutualFriends(userId);
    onlineFriends.forEach(async (friend) => {
      const friendsList = await getOnlineMutualFriends(friend._id.toString());
      io.to(friend._id.toString()).emit("onlineFriends", friendsList);
    });
  });

  // 🔹 User disconnect
  socket.on("disconnect", async () => {
    let disconnectedUserId = null;

    // Tìm userId tương ứng với socket.id
    for (let [userId, socketIds] of onlineUsers.entries()) {
      if (socketIds.has(socket.id)) {
        socketIds.delete(socket.id);
        disconnectedUserId = userId;
        if (socketIds.size === 0) onlineUsers.delete(userId);
        break;
      }
    }

    if (!disconnectedUserId) return;
    console.log(`❌ User ${disconnectedUserId} disconnected.`);

    // Cập nhật mutual friends
    const onlineFriends = await getOnlineMutualFriends(disconnectedUserId);
    onlineFriends.forEach(async (friend) => {
      const friendsList = await getOnlineMutualFriends(friend._id.toString());
      io.to(friend._id.toString()).emit("onlineFriends", friendsList);
    });
  });
};
