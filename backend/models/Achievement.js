const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title for the achievement'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dateOfAchievement: {
      type: Date,
      required: [true, 'Please provide the date of achievement'],
    },
    issuingOrganization: {
      type: String,
      trim: true,
    },
    certificateUrl: {
      type: String,
      required: [true, 'Please provide a certificate URL'],
      trim: true,
      // Basic URL validation
      match: [
        /^(ftp|http|https):\/\/[^ "]+$/,
        'Please provide a valid URL for the certificate',
      ],
    },
    type: {
      type: String,
      enum: [
        'Academic',
        'CoCurricular',
        'ExtraCurricular',
        'Certification',
        'Sports',
        'Arts',
        'Other',
      ],
      default: 'Other',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      // Could be a Teacher (Mentor) or HOD or Admin
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    verificationRemarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model('Achievement', AchievementSchema);
