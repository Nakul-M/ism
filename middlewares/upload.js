// middlewares/upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // adjust if in a different folder

// Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "students", // cloud folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  }
});

// Multer config with max size 200 KB
const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 }, // max 200 KB
});

// Middleware to check min size 30 KB
function minFileSize(req, res, next) {
  if (req.file && req.file.size < 30 * 1024) {
    req.flash("success" ," Must be between 30 KB-200 KB ");
    return res.redirect('back');
  }
  next();
}

module.exports = { upload, minFileSize };
