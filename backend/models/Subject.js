const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a subject name'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Please add a subject code'],
      trim: true,
      uppercase: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Please specify the department for this subject'],
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Semester',
      required: [true, 'Please specify the semester for this subject'],
    },
    assignedTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming 'User' model is used for teachers
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index for subject code within a specific department
SubjectSchema.index({ code: 1, department: 1 }, { unique: true });

// Optional: Pre-save hook to validate department and semester existence
// SubjectSchema.pre('save', async function(next) {
//   if (this.isNew || this.isModified('department') || this.isModified('semester')) {
//     const Department = mongoose.model('Department');
//     const Semester = mongoose.model('Semester');

//     const departmentExists = await Department.findById(this.department);
//     if (!departmentExists) {
//       return next(new Error(`Department with ID ${this.department} does not exist.`));
//     }

//     const semesterExists = await Semester.findById(this.semester);
//     if (!semesterExists) {
//       return next(new Error(`Semester with ID ${this.semester} does not exist.`));
//     }
//     // Optional: Check if the semester belongs to the department
//     if (semesterExists.department.toString() !== this.department.toString()) {
//        return next(new Error(`Semester ${semesterExists.semesterNumber} does not belong to department ${departmentExists.name}.`));
//     }
//   }
//   next();
// });

module.exports = mongoose.model('Subject', SubjectSchema);
