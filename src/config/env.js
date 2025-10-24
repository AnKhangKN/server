const dotenv = require("dotenv");
const path = require("path");

// Đọc file .env (có thể đặt ở thư mục gốc dự án)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

module.exports = {
  PORT: process.env.PORT || 8000,

  // Database
  MONGO_URI: process.env.MONGO_URI,

  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  // Frontend URL
  FRONT_END_ORIGIN: process.env.FRONT_END_ORIGIN

  // Cloudinary / AWS / Momo (nếu có)
};
