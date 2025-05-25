const mongoose = require('mongoose');

const SemesterSchema = new mongoose.Schema(
  {
    semesterNumber: {
      type: Number,
      required: [true, 'Please add a semester number (e.g., 1, 2, ... 8)'],
      min: 1,
      max: 10, // Assuming a max of 10, adjust if necessary for specific academic structures
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Please specify the department for this semester'],
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound unique index for semesterNumber and department
SemesterSchema.index({ semesterNumber: 1, department: 1 }, { unique: true });

// Pre-validation or pre-save hook to check if department exists (optional, can also be handled in controller)
// SemesterSchema.pre('save', async function(next) {
//   if (this.isNew || this.isModified('department')) {
//     const departmentExists = await mongoose.model('Department').findById(this.department);
//     if (!departmentExists) {
//       return next(new Error(`Department with ID ${this.department} does not exist.`));
//     }
//   }
//   next();
// });

module.exports = mongoose.model('Semester', SemesterSchema);
