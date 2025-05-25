const mongoose = require('mongoose');

const StudyMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for the study material'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'Please provide a file URL'],
      // Consider adding URL validation if needed
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      index: true,
      default: null, // Explicitly set default to null
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Semester',
      index: true,
      default: null, // Explicitly set default to null
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      index: true,
      default: null, // Explicitly set default to null
    },
    visibility: {
      type: String,
      enum: [
        'PublicToAll',
        'PublicToDepartment',
        'PublicToSemester',
        'PublicToSubjectStudents',
        'PrivateToSelf',
      ],
      default: 'PrivateToSelf',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save validation for visibility settings
StudyMaterialSchema.pre('save', function (next) {
  if (this.isModified('visibility') || this.isNew) {
    switch (this.visibility) {
      case 'PublicToDepartment':
        if (!this.department) {
          return next(new Error('Department is required for "PublicToDepartment" visibility.'));
        }
        break;
      case 'PublicToSemester':
        if (!this.semester || !this.department) { // A semester implies a department
          return next(new Error('Semester and Department are required for "PublicToSemester" visibility.'));
        }
        break;
      case 'PublicToSubjectStudents':
        if (!this.subject || !this.semester || !this.department) { // A subject implies semester and department
          return next(new Error('Subject, Semester, and Department are required for "PublicToSubjectStudents" visibility.'));
        }
        break;
    }
  }

  // Ensure that if a subject is set, department and semester are also set (from the subject's details)
  // This is more of a controller-level logic when creating/updating, but a final check here can be useful.
  // For now, this validation is primarily handled in the controller logic during creation.
  
  next();
});

module.exports = mongoose.model('StudyMaterial', StudyMaterialSchema);
