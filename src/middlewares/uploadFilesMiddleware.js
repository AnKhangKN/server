// middleware/uploadFilesMiddleware.js
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const multer = require("multer");

// Lưu file vào memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware chính: upload files lên Cloudinary
const uploadFiles = async (req, res, next) => {
  try {
    if (!req.files) return next();

    req.cloudinary = { medias: [], documents: [] };

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

    // Upload mediaFiles
    if (req.files.mediaFiles) {
      const mediaUrls = await Promise.all(
        req.files.mediaFiles.map(async (file) => {
          const url = await uploadFile(file, "posts/media");
          return {
            url,
            type: file.mimetype.startsWith("image") ? "image" : "video",
            name: file.originalname,
          };
        })
      );
      req.cloudinary.medias = mediaUrls;
    }

    // Upload documentFiles
    if (req.files.documentFiles) {
      const docUrls = await Promise.all(
        req.files.documentFiles.map(async (file) => {
          const url = await uploadFile(file, "posts/documents");
          return { url, type: "file", name: file.originalname };
        })
      );
      req.cloudinary.documents = docUrls;
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload file thất bại" });
  }
};

module.exports = { upload, uploadFiles };
