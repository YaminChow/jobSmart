import multer from 'multer';
import path from 'path';

// Store files locally (you can customize storage as needed)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Make sure this folder exists or create it dynamically
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, baseName + '-' + Date.now() + ext);
  }
});

export const upload = multer({ storage });