const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  updatePassword,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Updated import

// @route   POST /api/auth/register
// @desc    Register a new user (Admin only)
// @access  Private/Admin
router.post('/register', protect, authorize('Admin'), registerUser); // Secured route

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   PUT /api/auth/update-password
// @desc    Update user password
// @access  Private (will require auth middleware)
// For now, it's not protected. Add 'protect' middleware once it's created.
router.put('/update-password', protect, updatePassword);

module.exports = router;
