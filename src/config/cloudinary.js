const cloudinary = require("cloudinary").v2;
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("./env");

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME, // tên cloud
  api_key: CLOUDINARY_API_KEY, // key
  api_secret: CLOUDINARY_API_SECRET, // secret
});

module.exports = cloudinary;
