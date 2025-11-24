const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const multer = require("multer");

// --- Lưu file vào memory ---
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- Hàm upload 1 file lên Cloudinary ---
const uploadFile = (file, folder) =>
  new Promise((resolve, reject) => {
    const resource_type = file.mimetype.startsWith("image")
      ? "image"
      : file.mimetype.startsWith("video")
      ? "video"
      : "raw";

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type,
        public_id: `${Date.now()}-${file.originalname}`,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });

// --- Middleware chính ---
const uploadFiles = async (req, res, next) => {
  try {
    if (!req.files) return next();

    req.cloudinary = {}; // Tạo object rỗng lưu kết quả upload

    // --- Upload avatar / cover group ---
    const groupFields = [
      { field: "groupAvatar", folder: "groups/avatar" },
      { field: "groupCoverImage", folder: "groups/cover" },
    ];

    for (let { field, folder } of groupFields) {
      if (req.files[field]) {
        req.cloudinary[field] = await uploadFile(req.files[field][0], folder);
      }
    }

    // --- Hàm upload nhiều file ---
    const uploadMultipleFiles = async (field, folderPrefix) => {
      if (!req.files[field]) return [];
      return Promise.all(
        req.files[field].map(async (file) => ({
          url: await uploadFile(file, folderPrefix),
          type: file.mimetype.startsWith("image")
            ? "image"
            : file.mimetype.startsWith("video")
            ? "video"
            : "file",
          name: file.originalname,
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

    next();
  } catch (err) {
    console.error("Upload file thất bại:", err);
    res.status(500).json({ error: "Upload file thất bại" });
  }
};

module.exports = { upload, uploadFiles };
