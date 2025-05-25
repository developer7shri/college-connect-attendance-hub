const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false, // Do not return password by default
    },
    role: {
      type: String,
      required: true,
      enum: ['Admin', 'HOD', 'Teacher', 'Student'],
    },
    firstName: {
      type: String,
      required: [true, 'Please add a first name'],
    },
    lastName: {
      type: String,
      required: [true, 'Please add a last name'],
    },
    phoneNumber: {
      type: String,
      // Add validation if needed, e.g., match: [/^\d{10}$/, 'Please add a valid 10 digit phone number']
    },
    department: {
      type: String, // Later: mongoose.Schema.Types.ObjectId, ref: 'Department'
    },
    semester: {
      type: String, // Or Number, depending on requirements
    },
    usn: {
      // University Seat Number
      type: String,
      unique: true,
      sparse: true, // Allows multiple documents to have no 'usn' field (e.g. for non-students)
    },
    isPasswordDefault: {
      type: Boolean,
      default: true,
    },
    // === Mentoring System Fields ===
    // For Students:
    assignedMentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Refers to a Teacher user
      default: null,
      index: true, // Index for faster queries if students search by mentor
    },
    // For Teachers:
    mentees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to Student users
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Initialize mentees as an empty array for new Teacher users
UserSchema.pre('save', async function (next) {
  if (this.isNew && this.role === 'Teacher' && !this.mentees) {
    this.mentees = [];
  }
  // Password hashing logic (ensure it's here or call next if not modified)
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
