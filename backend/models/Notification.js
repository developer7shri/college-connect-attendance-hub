const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipientUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    senderUser: {
      // Optional: for user-to-user messages or actions triggered by a specific user
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Please provide a notification title'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a notification message'],
    },
    type: {
      type: String,
      enum: [
        'System', // General system messages
        'Announcement', // Admin/HOD announcements
        'LeaveStatus', // Updates on leave requests
        'MarksUpdate', // Marks entered or updated
        'NewMaterial', // New study material uploaded
        'MentoringAlert', // Alerts for mentoring system (if any)
        'General', // Other general notifications
      ],
      required: true,
      index: true,
    },
    link: {
      // Optional: a frontend link related to the notification
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model('Notification', NotificationSchema);
