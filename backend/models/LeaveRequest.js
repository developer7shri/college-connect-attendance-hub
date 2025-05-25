const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: [true, 'Please provide a reason for your leave'],
    },
    fromDate: {
      type: Date,
      required: [true, 'Please provide a start date for your leave'],
    },
    toDate: {
      type: Date,
      required: [true, 'Please provide an end date for your leave'],
    },
    supportingDocs: {
      type: [String], // Array of URLs/paths to documents
      default: [],
    },
    status: {
      type: String,
      enum: [
        'PendingTeacher',
        'PendingHOD',
        'Approved',
        'RejectedByTeacher',
        'RejectedByHOD',
        'Withdrawn',
      ],
      default: 'PendingTeacher',
      index: true,
    },
    teacherAction: {
      actionBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Teacher who acts
      },
      actionDate: {
        type: Date,
      },
      remarks: {
        type: String,
      },
      status: { // Teacher's specific action
        type: String,
        enum: ['Approved', 'Rejected'],
      }
    },
    hodAction: {
      actionBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // HOD who acts
      },
      actionDate: {
        type: Date,
      },
      remarks: {
        type: String,
      },
      // HOD's final action implicitly changes the main status to 'Approved' or 'RejectedByHOD'
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to validate dates
LeaveRequestSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('fromDate') || this.isModified('toDate')) {
    if (this.fromDate && this.toDate && this.toDate < this.fromDate) {
      return next(new Error('To Date cannot be before From Date.'));
    }
  }
  next();
});

// Instance method to check if leave request can be withdrawn
LeaveRequestSchema.methods.canBeWithdrawn = function () {
  return ['PendingTeacher', 'PendingHOD'].includes(this.status);
};

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
