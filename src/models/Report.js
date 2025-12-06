const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    // Loại đối tượng bị report: Post, User, Comment, Group
    reportType: {
      type: String,
      enum: ["Post", "User", "Group"],
      required: true,
    },
    // Tham chiếu đến đối tượng bị report (Post/User/Comment/Group)
    reportModels: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "reportType",
    },

    reportUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // admin nào xử lý
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reason: { type: String, required: true },

    reportContent: {
      type: String,
    },

    isConfirm: {
      type: Boolean,
      default: false,
    },

    isCancel: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo model
module.exports = mongoose.model("Report", reportSchema);
