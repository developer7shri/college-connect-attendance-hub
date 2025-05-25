const mongoose = require('mongoose');

const AttendanceRecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    date: {
      type: Date, // Stores full ISODate, normalized to UTC at midnight
      required: true,
    },
    isPresent: {
      type: Boolean,
      default: false,
    },
    markedBy: {
      type: String,
      enum: ['QR', 'ManualTeacher'],
      required: true,
    },
    scannedAt: {
      // Only relevant if markedBy is 'QR'
      type: Date,
    },
    teacher: {
      // Teacher who initiated the QR session or marked manually
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Compound unique index to prevent duplicate records for the same student, subject, and date
AttendanceRecordSchema.index({ student: 1, subject: 1, date: 1 }, { unique: true });

// Normalize date to UTC midnight before saving to ensure date comparisons are consistent
AttendanceRecordSchema.pre('save', function(next) {
  if (this.date && (this.isNew || this.isModified('date'))) {
    const date = new Date(this.date);
    this.date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  }
  next();
});

// Normalize date for findOneAndUpdate operations as well
AttendanceRecordSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    if (update.$set && update.$set.date) {
        const date = new Date(update.$set.date);
        update.$set.date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    } else if (update.date) { // In case date is updated directly in the top level of update
        const date = new Date(update.date);
        update.date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    }
    // For upsert, if date is in query part, it should also be normalized
    const query = this.getQuery();
    if (query.date) {
        const date = new Date(query.date);
        query.date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    }

  next();
});


module.exports = mongoose.model('AttendanceRecord', AttendanceRecordSchema);
