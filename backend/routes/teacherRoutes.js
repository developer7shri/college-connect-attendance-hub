const express = require('express');
const router = express.Router();

const {
  getMyAssignedSubjects,
  getStudentsInSubject,
  getLeaveRequestsForApproval, // New
  actOnLeaveRequestByTeacher,
  // Study Material by Teacher
  uploadStudyMaterialByTeacher,
  getRelevantStudyMaterialsTeacher,
  // Marks Management by Teacher
  enterOrUpdateStudentMarksForSubject,
  getStudentMarksForSubject,
  // QR Code and Attendance Management by Teacher
  generateAttendanceQRToken,
  markAttendanceManually,
  getAttendanceForSubject,
  sendClassNotificationTeacher,
  // Mentoring System by Teacher
  getMyAssignedMentees,
  createMentoringSession,
  updateMentoringSession,
  viewMentoringSessionsForMentee,
} = require('../controllers/teacherController');

const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/teacher/subjects
// @desc    Get subjects assigned to the logged-in teacher
// @access  Private (Teacher, Admin)
router
  .route('/subjects')
  .get(protect, authorize('Teacher', 'Admin'), getMyAssignedSubjects);

// @route   GET /api/teacher/subjects/:subjectId/students
// @desc    Get students enrolled in a specific subject taught by the logged-in teacher
// @access  Private (Teacher, Admin)
router
  .route('/subjects/:subjectId/students')
  .get(protect, authorize('Teacher', 'Admin'), getStudentsInSubject);

// @route   GET /api/teacher/leave-requests
// @desc    Get leave requests pending teacher approval
// @access  Private (Teacher, Admin)
router
  .route('/leave-requests')
  .get(protect, authorize('Teacher', 'Admin'), getLeaveRequestsForApproval);

// @route   PUT /api/teacher/leave-requests/:leaveRequestId/action
// @desc    Teacher acts on a leave request
// @access  Private (Teacher, Admin)
router
  .route('/leave-requests/:leaveRequestId/action')
  .put(protect, authorize('Teacher', 'Admin'), actOnLeaveRequestByTeacher);

// Study Material Routes (Teacher)
router
  .route('/studymaterials')
  .post(protect, authorize('Teacher', 'Admin'), uploadStudyMaterialByTeacher)
  .get(protect, authorize('Teacher', 'Admin'), getRelevantStudyMaterialsTeacher);

// Marks Management Routes (Teacher)
router
  .route('/subjects/:subjectId/students/:studentId/marks')
  .post(protect, authorize('Teacher', 'Admin'), enterOrUpdateStudentMarksForSubject);

router
  .route('/subjects/:subjectId/marks')
  .get(protect, authorize('Teacher', 'Admin'), getStudentMarksForSubject);

// QR Code and Attendance Management Routes (Teacher)
router
  .route('/subjects/:subjectId/attendance/generate-qr')
  .post(protect, authorize('Teacher', 'Admin'), generateAttendanceQRToken);

router
  .route('/subjects/:subjectId/attendance/manual')
  .post(protect, authorize('Teacher', 'Admin'), markAttendanceManually);

router
  .route('/subjects/:subjectId/attendance')
  .get(protect, authorize('Teacher', 'Admin'), getAttendanceForSubject);

// Manual Bulk Notification by Teacher
router
  .route('/notifications/bulk-send')
  .post(protect, authorize('Teacher', 'Admin'), sendClassNotificationTeacher);

// Mentoring System Routes (Teacher)
router
  .route('/mentees')
  .get(protect, authorize('Teacher', 'Admin'), getMyAssignedMentees);

router
  .route('/mentoring-sessions')
  .post(protect, authorize('Teacher', 'Admin'), createMentoringSession);

router
  .route('/mentoring-sessions/:sessionId')
  .put(protect, authorize('Teacher', 'Admin'), updateMentoringSession);

router
  .route('/mentees/:menteeId/sessions')
  .get(protect, authorize('Teacher', 'Admin'), viewMentoringSessionsForMentee);

module.exports = router;
