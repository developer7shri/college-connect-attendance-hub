const mongoose = require('mongoose');

const MentoringSessionSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Refers to a Teacher user
      required: true,
      index: true,
    },
    mentee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Refers to a Student user
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    notesByMentor: {
      type: String,
      required: [true, 'Mentor notes are required for the session.'],
      trim: true,
    },
    feedbackByMentee: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Ensure a mentee cannot have two sessions on the same date with the same mentor (optional, good for data integrity)
// MentoringSessionSchema.index({ mentor: 1, mentee: 1, date: 1 }, { unique: true }); 
// Decided against this unique index as a mentor might have a quick follow-up or a rescheduled short session on the same day.
// Or if date includes time, then it's naturally unique. If only date part, then it might be too restrictive.
// For now, allowing multiple sessions on the same date if needed, can be added if business logic requires.

module.exports = mongoose.model('MentoringSession', MentoringSessionSchema);
