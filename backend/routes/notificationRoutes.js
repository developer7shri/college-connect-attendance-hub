const express = require('express');
const router = express.Router();

const {
  getMyNotifications,
  markNotificationAsRead,
  markAllMyNotificationsAsRead,
} = require('../controllers/notificationController');

const { protect } = require('../middleware/authMiddleware'); // No need for authorize here, as it's user-specific

// @route   GET /api/notifications
// @desc    Get notifications for the logged-in user
// @access  Private
router.route('/').get(protect, getMyNotifications);

// @route   PUT /api/notifications/:notificationId/read
// @desc    Mark a specific notification as read
// @access  Private
router.route('/:notificationId/read').put(protect, markNotificationAsRead);

// @route   PUT /api/notifications/read-all
// @desc    Mark all unread notifications for the user as read
// @access  Private
router.route('/read-all').put(protect, markAllMyNotificationsAsRead);

module.exports = router;
