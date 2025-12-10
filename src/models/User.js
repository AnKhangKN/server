const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 }, // Ít nhất là 6 ký tự

    // Login thất bại nếu 5 lần sẽ bị khóa 30p sao đó mới nhập lại được.
    lockUntil: {
      // Thời điểm bị khóa.
      type: Number,
      default: 0,
    },
    loginAttempts: {
      // Số lần đã nhập sai.
      type: Number,
      required: true,
      default: 0,
    },

    studentId: { type: String, unique: true },
    courses: { type: String }, // Ví dụ: khóa 47, 48,...
    userAvatar: {
      type: String,
      default: "", // ảnh mặc định
    },
    userCover: {
      type: String,
      default: "", // ảnh mặc định
    },
    bio: { type: String, maxlength: 200, default: "" },

    orderConnect: [
      {
        linkName: { type: String },
        linkConnect: { type: String },
      },
    ],

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
    isTeacher: { type: Boolean, default: false }, // Xác thực là giáo viên.
    isVerified: { type: Boolean, default: false },

    privacyPost: {
      //Thiết lập mặt định khi đăng bài post lưu cho các lần kế tiếp (friend dành cho cả 2 người theo dỗi nhau.)
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },

    status: {
      type: String, // trạng thái tài khoảng
      enum: ["online", "offline"],
      default: "online",
    },

    // Nếu bị admin khóa sẽ là locked và locked time (thời gian sẽ được mở khóa).
    statusAccount: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    lockedTime: {
      type: Date,
    },

    // Số lần bị khóa
    lockCount: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
