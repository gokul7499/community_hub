const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'backend', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    try {
      const ext = path.extname(file.originalname);
      const timestamp = Date.now();
      const safeName = `${file.fieldname}-${timestamp}${ext}`;
      cb(null, safeName);
    } catch (error) {
      cb(error);
    }
  }
});

function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  
  if (allowed.includes(file.mimetype)) {
    return cb(null, true);
  }
  
  cb(new Error('Only JPG, PNG, WEBP images are allowed'), false);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1 // Only one file at a time
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Only one file allowed' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected field name' });
    }
  }
  
  if (err && err.message === 'Only JPG, PNG, WEBP images are allowed') {
    return res.status(400).json({ message: err.message });
  }
  
  next(err);
};

module.exports = { 
  upload, 
  uploadsDir,
  handleMulterError 
};