const express = require('express');
const router = express.Router();

const {
  assignTeacherToSubject,
  removeTeacherFromSubject,
  getSubjectsInMyDepartment,
  getLeaveRequestsForHODApproval,
  actOnLeaveRequestByHOD,
  // Study Material by HOD
  uploadStudyMaterialByHOD,
  getDepartmentStudyMaterialsHOD,
  viewMarksForSubjectInDepartment,
  sendDepartmentNotificationHOD,
  // Mentoring System by HOD
  assignMentorInDepartment,
  bulkAssignMenteesToMentorInDepartment,
  viewStudentAchievementsInDepartment, // New
} = require('../controllers/hodController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Route to get subjects within the HOD's own department
router
  .route('/subjects')
  .get(protect, authorize('HOD', 'Admin'), getSubjectsInMyDepartment);

// Route to assign a teacher to a specific subject
router
  .route('/subjects/:subjectId/assign-teacher')
  .put(protect, authorize('HOD', 'Admin'), assignTeacherToSubject);

// Route to remove an assigned teacher from a specific subject
router
  .route('/subjects/:subjectId/remove-teacher')
  .put(protect, authorize('HOD', 'Admin'), removeTeacherFromSubject);

// @route   GET /api/hod/leave-requests
// @desc    Get leave requests pending HOD approval for the HOD's department
// @access  Private (HOD, Admin)
router
  .route('/leave-requests')
  .get(protect, authorize('HOD', 'Admin'), getLeaveRequestsForHODApproval);

// @route   PUT /api/hod/leave-requests/:leaveRequestId/action
// @desc    HOD acts on a leave request
// @access  Private (HOD, Admin)
router
  .route('/leave-requests/:leaveRequestId/action')
  .put(protect, authorize('HOD', 'Admin'), actOnLeaveRequestByHOD);

// Study Material Routes (HOD)
router
  .route('/studymaterials')
  .post(protect, authorize('HOD', 'Admin'), uploadStudyMaterialByHOD)
  .get(protect, authorize('HOD', 'Admin'), getDepartmentStudyMaterialsHOD);

// Marks View Route (HOD)
router
  .route('/subjects/:subjectId/marks')
  .get(protect, authorize('HOD', 'Admin'), viewMarksForSubjectInDepartment);

// Manual Bulk Notification by HOD
router
  .route('/notifications/bulk-send')
  .post(protect, authorize('HOD', 'Admin'), sendDepartmentNotificationHOD);

// Mentoring System Routes (HOD)
router
  .route('/mentoring/assign-mentor')
  .post(protect, authorize('HOD', 'Admin'), assignMentorInDepartment);

router
  .route('/mentoring/bulk-assign-mentees')
  .post(protect, authorize('HOD', 'Admin'), bulkAssignMenteesToMentorInDepartment);

// Achievement Viewing Routes (HOD)
router
  .route('/achievements/student/:studentId')
  .get(protect, authorize('HOD', 'Admin'), viewStudentAchievementsInDepartment);

router
  .route('/achievements/department') // For department-wide view, studentId is not in path
  .get(protect, authorize('HOD', 'Admin'), viewStudentAchievementsInDepartment);


module.exports = router;
