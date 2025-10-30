const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 }, // Ít nhất là 6 ký tự

    studentId: { type: String, unique: false, sparse: true },
    courses: { type: Number, min: 1 }, // Ví dụ: khóa 47, 48,...
    userAvatar: {
      type: String,
      default: "", // ảnh mặc định
    },
    coverImage: {
      type: String,
      default: "", // ảnh mặc định
    },
    bio: { type: String, maxlength: 200, default: "" },
    orderConnect: [{ type: String }], // Các link mạng xã hội khác
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    major: { type: String },

    // Tạo tự động
    userName: { type: String, required: true, unique: true, trim: true },

    // Kết nối mạng xã hội trong hệ thống
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    favorite: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Chứa danh sách người dùng chặn, ẩn đi trong đề xuất
    friendsHidden: [
      {
        type: { type: String, enum: ["block", "hidden"], required: true }, // loại hành động
        friendId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        }, // người bị ẩn/chặn
        hiddenAt: { type: Date, default: Date.now }, // thời điểm thực hiện
      },
    ],

    // Trạng thái & quyền
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },

    privacyPost: {
      //Thiết lập mặt định khi đăng bài post lưu cho các lần kế tiếp (friend dành cho cả 2 người theo dỗi nhau.)
      type: String,
      enum: ["public", "friend", "private"],
      default: "public",
    },

    status: {
      type: String, // trạng thái tài khoảng
      enum: ["online", "offline", "busy", "invisible"],
      default: "online",
    },
    isTeacher: { type: Boolean, default: false }, // Xác thực là giáo viên.
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
