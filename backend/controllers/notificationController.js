const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// @desc    Get notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res) => {
  const recipientUser = req.user._id;
  const { readStatus = 'unread', page = 1, limit = 10 } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const query = { recipientUser };

  if (readStatus === 'read') {
    query.isRead = true;
  } else if (readStatus === 'unread') {
    query.isRead = false;
  }
  // If 'all', no filter on isRead

  try {
    const notifications = await Notification.find(query)
      .populate('senderUser', 'firstName lastName email role') // Populate sender details
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limitNum);

    const totalCount = await Notification.countDocuments(query);

    res.status(200).json({
      currentPage: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      totalNotifications: totalCount,
      notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error while fetching notifications', error: error.message });
  }
};

// @desc    Mark a specific notification as read
// @route   PUT /api/notifications/:notificationId/read
// @access  Private
const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    return res.status(400).json({ message: 'Invalid notification ID format' });
  }

  try {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipientUser: userId,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found or not authorized for this user.' });
    }

    if (notification.isRead) {
      return res.status(200).json({ message: 'Notification already marked as read.', notification });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read successfully.', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error while marking notification as read', error: error.message });
  }
};

// @desc    Mark all unread notifications for the user as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllMyNotificationsAsRead = async (req, res) => {
  const userId = req.user._id;

  try {
    const result = await Notification.updateMany(
      { recipientUser: userId, isRead: false },
      { $set: { isRead: true } }
    );

    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: 'No unread notifications to mark as read.' });
    }

    res.status(200).json({ message: `${result.modifiedCount} notification(s) marked as read.` });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error while marking all notifications as read', error: error.message });
  }
};

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllMyNotificationsAsRead,
};
