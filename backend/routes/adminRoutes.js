const express = require('express');
const router = express.Router();

const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  createSemester,
  getSemesters,
  getSemestersByDepartment,
  getSemesterById,
  updateSemester,
  deleteSemester,
  // Subject CRUD
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  // Study Material CRUD by Admin
  uploadStudyMaterialByAdmin,
  getAllStudyMaterialsAdmin,
  updateStudyMaterialByAdmin,
  deleteStudyMaterialByAdmin,
  viewStudentMarksAdmin,
  sendBulkNotificationAdmin,
  // Mentoring System by Admin
  assignMentorToStudent,
  bulkAssignMenteesToMentor,
  getAllUsers, // Added getAllUsers
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Department Routes
router
  .route('/departments')
  .post(protect, authorize('Admin'), createDepartment)
  .get(protect, authorize('Admin'), getDepartments);

router
  .route('/departments/:id')
  .get(protect, authorize('Admin'), getDepartmentById)
  .put(protect, authorize('Admin'), updateDepartment)
  .delete(protect, authorize('Admin'), deleteDepartment);

// Semester Routes
router
  .route('/semesters')
  .post(protect, authorize('Admin'), createSemester)
  .get(protect, authorize('Admin'), getSemesters);

router
  .route('/semesters/department/:deptId')
  .get(protect, authorize('Admin'), getSemestersByDepartment);

router
  .route('/semesters/:id')
  .get(protect, authorize('Admin'), getSemesterById)
  .put(protect, authorize('Admin'), updateSemester)
  .delete(protect, authorize('Admin'), deleteSemester);

// Subject Routes
router
  .route('/subjects')
  .post(protect, authorize('Admin'), createSubject)
  .get(protect, authorize('Admin'), getSubjects);

router
  .route('/subjects/:id')
  .get(protect, authorize('Admin'), getSubjectById)
  .put(protect, authorize('Admin'), updateSubject)
  .delete(protect, authorize('Admin'), deleteSubject);

// Study Material Routes (Admin)
router
  .route('/studymaterials')
  .post(protect, authorize('Admin'), uploadStudyMaterialByAdmin)
  .get(protect, authorize('Admin'), getAllStudyMaterialsAdmin);

router
  .route('/studymaterials/:materialId')
  .put(protect, authorize('Admin'), updateStudyMaterialByAdmin)
  .delete(protect, authorize('Admin'), deleteStudyMaterialByAdmin);

// Marks View Route (Admin)
router
  .route('/marks')
  .get(protect, authorize('Admin'), viewStudentMarksAdmin);

// Manual Bulk Notification by Admin
router
  .route('/notifications/bulk-send')
  .post(protect, authorize('Admin'), sendBulkNotificationAdmin);

// Mentoring System Routes (Admin)
router
  .route('/mentoring/assign-mentor')
  .post(protect, authorize('Admin'), assignMentorToStudent);

router
  .route('/mentoring/bulk-assign-mentees')
  .post(protect, authorize('Admin'), bulkAssignMenteesToMentor);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', protect, authorize('Admin'), getAllUsers);

module.exports = router;
