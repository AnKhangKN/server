const Comment = require("@models/Comment");
const Heart = require("@models/Heart");
const Post = require("@models/Post");
const throwError = require("../../utils/throwError");
const Message = require("@models/Message");

class HeartServices {
  async heartTarget(targetId, targetType, userId) {
    let Model;

    // Xác định model theo targetType
    if (targetType === "Comment") Model = Comment;
    else if (targetType === "Post") Model = Post;
    else if (targetType === "Message") Model = Message;
    else throwError("Invalid target type", 400);

    // Kiểm tra tồn tại
    const target = await Model.findById(targetId);
    if (!target) throwError(`${targetType} not found`, 404);

    // Kiểm tra đã thả tim chưa
    const existedHeart = await Heart.findOne({
      author: userId,
      targetId,
    });

    // Nếu đã thả → bỏ tim
    if (existedHeart) {
      await Heart.deleteOne({ _id: existedHeart._id });

      const updated = await Model.findByIdAndUpdate(
        targetId,
        {
          $inc: { heartsCount: -1 },
          $pull: { hearts: existedHeart._id },
        },
        { new: true }
      );

      return {
        message: `User ${userId} removed heart on ${targetType} ${targetId}`,
        heartsCount: updated.heartsCount,
        isHearted: false,
      };
    }

    // Nếu chưa thả → thêm tim
    const newHeart = await Heart.create({
      author: userId,
      targetId,
      targetType,
    });

    const updated = await Model.findByIdAndUpdate(
      targetId,
      {
        $inc: { heartsCount: 1 },
        $push: { hearts: newHeart._id },
      },
      { new: true }
    );

    return {
      message: `User ${userId} hearted ${targetType} ${targetId}`,
      heartsCount: updated.heartsCount,
      isHearted: true,
    };
  }
}

module.exports = new HeartServices();
