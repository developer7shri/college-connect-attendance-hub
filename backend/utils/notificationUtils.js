const Notification = require('../models/Notification');
const sendEmail = require('./sendEmail'); // Assuming sendEmail utility exists
const User = require('../models/User'); // For fetching email if needed

/**
 * Creates and saves a single notification.
 * Optionally sends an email if the notification type warrants it.
 * @param {object} details - Notification details.
 * @param {string} details.recipientUser - ObjectId of the recipient user.
 * @param {string} [details.senderUser] - ObjectId of the sender user.
 * @param {string} details.title - Notification title.
 * @param {string} details.message - Notification message.
 * @param {string} details.type - Notification type (e.g., 'LeaveStatus', 'Announcement').
 * @param {string} [details.link] - Optional link related to the notification.
 */
const createNotification = async (details) => {
  try {
    const notification = new Notification(details);
    await notification.save();

    // Optional Email Trigger
    if (['Announcement', 'LeaveStatus'].includes(details.type) || (details.type === 'System' && details.title.toLowerCase().includes('critical'))) {
      const recipient = await User.findById(details.recipientUser).select('email firstName');
      if (recipient && recipient.email) {
        const emailDetails = {
          to: recipient.email,
          subject: `SCAHTS Notification: ${details.title}`,
          text: `Hello ${recipient.firstName},\n\n${details.message}\n\n${details.link ? `More info: ${details.link}` : ''}\n\nThank you,\nSCAHTS Team`,
          html: `<p>Hello ${recipient.firstName},</p><p>${details.message}</p>${details.link ? `<p><a href="${details.link}">Click here for more details</a></p>` : ''}<p>Thank you,<br/>The SCAHTS Team</p>`,
        };
        // Send email but don't let it block notification creation
        sendEmail(emailDetails)
          .then(() => console.log(`Email triggered for notification to ${recipient.email}`))
          .catch(err => console.error(`Failed to send email for notification to ${recipient.email}:`, err));
      }
    }
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    // Depending on how critical this is, you might rethrow or handle differently
    throw error; // Rethrow to indicate failure to the caller
  }
};

/**
 * Creates multiple notifications in bulk.
 * @param {Array<object>} notificationsDataArray - Array of notification detail objects.
 */
const createBulkNotifications = async (notificationsDataArray) => {
  if (!notificationsDataArray || notificationsDataArray.length === 0) {
    return { successCount: 0, errors: [] };
  }

  try {
    // Using insertMany for efficiency
    const createdNotifications = await Notification.insertMany(notificationsDataArray, { ordered: false }); // ordered: false allows valid ones to insert even if some fail

    // Optional: Trigger emails for each created notification if needed (can be resource-intensive)
    // For simplicity, bulk email triggering is omitted here but could be added similarly to createNotification
    // For example:
    // for (const notification of createdNotifications) {
    //   if (['Announcement'].includes(notification.type)) {
    //     // ... fetch user and send email logic ...
    //   }
    // }

    return { successCount: createdNotifications.length, errors: [] };
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    // error.writeErrors contains details about which documents failed if ordered: false
    return { successCount: error.insertedDocs ? error.insertedDocs.length : 0 , errors: error.writeErrors || [error.message] };
  }
};

module.exports = {
  createNotification,
  createBulkNotifications,
};
