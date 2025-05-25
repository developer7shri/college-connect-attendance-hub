const express = require('express');
const router = express.Router();

// Placeholder for controller functions - will be created in the next step
const {
  applyLeave,
  getMyLeaveRequests,
  withdrawLeaveRequest,
  getAvailableStudyMaterialsStudent,
  viewMyMarks,
  // Attendance Management by Student
  markAttendanceByQR,
  viewMyAttendanceHistory,
  // Mentoring System by Student
  viewMyMentorDetails,
  viewMyMentoringSessionsHistory,
  addOrUpdateMenteeFeedbackOnSession,
  // Achievement Management by Student
  createAchievement,
  getMyAchievements,
  updateMyAchievement,
  deleteMyAchievement,
} = require('../controllers/studentController');

const { protect, authorize } = require('../middleware/authMiddleware');

// @route   POST /api/student/leave/apply
// @desc    Apply for a new leave
// @access  Private (Student)
router
  .route('/leave/apply')
  .post(protect, authorize('Student'), applyLeave);

// @route   GET /api/student/leave/my-requests
// @desc    Get all leave requests for the logged-in student
// @access  Private (Student)
router
  .route('/leave/my-requests')
  .get(protect, authorize('Student'), getMyLeaveRequests);

// @route   PUT /api/student/leave/:leaveRequestId/withdraw
// @desc    Withdraw a leave request
// @access  Private (Student)
router
  .route('/leave/:leaveRequestId/withdraw')
  .put(protect, authorize('Student'), withdrawLeaveRequest);

// @route   GET /api/student/studymaterials
// @desc    Get available study materials for the logged-in student
// @access  Private (Student)
router
  .route('/studymaterials')
  .get(protect, authorize('Student'), getAvailableStudyMaterialsStudent);

// @route   GET /api/student/marks
// @desc    View all marks for the logged-in student, optionally filtered by semester
// @access  Private (Student)
router
  .route('/marks')
  .get(protect, authorize('Student'), viewMyMarks);

// Attendance Management Routes (Student)
router
  .route('/attendance/qr')
  .post(protect, authorize('Student'), markAttendanceByQR);

router
  .route('/attendance/history')
  .get(protect, authorize('Student'), viewMyAttendanceHistory);

// Mentoring System Routes (Student)
router
  .route('/my-mentor')
  .get(protect, authorize('Student'), viewMyMentorDetails);

router
  .route('/mentoring-sessions')
  .get(protect, authorize('Student'), viewMyMentoringSessionsHistory);

router
  .route('/mentoring-sessions/:sessionId/feedback')
  .put(protect, authorize('Student'), addOrUpdateMenteeFeedbackOnSession);

// Achievement Management Routes (Student)
router
  .route('/achievements')
  .post(protect, authorize('Student'), createAchievement)
  .get(protect, authorize('Student'), getMyAchievements);

router
  .route('/achievements/:achievementId')
  .put(protect, authorize('Student'), updateMyAchievement)
  .delete(protect, authorize('Student'), deleteMyAchievement);

module.exports = router;
