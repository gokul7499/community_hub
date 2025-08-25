const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUserById,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { upload, handleMulterError } = require('../middleware/uploadMiddleware');

// Protected routes with proper error handling
router.get('/me', protect, getUserProfile);

// Update user profile with file upload support
router.put('/me', 
  protect, 
  upload.single('avatar'), 
  handleMulterError, // Handle multer errors
  updateUserProfile
);

// Public routes
router.get('/:id', getUserById);

module.exports = router;