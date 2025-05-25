const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load env vars - .env should be in the root of the backend directory
dotenv.config();

let transporter;

// Log environment variables for debugging (optional, remove in production)
// console.log('ETHEREAL_EMAIL_USER:', process.env.ETHEREAL_EMAIL_USER);
// console.log('NODE_ENV:', process.env.NODE_ENV);
// console.log('EMAIL_HOST:', process.env.EMAIL_HOST);

if (process.env.ETHEREAL_EMAIL_USER && process.env.ETHEREAL_EMAIL_PASS && process.env.NODE_ENV !== 'production') {
    // Use Ethereal for testing if Ethereal creds are provided and not in production
    console.log('Using Ethereal for email transport.');
    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587, // Standard Ethereal port
        auth: {
            user: process.env.ETHEREAL_EMAIL_USER,
            pass: process.env.ETHEREAL_EMAIL_PASS,
        },
    });
} else if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Use generic SMTP - ensure these are set for production or other test environments
    console.log('Using generic SMTP for email transport.');
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        secure: parseInt(process.env.EMAIL_PORT || '587', 10) === 465, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
} else {
    console.warn(
`*******************************************************************************
* WARNING: Email transport is not configured. Emails will not be sent.        *
* Please set either ETHEREAL_EMAIL_USER/PASS (for testing) or                 *
* EMAIL_HOST/USER/PASS/PORT (for production/other SMTP) in your .env file.    *
*******************************************************************************`
    );
    // Create a mock transporter that does nothing but allows the app to run
    transporter = {
        sendMail: async (options) => {
            console.warn(`Email not sent (transporter not configured): To: ${options.to}, Subject: ${options.subject}`);
            // Return a mock info object similar to what nodemailer provides
            return {
                messageId: `mock-${Date.now()}`,
                response: '250 OK: command not implemented (mock transporter)',
                accepted: [options.to],
                rejected: [],
                pending: [],
            };
        }
    };
}

module.exports = transporter;
