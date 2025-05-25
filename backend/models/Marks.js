const mongoose = require('mongoose');

const MarksSchema = new mongoose.Schema(
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
    semester: {
      // This should ideally be derived from the subject, but storing for context/query ease
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Semester',
      required: true,
    },
    theoryInternal: {
      ci1: { type: Number, default: 0, min: 0, max: 25 },
      ci2: { type: Number, default: 0, min: 0, max: 25 },
    },
    otherInternal: {
      assignments: { type: Number, default: 0, min: 0, max: 10 },
      labInternals: { type: Number, default: 0, min: 0, max: 10 }, // Assuming max 10 for lab, adjust if different
    },
    totalInternal: {
      type: Number,
      default: 0,
      min: 0,
      max: 50, // Max sum of ci1, ci2, assignments, labInternals (25+25+0+0 or custom logic if lab part of 50)
               // For now, assuming a general structure where theory is 25+25=50. If lab/assignments part of this 50,
               // then individual maxes might need to be adjusted or total calculation logic be more complex.
               // The subtask implies total internal is 50, so individual components should sum to it.
               // Given current component maxes (25+25+10+10 = 70), the `totalInternal` max of 50 implies selection or scaling.
               // For simplicity, we'll assume the sum of `theoryInternal` (max 50) + `otherInternal` (max 20) is NOT what makes `totalInternal`.
               // Let's assume `totalInternal` max 50 is for the sum of CI1 (20), CI2 (20), and one other component (10) like assignment.
               // Or, more directly, CI1+CI2+Assignments+Lab = 50. Maxes: ci1(25),ci2(25) => 50. This is simpler.
               // Let's assume: totalInternal is CI1 + CI2. And otherInternal are separate.
               // Then totalInternal max is 50.
               // If the prompt meant: ci1 (15) + ci2 (15) + assignment (10) + quiz (10) = 50. This is also possible.
               // Re-interpreting prompt: theoryInternal (ci1:25, ci2:25) means these are the *components* of internals.
               // `totalInternal` is sum of ci1, ci2, assignments, lab. Max 50.
               // This means the *input* maxes for ci1,ci2,assignments,lab must be such that their sum for `totalInternal` is capped at 50.
               // E.g. ci1 (20), ci2 (20), assignment (5), lab (5).
               // For now, I will set maxes as per prompt and calculation will sum them up.
               // The pre-save hook will cap totalInternal at 50.
    },
    externalMarks: {
      type: Number,
      default: 0,
      min: 0,
      max: 50, // Assuming 50 for externals, adjust if 100 or other. Prompt implies total 100.
    },
    totalMarks: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    enteredBy: {
      // Teacher or Admin who entered/last updated the marks
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index for student and subject
MarksSchema.index({ student: 1, subject: 1 }, { unique: true });

// Pre-save hook to calculate totals and validate maxes
MarksSchema.pre('save', function (next) {
  // Calculate theoryInternal components sum
  const theorySum = (this.theoryInternal.ci1 || 0) + (this.theoryInternal.ci2 || 0);

  // Calculate otherInternal components sum
  const otherSum = (this.otherInternal.assignments || 0) + (this.otherInternal.labInternals || 0);

  // Calculate totalInternal: For now, let's assume it's a sum of all internal components
  // and then capped at 50 if it exceeds. Or it could be that the *components* are scaled.
  // The prompt's component maxes (25,25,10,10) sum to 70. TotalInternal max is 50.
  // This implies either specific components are chosen or scaled.
  // Let's assume for now totalInternal is sum of all 4, capped at 50.
  let calculatedInternal = theorySum + otherSum;
  
  // Cap individual internal components first based on their schema max
  this.theoryInternal.ci1 = Math.min(this.theoryInternal.ci1 || 0, 25);
  this.theoryInternal.ci2 = Math.min(this.theoryInternal.ci2 || 0, 25);
  this.otherInternal.assignments = Math.min(this.otherInternal.assignments || 0, 10);
  this.otherInternal.labInternals = Math.min(this.otherInternal.labInternals || 0, 10);

  // Recalculate sums after capping individual components
  const cappedTheorySum = this.theoryInternal.ci1 + this.theoryInternal.ci2;
  const cappedOtherSum = this.otherInternal.assignments + this.otherInternal.labInternals;
  calculatedInternal = cappedTheorySum + cappedOtherSum;

  this.totalInternal = Math.min(calculatedInternal, 50);

  // Cap externalMarks
  this.externalMarks = Math.min(this.externalMarks || 0, 50);

  // Calculate totalMarks
  this.totalMarks = this.totalInternal + this.externalMarks;
  this.totalMarks = Math.min(this.totalMarks, 100); // Ensure total doesn't exceed 100

  // Basic Grade Calculation (example, can be more complex)
  if (this.isModified('totalMarks') || this.isNew) {
    if (this.totalMarks >= 90) this.grade = 'S';
    else if (this.totalMarks >= 80) this.grade = 'A';
    else if (this.totalMarks >= 70) this.grade = 'B';
    else if (this.totalMarks >= 60) this.grade = 'C';
    else if (this.totalMarks >= 50) this.grade = 'D';
    else if (this.totalMarks >= 40) this.grade = 'E'; // Assuming 40 is pass
    else this.grade = 'F';

    if (this.totalInternal < 20 || this.externalMarks < 20) { // Example: Min 40% in internals and externals to pass
        // This specific rule might vary. For instance, some colleges require min 50% of totalInternal (e.g. 25/50)
        // For now, a simple rule: if total < 40, it's F. But internal/external minimums are common.
        // Let's assume a pass is 40 overall, and grade F handles this.
        // More complex rules like "must pass internal and external separately" aren't implemented here yet.
    }
  }

  next();
});

module.exports = mongoose.model('Marks', MarksSchema);
