const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); // Import path module
const User = require('../models/User'); // Adjust path if your User model is elsewhere

// Load environment variables from .env file in the backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const adminEmail = 'shiva@gmail.com';
const adminPassword = 'shiva@11@';

const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not found in environment variables. Ensure backend/.env is configured.');
    }
    if (!process.env.JWT_SECRET) {
      // While not directly used for seeding, it's crucial for app function, so good to check.
      console.warn('JWT_SECRET not found in environment variables. Ensure backend/.env is configured for the app to work correctly.');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // Not needed for Mongoose 6+
    });
    console.log('MongoDB Connected for seeding...');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists.`);
      // Optionally, update the existing admin's password if needed:
      // existingAdmin.password = adminPassword;
      // await existingAdmin.save();
      // console.log(`Admin user ${adminEmail}'s password has been updated.`);
    } else {
      // Create new admin user
      const admin = new User({
        email: adminEmail,
        password: adminPassword,
        role: 'Admin', // Assuming 'Admin' is the correct role string
        firstName: 'Shiva', // Default first name, can be changed later
        lastName: 'Admin',  // Default last name, can be changed later
        isPasswordDefault: false, // Or true if admin should change it on first login
        // Add any other required fields for the User model
        // e.g., phoneNumber: '0000000000' if it's required and not nullable
      });

      await admin.save();
      console.log(`Admin user ${adminEmail} created successfully.`);
    }
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    if (error.name === 'ValidationError') {
        console.error('Validation Details:', error.errors);
    }
  } finally {
    // Ensure that the connection is closed
    try {
        await mongoose.disconnect();
        console.log('MongoDB Disconnected.');
    } catch (disconnectError) {
        console.error('Error disconnecting MongoDB:', disconnectError.message);
    }
  }
};

seedAdmin();
