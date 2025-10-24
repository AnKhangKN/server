const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Thông tin bắt buộc khi đăng ký
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 }, // Ít nhất là 6 ký tự

    // Thông tin sinh viên có thể cập nhật sau
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
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Trạng thái & quyền
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["online", "offline", "busy"],
      default: "online",
    },
    isTeacher: { type: Boolean, default: false }, // Xác thực là giáo viên.
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
