const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const sendEmail = require('../utils/sendEmail'); // Import sendEmail utility

// Load env vars
dotenv.config();

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const {
    email,
    password,
    role,
    firstName,
    lastName,
    phoneNumber,
    department,
    semester,
    usn,
  } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if USN already exists if provided (for students)
    if (usn) {
        let existingUsn = await User.findOne({ usn });
        if (existingUsn) {
            return res.status(400).json({ message: 'USN already exists' });
        }
    }

    // Create new user instance
    user = new User({
      email,
      password, // Password will be hashed by pre-save middleware in User model
      role,
      firstName,
      lastName,
      phoneNumber,
      department,
      semester,
      usn,
      isPasswordDefault: true, // Assuming default password might be phone number or similar
    });

    await user.save();

    // Respond with user details and token (excluding password)
    const userResponse = {
      _id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      department: user.department,
      semester: user.semester,
      usn: user.usn,
      isPasswordDefault: user.isPasswordDefault,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json({
      ...userResponse,
      token: generateToken(user._id),
    });

    // TODO: Implement nodemailer for sending credentials - DONE
    // console.log(`TODO: Send email to ${email} with credentials.`);

    if (user.role !== 'Admin') {
      const subject = 'SCAHTS Account Created - Your Login Credentials';
      const textBody = `Hello ${user.firstName},\n\nYour account for SCAHTS has been created.\n\nYour User ID is: ${user.email}\nYour initial password is: ${req.body.password} (or your phone number if that was used as default)\n\nPlease log in at your earliest convenience and change your password. Your account is currently marked with a default password, and you will be prompted or should change it immediately for security reasons.\n\nThank you,\nSCAHTS Team`;
      const htmlBody = `
        <p>Hello ${user.firstName},</p>
        <p>Your account for SCAHTS (Student Course Allocation and Handling Tracking System) has been successfully created.</p>
        <p>Please find your initial login credentials below:</p>
        <ul>
          <li><strong>User ID (Email):</strong> ${user.email}</li>
          <li><strong>Initial Password:</strong> ${req.body.password}</li> 
        </ul>
        <p><strong>Important:</strong> For security reasons, your account is currently using a default password (<code>isPasswordDefault: true</code>). You are strongly advised to log in as soon as possible and change this password to one of your choosing.</p>
        <p>You can log in at [Link to SCAHTS Login Page - Placeholder]</p>
        <p>Thank you,<br/>The SCAHTS Team</p>
      `;
      // Note: req.body.password contains the plain text password before hashing by the model.
      // The user schema sets isPasswordDefault to true by default.

      try {
        await sendEmail({
          to: user.email,
          subject: subject,
          text: textBody,
          html: htmlBody,
        });
        console.log(`Initial credentials email sent to ${user.email}`);
      } catch (emailError) {
        console.error(`Failed to send initial credentials email to ${user.email}:`, emailError);
        // Do not prevent user registration if email fails. The error is logged.
      }
    }

  } catch (error) {
    console.error(error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  console.log('DEBUG: loginUser controller invoked.'); // General invocation log
  const { email, password } = req.body;
  console.log(`DEBUG: Attempting login for email: [${email}]`); // Log email
  // Avoid logging the raw password directly in production, but for temporary debugging:
  console.log(`DEBUG: Password received (first 3 chars): [${password ? password.substring(0, 3) : 'N/A'}...]`);


  try {
    // Check for user by email
    console.log(`DEBUG: Searching for user with email: [${email}]`);
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password'); // Ensure email is lowercased for query, as it's stored as lowercase.

    if (!user) {
      console.log(`DEBUG: User not found for email: [${email.toLowerCase()}]`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`DEBUG: User found: ID [${user._id}], Email [${user.email}], Role [${user.role}]`);
    // Do NOT log user.password here as it's the hash.

    // Check if password matches
    console.log(`DEBUG: About to call user.matchPassword() for user ID [${user._id}]`);
    const isMatch = await user.matchPassword(password);
    console.log(`DEBUG: Result of user.matchPassword(): [${isMatch}]`);

    if (!isMatch) {
      console.log(`DEBUG: Password mismatch for user ID [${user._id}]`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`DEBUG: Login successful for user ID [${user._id}]. Generating token...`);
    // Respond with user details and token (excluding password)
    const userResponse = {
      _id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      department: user.department,
      semester: user.semester,
      usn: user.usn,
      isPasswordDefault: user.isPasswordDefault,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({
      ...userResponse,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('DEBUG: Error during loginUser process:', error); // Log the full error
    // console.error(error.message); // This was already here
    res.status(500).send('Server error');
  }
};

// @desc    Update user password
// @route   PUT /api/auth/update-password  (Note: Changed to PUT as it's more appropriate for updates)
// @access  Private (will require auth middleware)
const updatePassword = async (req, res) => {
  // Assuming req.user.id is populated by auth middleware
  // For now, if testing without middleware, you might need to manually set req.user
  if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no token or user context' });
  }
  const userId = req.user.id; // Or req.user._id depending on how middleware sets it

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Please provide old and new passwords' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters long' });
  }


  try {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if old password matches
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid old password' });
    }

    // Set new password (it will be hashed by pre-save middleware)
    user.password = newPassword;
    user.isPasswordDefault = false; // User has actively changed their password
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  registerUser,
  loginUser,
  updatePassword,
  generateToken, // Exporting for potential use elsewhere, e.g. admin creating user
};
