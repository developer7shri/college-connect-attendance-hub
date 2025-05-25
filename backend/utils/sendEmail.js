const nodemailer = require('nodemailer');
const transporter = require('../config/nodemailer'); // Path to your nodemailer config
const dotenv = require('dotenv');

dotenv.config();

const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"SCAHTS Admin" <noreply@example.com>', // Fallback if EMAIL_FROM not set
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  try {
    // Check if the transporter is the mock transporter
    if (transporter.sendMail.toString().includes('mock transporter')) {
        console.warn(`Mock Transporter: Email to ${to} with subject "${subject}" not sent as email service is not configured.`);
        // Simulate a successful send for mock transporter
        return {
            messageId: `mock-${Date.now()}`,
            previewUrl: null // No preview URL for mock
        };
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);

    // If using Ethereal, log the preview URL
    if (process.env.ETHEREAL_EMAIL_USER && process.env.NODE_ENV !== 'production') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('Preview URL: %s', previewUrl);
        return { messageId: info.messageId, previewUrl };
      }
    }
    return { messageId: info.messageId, previewUrl: null };
  } catch (error) {
    console.error('Error sending email:', error);
    // Rethrow the error or handle it as per application needs
    // For now, we'll rethrow to indicate failure but this could be softened
    // so that user registration doesn't fail if email fails.
    // However, the prompt asks to not let email failure prevent user registration,
    // so this error should be caught by the caller (authController).
    throw error;
  }
};

module.exports = sendEmail;
