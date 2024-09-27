const multer = require("multer");
const path = require("path");

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Create the multer instance
const upload = multer({ storage });

module.exports = upload;