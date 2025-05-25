const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  updatePassword,
} = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware'); // Will be added later

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   PUT /api/auth/update-password
// @desc    Update user password
// @access  Private (will require auth middleware)
// For now, it's not protected. Add 'protect' middleware once it's created.
// Example: router.put('/update-password', protect, updatePassword);
router.put('/update-password', updatePassword); // Placeholder for when req.user is not available

module.exports = router;
