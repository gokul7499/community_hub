const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUserById,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Protected routes
router.get('/me', protect, getUserProfile);
router.put('/me', protect, upload.single('avatar'), updateUserProfile);

// Public routes
router.get('/:id', getUserById);

module.exports = router;
