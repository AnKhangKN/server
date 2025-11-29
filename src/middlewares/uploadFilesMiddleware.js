// middlewares/uploadFilesMiddleware.js
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const multer = require("multer");

// --- Lưu file vào memory ---
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- Upload 1 file lên Cloudinary ---
const uploadFile = (file, folder) =>
  new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const resource_type =
      file.mimetype && file.mimetype.startsWith("image")
        ? "image"
        : file.mimetype && file.mimetype.startsWith("video")
        ? "video"
        : "raw";

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type,
        public_id: `${Date.now()}-${file.originalname || "file"}`,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(
          result && result.secure_url
            ? result.secure_url
            : (result && result.url) || null
        );
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });

// --- Middleware chính ---
const uploadFiles = async (req, res, next) => {
  try {
    // nếu không có file => next
    if (!req.files || Object.keys(req.files).length === 0) return next();

    req.cloudinary = {};

    // --- Upload avatar / cover group (nếu có) ---
    const groupFields = [
      { field: "groupAvatar", folder: "groups/avatar" },
      { field: "groupCoverImage", folder: "groups/cover" },
    ];

    for (let { field, folder } of groupFields) {
      if (req.files[field] && req.files[field][0]) {
        req.cloudinary[field] = await uploadFile(req.files[field][0], folder);
      }
    }

    // --- Hàm upload nhiều file (nằm trong middleware để truy cập req) ---
    const uploadMultipleFiles = async (field, folderPrefix) => {
      if (!req.files[field] || !Array.isArray(req.files[field])) return [];
      return Promise.all(
        req.files[field].map(async (file) => ({
          url: await uploadFile(file, folderPrefix),
          type:
            file.mimetype && file.mimetype.startsWith("image")
              ? "image"
              : file.mimetype && file.mimetype.startsWith("video")
              ? "video"
              : "file",
          name: file.originalname || "",
        }))
      );
    };

    // --- Upload cho Post ---
    req.cloudinary.postMedias = await uploadMultipleFiles(
      "mediaPosts",
      "posts/medias"
    );
    req.cloudinary.postDocuments = await uploadMultipleFiles(
      "documentPosts",
      "posts/documents"
    );

    // --- Upload cho Message ---
    req.cloudinary.messageMedias = await uploadMultipleFiles(
      "mediaMessages",
      "messages/medias"
    );
    req.cloudinary.messageDocuments = await uploadMultipleFiles(
      "documentMessages",
      "messages/documents"
    );

    // --- Upload cho Comment ---
    req.cloudinary.commentMedias = await uploadMultipleFiles(
      "mediaComments",
      "comments/medias"
    );
    req.cloudinary.commentDocuments = await uploadMultipleFiles(
      "documentComments",
      "comments/documents"
    );

    // --- Upload user avatar / cover (nếu có) ---
    if (req.files.userAvatar && req.files.userAvatar[0]) {
      req.cloudinary.userAvatar = await uploadFile(
        req.files.userAvatar[0],
        "users/avatar"
      );
    }

    if (req.files.userCover && req.files.userCover[0]) {
      req.cloudinary.userCover = await uploadFile(
        req.files.userCover[0],
        "users/cover"
      );
    }

    next();
  } catch (err) {
    console.error("Upload file thất bại:", err);
    res
      .status(500)
      .json({ error: "Upload file thất bại", detail: err.message || err });
  }
};

module.exports = { upload, uploadFiles };
