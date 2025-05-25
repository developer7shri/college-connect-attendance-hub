// Required Models and Utilities
const Department = require('../models/Department');
const Semester = require('../models/Semester');
const Subject = require('../models/Subject');
const User = require('../models/User');
const StudyMaterial = require('../models/StudyMaterial');
const Marks = require('../models/Marks');
const Notification = require('../models/Notification'); // Import Notification
const { createBulkNotifications } = require('../utils/notificationUtils'); // Import notification util
const mongoose = require('mongoose');

// --- Department CRUD ---
const createDepartment = async (req, res) => {
  const { name, code } = req.body;
  if (!name || !code) return res.status(400).json({ message: 'Name and code required.'});
  try {
    if (await Department.findOne({ name })) return res.status(400).json({ message: `Dept name '${name}' exists.`});
    if (await Department.findOne({ code })) return res.status(400).json({ message: `Dept code '${code}' exists.`});
    const department = new Department({ name, code });
    await department.save();
    res.status(201).json(department);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Dept name or code exists.', error: error.keyValue });
    res.status(500).json({ message: 'Server error creating dept', error: error.message });
  }
};
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({});
    res.status(200).json(departments);
  } catch (error) { res.status(500).json({ message: 'Server error fetching depts', error: error.message }); }
};
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Dept not found' });
    res.status(200).json(department);
  } catch (error) {
    if (error.kind === 'ObjectId') return res.status(400).json({ message: 'Invalid dept ID' });
    res.status(500).json({ message: 'Server error fetching dept', error: error.message });
  }
};
const updateDepartment = async (req, res) => {
  const { name, code } = req.body;
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Dept not found' });
    if (name) department.name = name;
    if (code) department.code = code.toUpperCase();
    // Add uniqueness checks similar to create if name/code is changed
    const updatedDepartment = await department.save();
    res.status(200).json(updatedDepartment);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Update failed: Dept name/code conflict.', error: error.keyValue });
    res.status(500).json({ message: 'Server error updating dept', error: error.message });
  }
};
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: 'Dept not found' });
    if (await Semester.countDocuments({ department: req.params.id }) > 0) return res.status(400).json({ message: 'Cannot delete: Semesters associated.'});
    // Add similar check for Users if User.department stores ObjectId
    // if (await User.countDocuments({ department: req.params.id }) > 0) return res.status(400).json({ message: 'Cannot delete: Users associated.' });
    await department.deleteOne();
    res.status(200).json({ message: 'Dept deleted' });
  } catch (error) { res.status(500).json({ message: 'Server error deleting dept', error: error.message });}
};

// --- Semester CRUD ---
const createSemester = async (req, res) => {
  const { semesterNumber, department: departmentId } = req.body;
  if (!semesterNumber || !departmentId) return res.status(400).json({ message: 'Semester number and department ID required.'});
  try {
    const department = await Department.findById(departmentId);
    if (!department) return res.status(404).json({ message: 'Dept not found for semester.' });
    if (await Semester.findOne({ semesterNumber, department: departmentId })) return res.status(400).json({ message: `Semester ${semesterNumber} exists for dept ${department.name}`});
    const semester = new Semester({ semesterNumber, department: departmentId });
    await semester.save();
    const populatedSemester = await Semester.findById(semester._id).populate('department', 'name code');
    res.status(201).json(populatedSemester);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Semester exists for dept.', error: error.keyValue });
    res.status(500).json({ message: 'Server error creating semester', error: error.message });
  }
};
const getSemesters = async (req, res) => {
  try { res.status(200).json(await Semester.find({}).populate('department', 'name code')); }
  catch (error) { res.status(500).json({ message: 'Server error fetching semesters', error: error.message });}
};
const getSemestersByDepartment = async (req, res) => {
  try {
    if (!await Department.findById(req.params.deptId)) return res.status(404).json({ message: 'Dept not found' });
    res.status(200).json(await Semester.find({ department: req.params.deptId }).populate('department', 'name code'));
  } catch (error) { res.status(500).json({ message: 'Server error fetching dept semesters', error: error.message });}
};
const getSemesterById = async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.id).populate('department', 'name code');
    if (!semester) return res.status(404).json({ message: 'Semester not found' });
    res.status(200).json(semester);
  } catch (error) { res.status(500).json({ message: 'Server error fetching semester', error: error.message });}
};
const updateSemester = async (req, res) => {
  const { semesterNumber, department: departmentId } = req.body;
  try {
    const semester = await Semester.findById(req.params.id);
    if (!semester) return res.status(404).json({ message: 'Semester not found' });
    let updatedSemesterNumber = semester.semesterNumber, updatedDepartmentId = semester.department;
    if (semesterNumber) updatedSemesterNumber = semesterNumber;
    if (departmentId) {
      if (!await Department.findById(departmentId)) return res.status(404).json({ message: 'Dept for semester update not found.' });
      updatedDepartmentId = departmentId;
    }
    if ((semesterNumber && semesterNumber !== semester.semesterNumber) || (departmentId && departmentId.toString() !== semester.department.toString())) {
      if (await Semester.findOne({ semesterNumber: updatedSemesterNumber, department: updatedDepartmentId, _id: { $ne: req.params.id } })) {
        const dept = await Department.findById(updatedDepartmentId);
        return res.status(400).json({ message: `Semester ${updatedSemesterNumber} exists for dept ${dept ? dept.name : 'specified'}` });
      }
    }
    semester.semesterNumber = updatedSemesterNumber; semester.department = updatedDepartmentId;
    await semester.save();
    const populatedSemester = await Semester.findById(semester._id).populate('department', 'name code');
    res.status(200).json(populatedSemester);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Update failed: Semester conflict.', error: error.keyValue });
    res.status(500).json({ message: 'Server error updating semester', error: error.message });
  }
};
const deleteSemester = async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.id);
    if (!semester) return res.status(404).json({ message: 'Semester not found' });
    // Add checks for referencing entities like Subjects or Marks
    await semester.deleteOne();
    res.status(200).json({ message: 'Semester deleted' });
  } catch (error) { res.status(500).json({ message: 'Server error deleting semester', error: error.message });}
};

// --- Subject CRUD ---
const createSubject = async (req, res) => {
  const { name, code, department: departmentId, semester: semesterId } = req.body;
  if (!name || !code || !departmentId || !semesterId) return res.status(400).json({ message: 'Name, code, dept ID, and sem ID required.'});
  try {
    const department = await Department.findById(departmentId);
    if (!department) return res.status(404).json({ message: `Dept with ID ${departmentId} not found.` });
    const semester = await Semester.findById(semesterId);
    if (!semester || semester.department.toString() !== departmentId) return res.status(404).json({ message: `Semester with ID ${semesterId} not found or not in dept.` });
    if (await Subject.findOne({ code: code.toUpperCase(), department: departmentId })) return res.status(409).json({ message: `Subject code '${code.toUpperCase()}' exists in dept '${department.name}'.` });
    const subject = new Subject({ name, code: code.toUpperCase(), department: departmentId, semester: semesterId });
    await subject.save();
    const populatedSubject = await Subject.findById(subject._id).populate('department', 'name code').populate('semester', 'semesterNumber');
    res.status(201).json(populatedSubject);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Subject code unique to dept.', error: error.keyValue });
    res.status(500).json({ message: 'Server error creating subject', error: error.message });
  }
};
const getSubjects = async (req, res) => {
  const { departmentId, semesterId } = req.query; const filter = {};
  if (departmentId) { if (!mongoose.Types.ObjectId.isValid(departmentId)) return res.status(400).json({ message: 'Invalid deptId' }); filter.department = departmentId; }
  if (semesterId) { if (!mongoose.Types.ObjectId.isValid(semesterId)) return res.status(400).json({ message: 'Invalid semId' }); filter.semester = semesterId; }
  try {
    const subjects = await Subject.find(filter).populate('department', 'name code').populate('semester', 'semesterNumber').populate('assignedTeacher', 'firstName lastName email');
    res.status(200).json(subjects);
  } catch (error) { res.status(500).json({ message: 'Server error fetching subjects', error: error.message });}
};
const getSubjectById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid subject ID' });
    const subject = await Subject.findById(req.params.id).populate('department', 'name code').populate('semester', 'semesterNumber department').populate('assignedTeacher', 'firstName lastName email');
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.status(200).json(subject);
  } catch (error) { res.status(500).json({ message: 'Server error fetching subject', error: error.message });}
};
const updateSubject = async (req, res) => {
  const { name, code, department: departmentId, semester: semesterId, assignedTeacher } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid subject ID' });
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    let newDepartmentId = subject.department, newSemesterId = subject.semester, newCode = subject.code;
    if (departmentId) { if (!mongoose.Types.ObjectId.isValid(departmentId) || !await Department.findById(departmentId)) return res.status(400).json({ message: 'Invalid or non-existent dept ID for update' }); newDepartmentId = departmentId; }
    if (semesterId) { if (!mongoose.Types.ObjectId.isValid(semesterId) || !await Semester.findById(semesterId)) return res.status(400).json({ message: 'Invalid or non-existent sem ID for update' }); newSemesterId = semesterId; }
    if (code) newCode = code.toUpperCase();
    // Further validation for semester belonging to department, and subject code uniqueness
    if (name) subject.name = name; subject.code = newCode; subject.department = newDepartmentId; subject.semester = newSemesterId;
    if (assignedTeacher !== undefined) {
        if (assignedTeacher === null) subject.assignedTeacher = null;
        else { if (!mongoose.Types.ObjectId.isValid(assignedTeacher) || !await User.findOne({ _id: assignedTeacher, role: { $in: ['Teacher', 'HOD', 'Admin'] } })) return res.status(400).json({ message: 'Invalid teacher ID or role.'}); subject.assignedTeacher = assignedTeacher; }
    }
    const updatedSubject = await subject.save();
    const populatedSubject = await Subject.findById(updatedSubject._id).populate('department', 'name code').populate('semester', 'semesterNumber').populate('assignedTeacher', 'firstName lastName email');
    res.status(200).json(populatedSubject);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Update failed: Subject code conflict.', error: error.keyValue });
    res.status(500).json({ message: 'Server error updating subject', error: error.message });
  }
};
const deleteSubject = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid subject ID' });
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    // Add checks for referencing entities (Marks, Attendance, etc.)
    await subject.deleteOne();
    res.status(200).json({ message: 'Subject deleted' });
  } catch (error) { res.status(500).json({ message: 'Server error deleting subject', error: error.message });}
};

// --- Study Material CRUD by Admin ---
const uploadStudyMaterialByAdmin = async (req, res) => {
  const { title, description, fileUrl, subject: subjectId, semester: semesterId, department: departmentId, visibility } = req.body;
  if (!title || !fileUrl || !visibility) return res.status(400).json({ message: 'Title, fileUrl, visibility required.'});
  try {
    if (subjectId && !mongoose.Types.ObjectId.isValid(subjectId)) return res.status(400).json({ message: 'Invalid subject ID' });
    if (semesterId && !mongoose.Types.ObjectId.isValid(semesterId)) return res.status(400).json({ message: 'Invalid semester ID' });
    if (departmentId && !mongoose.Types.ObjectId.isValid(departmentId)) return res.status(400).json({ message: 'Invalid department ID' });
    // Visibility validation based on other fields
    const newMaterial = new StudyMaterial({ title, description, fileUrl, uploadedBy: req.user._id, subject: subjectId || null, semester: semesterId || null, department: departmentId || null, visibility });
    await newMaterial.save();
    const populatedMaterial = await StudyMaterial.findById(newMaterial._id).populate('uploadedBy', 'firstName lastName email').populate('subject', 'name code').populate('semester', 'semesterNumber').populate('department', 'name code');
    res.status(201).json(populatedMaterial);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Server error uploading material', error: error.message });
  }
};
const getAllStudyMaterialsAdmin = async (req, res) => {
  try {
    const materials = await StudyMaterial.find({}).populate('uploadedBy', 'firstName lastName email').populate('subject', 'name code').populate('semester', 'semesterNumber').populate('department', 'name code').sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error) { res.status(500).json({ message: 'Server error fetching materials', error: error.message });}
};
const updateStudyMaterialByAdmin = async (req, res) => {
  const { materialId } = req.params; const { title, description, fileUrl, subject, semester, department, visibility } = req.body;
  if (!mongoose.Types.ObjectId.isValid(materialId)) return res.status(400).json({ message: 'Invalid material ID' });
  try {
    const material = await StudyMaterial.findById(materialId);
    if (!material) return res.status(404).json({ message: 'Material not found' });
    // Update fields and re-validate visibility
    if (title !== undefined) material.title = title; if (description !== undefined) material.description = description; if (fileUrl !== undefined) material.fileUrl = fileUrl; if (visibility !== undefined) material.visibility = visibility;
    material.subject = subject !== undefined ? (subject || null) : material.subject; material.semester = semester !== undefined ? (semester || null) : material.semester; material.department = department !== undefined ? (department || null) : material.department;
    await material.save();
    const populatedMaterial = await StudyMaterial.findById(material._id).populate('uploadedBy', 'firstName lastName email').populate('subject', 'name code').populate('semester', 'semesterNumber').populate('department', 'name code');
    res.status(200).json(populatedMaterial);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Server error updating material', error: error.message });
  }
};
const deleteStudyMaterialByAdmin = async (req, res) => {
  const { materialId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(materialId)) return res.status(400).json({ message: 'Invalid material ID' });
  try {
    const material = await StudyMaterial.findById(materialId);
    if (!material) return res.status(404).json({ message: 'Material not found' });
    await material.deleteOne();
    res.status(200).json({ message: 'Material deleted' });
  } catch (error) { res.status(500).json({ message: 'Server error deleting material', error: error.message });}
};

// --- Marks Management by Admin (View-only) ---
const viewStudentMarksAdmin = async (req, res) => {
  const { studentId, subjectId, semesterId, departmentId } = req.query; const query = {};
  if (studentId) { if (!mongoose.Types.ObjectId.isValid(studentId)) return res.status(400).json({ message: 'Invalid student ID' }); query.student = studentId; }
  if (subjectId) { if (!mongoose.Types.ObjectId.isValid(subjectId)) return res.status(400).json({ message: 'Invalid subject ID' }); query.subject = subjectId; }
  if (semesterId) { if (!mongoose.Types.ObjectId.isValid(semesterId)) return res.status(400).json({ message: 'Invalid semester ID' }); query.semester = semesterId; }
  if (departmentId && !subjectId) {
      if (!mongoose.Types.ObjectId.isValid(departmentId)) return res.status(400).json({ message: 'Invalid department ID' });
      const subjectsInDept = await Subject.find({ department: departmentId }).select('_id');
      if (subjectsInDept.length > 0) query.subject = { $in: subjectsInDept.map(s => s._id) };
      else return res.status(200).json({ message: 'No subjects/marks for dept.', marks: [] });
  }
  try {
    const marksList = await Marks.find(query).populate('student', 'firstName lastName usn email').populate('subject', 'name code department', { populate: { path: 'department', select: 'name code' } }).populate('semester', 'semesterNumber department', { populate: { path: 'department', select: 'name code' } }).populate('enteredBy', 'firstName lastName email').sort({ 'student.usn': 1, 'subject.name': 1 });
    if (!marksList.length) return res.status(200).json({ message: 'No marks found for criteria.', marks: [] });
    res.status(200).json(marksList);
  } catch (error) { res.status(500).json({ message: 'Server error fetching marks', error: error.message });}
};

// --- Manual Bulk Notification by Admin ---
const sendBulkNotificationAdmin = async (req, res) => {
  const { title, message, type = 'Announcement', link, target } = req.body;
  if (!title || !message) return res.status(400).json({ message: 'Title and message required.' });
  const query = {};
  if (target) {
    if (target.role && target.role !== 'All') { if (!['Admin', 'HOD', 'Teacher', 'Student'].includes(target.role)) return res.status(400).json({ message: 'Invalid target role.' }); query.role = target.role; }
    if (target.departmentId) { if (!mongoose.Types.ObjectId.isValid(target.departmentId)) return res.status(400).json({ message: 'Invalid departmentId.'}); query.department = target.departmentId; }
    if (target.semesterId) {
      if (!mongoose.Types.ObjectId.isValid(target.semesterId)) return res.status(400).json({ message: 'Invalid semesterId.'}); query.semester = target.semesterId;
      if (target.departmentId && !await Semester.findOne({ _id: target.semesterId, department: target.departmentId })) return res.status(400).json({ message: 'Semester not in specified dept.'});
    }
  }
  try {
    const usersToNotify = await User.find(query).select('_id');
    if (!usersToNotify.length) return res.status(404).json({ message: 'No users found for criteria.' });
    const notificationsData = usersToNotify.map(user => ({ recipientUser: user._id, senderUser: req.user._id, title, message, type, link }));
    const result = await createBulkNotifications(notificationsData);
    if (result.errors && result.errors.length > 0) return res.status(207).json({ message: `Partially sent. Success: ${result.successCount}, Failures: ${result.errors.length}`, details: result.errors });
    res.status(200).json({ message: `Successfully sent notifications to ${result.successCount} users.` });
  } catch (error) { res.status(500).json({ message: 'Server error sending Admin bulk notification.', error: error.message });}
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users 
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error when fetching users');
  }
};

module.exports = {
  createDepartment, getDepartments, getDepartmentById, updateDepartment, deleteDepartment,
  createSemester, getSemesters, getSemestersByDepartment, getSemesterById, updateSemester, deleteSemester,
  createSubject, getSubjects, getSubjectById, updateSubject, deleteSubject,
  uploadStudyMaterialByAdmin, getAllStudyMaterialsAdmin, updateStudyMaterialByAdmin, deleteStudyMaterialByAdmin,
  viewStudentMarksAdmin,
  sendBulkNotificationAdmin,
  getAllUsers, // Added getAllUsers to exports

  // --- Mentoring System Management by Admin ---

  // @desc    Assign a mentor (teacher) to a student
  // @route   POST /api/admin/mentoring/assign-mentor
  // @access  Private (Admin)
  assignMentorToStudent: async (req, res) => {
    const { teacherId, studentId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(teacherId) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'Invalid teacherId or studentId format.' });
    }

    try {
      const teacher = await User.findById(teacherId);
      if (!teacher || teacher.role !== 'Teacher') {
        return res.status(404).json({ message: 'Teacher not found or user is not a Teacher.' });
      }

      const student = await User.findById(studentId);
      if (!student || student.role !== 'Student') {
        return res.status(404).json({ message: 'Student not found or user is not a Student.' });
      }

      // If student already has a mentor, unassign from old mentor
      if (student.assignedMentor && student.assignedMentor.toString() !== teacherId) {
        await User.findByIdAndUpdate(student.assignedMentor, { $pull: { mentees: studentId } });
      } else if (student.assignedMentor && student.assignedMentor.toString() === teacherId) {
        // Already assigned to this teacher, ensure consistency but no major change needed for student.
        // Make sure student is in teacher's list.
        if (!teacher.mentees.includes(studentId)) {
            await User.findByIdAndUpdate(teacherId, { $addToSet: { mentees: studentId } });
        }
        return res.status(200).json({ message: 'Student is already assigned to this mentor. Consistency checked.' });
      }


      // Assign to new mentor
      student.assignedMentor = teacherId;
      await student.save();

      // Add student to new mentor's mentees list (if not already there)
      await User.findByIdAndUpdate(teacherId, { $addToSet: { mentees: studentId } });
      
      // Notifications (Optional Integration)
      try {
        await createNotification({
          recipientUser: studentId,
          senderUser: req.user._id, // Admin
          title: 'Mentor Assigned',
          message: `You have been assigned ${teacher.firstName} ${teacher.lastName} as your mentor.`,
          type: 'MentoringAlert',
          link: `/student/my-mentor` 
        });
        await createNotification({
          recipientUser: teacherId,
          senderUser: req.user._id, // Admin
          title: 'New Mentee Assigned',
          message: `${student.firstName} ${student.lastName} has been assigned to you as a mentee.`,
          type: 'MentoringAlert',
          link: `/teacher/mentees`
        });
      } catch (notificationError) {
        console.error("Failed to send mentor assignment notifications:", notificationError);
      }


      res.status(200).json({ message: 'Mentor assigned successfully.', student });

    } catch (error) {
      console.error('Error assigning mentor:', error);
      res.status(500).json({ message: 'Server error while assigning mentor.', error: error.message });
    }
  },

  // @desc    Bulk assign mentees (students) to a mentor (teacher)
  // @route   POST /api/admin/mentoring/bulk-assign-mentees
  // @access  Private (Admin)
  bulkAssignMenteesToMentor: async (req, res) => {
    const { teacherId, studentIds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(teacherId) || !Array.isArray(studentIds) || studentIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ message: 'Invalid teacherId or studentIds format.' });
    }

    try {
      const teacher = await User.findById(teacherId);
      if (!teacher || teacher.role !== 'Teacher') {
        return res.status(404).json({ message: 'Teacher not found or user is not a Teacher.' });
      }

      const students = await User.find({ _id: { $in: studentIds }, role: 'Student' });
      if (students.length !== studentIds.length) {
        return res.status(404).json({ message: 'One or more students not found or are not valid Students.' });
      }

      const successfullyAssigned = [];
      const alreadyAssignedToThisMentor = [];
      const errors = [];

      for (const student of students) {
        try {
          // If student already has a mentor, unassign from old mentor
          if (student.assignedMentor && student.assignedMentor.toString() !== teacherId) {
            await User.findByIdAndUpdate(student.assignedMentor, { $pull: { mentees: student._id } });
          } else if (student.assignedMentor && student.assignedMentor.toString() === teacherId) {
            if (!teacher.mentees.includes(student._id)) { // ensure consistency
                await User.findByIdAndUpdate(teacherId, { $addToSet: { mentees: student._id } });
            }
            alreadyAssignedToThisMentor.push(student._id);
            continue; // Skip to next student
          }

          student.assignedMentor = teacherId;
          await student.save();
          successfullyAssigned.push(student._id);
        } catch (assignError) {
          errors.push({ studentId: student._id, error: assignError.message });
        }
      }
      
      // Add all successfully assigned (newly or consistency check) students to teacher's list
      const allMenteesForThisTeacher = [...new Set([...successfullyAssigned, ...alreadyAssignedToThisMentor])];
      if (allMenteesForThisTeacher.length > 0) {
          await User.findByIdAndUpdate(teacherId, { $addToSet: { mentees: { $each: allMenteesForThisTeacher } } });
      }

      // Notifications for successfully assigned students and the teacher
      if (successfullyAssigned.length > 0) {
        const studentDetailsForNotif = students.filter(s => successfullyAssigned.includes(s._id));
        studentDetailsForNotif.forEach(student => {
          createNotification({
            recipientUser: student._id, senderUser: req.user._id, title: 'Mentor Assigned',
            message: `You have been assigned ${teacher.firstName} ${teacher.lastName} as your mentor.`,
            type: 'MentoringAlert', link: `/student/my-mentor`
          }).catch(err => console.error("Failed mentor assignment notif (student):", err));
        });

        const studentNames = studentDetailsForNotif.map(s => `${s.firstName} ${s.lastName}`).join(', ');
        createNotification({
          recipientUser: teacherId, senderUser: req.user._id, title: 'New Mentees Assigned',
          message: `The following students have been assigned to you as mentees: ${studentNames}.`,
          type: 'MentoringAlert', link: `/teacher/mentees`
        }).catch(err => console.error("Failed mentor assignment notif (teacher):", err));
      }

      res.status(200).json({ 
        message: 'Bulk assignment process completed.', 
        successfullyAssignedCount: successfullyAssigned.length,
        alreadyAssignedToThisMentorCount: alreadyAssignedToThisMentor.length,
        errorsCount: errors.length,
        errors
      });

    } catch (error) {
      console.error('Error in bulk assigning mentees:', error);
      res.status(500).json({ message: 'Server error during bulk assignment.', error: error.message });
    }
  },
};
