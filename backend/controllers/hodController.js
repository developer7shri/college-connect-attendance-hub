// Required Models and Utilities
const User = require('../models/User');
const Subject = require('../models/Subject');
const Semester = require('../models/Semester');
const Department = require('../models/Department');
const LeaveRequest = require('../models/LeaveRequest');
const StudyMaterial = require('../models/StudyMaterial');
const Marks = require('../models/Marks');
const Achievement = require('../models/Achievement'); // New
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const { createNotification, createBulkNotifications } = require('../utils/notificationUtils');

// Helper function to format date for notification messages
const formatDateForMessage = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Existing HOD functions (assignTeacherToSubject, removeTeacherFromSubject, etc. - assumed to be defined correctly)
const assignTeacherToSubject = async (req, res) => {
  const { subjectId } = req.params;
  const { teacherId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(subjectId) || !teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
    return res.status(400).json({ message: 'Invalid subject or teacher ID' });
  }
  try {
    const subject = await Subject.findById(subjectId).populate('department');
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    if (!req.user.department || subject.department._id.toString() !== req.user.department.toString()) {
      return res.status(403).json({ message: "Not authorized for this department's subject" });
    }
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'Teacher') return res.status(404).json({ message: 'Teacher not found or user is not a Teacher' });
    if (!teacher.department || teacher.department.toString() !== req.user.department.toString()) {
      return res.status(400).json({ message: 'Teacher does not belong to this department' });
    }
    subject.assignedTeacher = teacherId;
    await subject.save();
    const populatedSubject = await Subject.findById(subjectId).populate('department', 'name code').populate('semester', 'semesterNumber').populate('assignedTeacher', 'firstName lastName email');
    res.status(200).json({ message: 'Teacher assigned successfully', subject: populatedSubject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error assigning teacher', error: error.message });
  }
};

const removeTeacherFromSubject = async (req, res) => {
  const { subjectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(subjectId)) return res.status(400).json({ message: 'Invalid subject ID' });
  try {
    const subject = await Subject.findById(subjectId).populate('department');
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    if (!req.user.department || subject.department._id.toString() !== req.user.department.toString()) {
      return res.status(403).json({ message: "Not authorized for this department's subject" });
    }
    if (subject.assignedTeacher === null) return res.status(400).json({ message: 'No teacher assigned.' });
    subject.assignedTeacher = null;
    await subject.save();
    const populatedSubject = await Subject.findById(subjectId).populate('department', 'name code').populate('semester', 'semesterNumber').populate('assignedTeacher', 'firstName lastName email');
    res.status(200).json({ message: 'Teacher removed successfully', subject: populatedSubject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error removing teacher', error: error.message });
  }
};

const getSubjectsInMyDepartment = async (req, res) => {
  if (!req.user.department || !mongoose.Types.ObjectId.isValid(req.user.department.toString())) {
    return res.status(400).json({ message: 'User department not found or invalid.' });
  }
  try {
    const hodDepartmentId = req.user.department;
    const subjects = await Subject.find({ department: hodDepartmentId }).populate('semester', 'semesterNumber').populate('assignedTeacher', 'firstName lastName email').populate('department', 'name code');
    res.status(200).json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching HOD subjects', error: error.message });
  }
};

const uploadStudyMaterialByHOD = async (req, res) => {
  const { title, description, fileUrl, subject, semester, visibility } = req.body;
  if (!title || !fileUrl || !visibility) return res.status(400).json({ message: 'Title, fileUrl, and visibility required.' });
  if (!req.user.department || !mongoose.Types.ObjectId.isValid(req.user.department.toString())) {
      return res.status(403).json({ message: 'HOD department invalid.' });
  }
  const hodDepartmentId = req.user.department.toString();
  const allowedVisibilities = ['PublicToDepartment', 'PublicToSemester', 'PublicToSubjectStudents', 'PrivateToSelf'];
  if (!allowedVisibilities.includes(visibility)) return res.status(400).json({ message: `Visibility '${visibility}' not allowed for HOD.`});

  let materialDepartment = hodDepartmentId, materialSemester = semester || null, materialSubject = subject || null;
  try {
    if (subject) {
      if (!mongoose.Types.ObjectId.isValid(subject)) return res.status(400).json({ message: 'Invalid subject ID' });
      const subjData = await Subject.findById(subject);
      if (!subjData || subjData.department.toString() !== hodDepartmentId) return res.status(403).json({ message: 'Subject not found or not in your department.' });
      materialSemester = subjData.semester.toString(); materialDepartment = subjData.department.toString();
    }
    if (semester) {
      if (!mongoose.Types.ObjectId.isValid(semester)) return res.status(400).json({ message: 'Invalid semester ID' });
      const semData = await Semester.findById(semester);
      if (!semData || semData.department.toString() !== hodDepartmentId) return res.status(403).json({ message: 'Semester not found or not in your department.' });
      if (materialSubject && semData._id.toString() !== materialSemester) return res.status(400).json({ message: 'Semester ID does not match subject\'s semester.' });
      materialDepartment = semData.department.toString();
    }
    if (visibility === 'PublicToDepartment' && !materialDepartment) return res.status(400).json({ message: 'Department required for this visibility.' });
    if (visibility === 'PublicToSemester' && (!materialSemester || !materialDepartment)) return res.status(400).json({ message: 'Semester & Department required for this visibility.' });
    if (visibility === 'PublicToSubjectStudents' && (!materialSubject || !materialSemester || !materialDepartment)) return res.status(400).json({ message: 'Subject, Semester & Department required for this visibility.'});

    const newMaterial = new StudyMaterial({
      title, description, fileUrl, uploadedBy: req.user._id,
      subject: materialSubject, semester: materialSemester, department: materialDepartment, visibility,
    });
    await newMaterial.save();
    const populatedMaterial = await StudyMaterial.findById(newMaterial._id).populate('uploadedBy', 'firstName lastName email').populate('subject', 'name code').populate('semester', 'semesterNumber').populate('department', 'name code');
    res.status(201).json(populatedMaterial);
  } catch (error) {
    console.error('HOD upload material error:', error);
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Server error HOD uploading material', error: error.message });
  }
};

const getDepartmentStudyMaterialsHOD = async (req, res) => {
  try {
    if (!req.user.department || !mongoose.Types.ObjectId.isValid(req.user.department.toString())) {
      return res.status(403).json({ message: 'HOD department invalid.' });
    }
    const hodDepartmentId = req.user.department.toString();
    const userId = req.user._id;
    const semestersInDept = await Semester.find({ department: hodDepartmentId }).select('_id');
    const semesterIdsInDept = semestersInDept.map(s => s._id);
    const subjectsInDept = await Subject.find({ department: hodDepartmentId }).select('_id');
    const subjectIdsInDept = subjectsInDept.map(s => s._id);
    const query = {
      $or: [
        { visibility: 'PublicToAll' }, { uploadedBy: userId },
        { department: hodDepartmentId, visibility: 'PublicToDepartment' },
        { department: hodDepartmentId, semester: { $in: semesterIdsInDept }, visibility: 'PublicToSemester'},
        { department: hodDepartmentId, subject: { $in: subjectIdsInDept }, visibility: 'PublicToSubjectStudents'},
      ]
    };
    const materials = await StudyMaterial.find(query).populate('uploadedBy', 'firstName lastName email').populate('subject', 'name code').populate('semester', 'semesterNumber').populate('department', 'name code').sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error) {
    console.error('HOD get materials error:', error);
    res.status(500).json({ message: 'Server error fetching HOD study materials', error: error.message });
  }
};

const getLeaveRequestsForHODApproval = async (req, res) => {
  try {
    if (!req.user.department || !mongoose.Types.ObjectId.isValid(req.user.department.toString())) {
      return res.status(400).json({ message: 'HOD department invalid.' });
    }
    const hodDepartmentId = req.user.department;
    const leaveRequests = await LeaveRequest.find({ department: hodDepartmentId, status: 'PendingHOD' })
    .populate('student', 'firstName lastName email usn department semester')
    .populate({ path: 'student', populate: [{ path: 'department', model: 'Department', select: 'name code' }, { path: 'semester', model: 'Semester', select: 'semesterNumber' }]})
    .populate('subject', 'name code assignedTeacher')
    .populate({ path: 'subject', populate: { path: 'assignedTeacher', select: 'firstName lastName email' }})
    .populate('department', 'name code').populate('teacherAction.actionBy', 'firstName lastName email').sort({ createdAt: 1 });
    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching leave requests for HOD', error: error.message });
  }
};

const actOnLeaveRequestByHOD = async (req, res) => {
  const { leaveRequestId } = req.params;
  const { action, remarks } = req.body;
  if (!mongoose.Types.ObjectId.isValid(leaveRequestId)) return res.status(400).json({ message: 'Invalid leave ID' });
  if (!action || !['approve', 'reject'].includes(action.toLowerCase())) return res.status(400).json({ message: "Action: 'approve' or 'reject'"});
  if (action.toLowerCase() === 'reject' && !remarks) return res.status(400).json({ message: "Remarks required for rejection."});

  try {
    const leaveRequest = await LeaveRequest.findById(leaveRequestId).populate('subject', 'name').populate('student', 'firstName _id').populate('department', '_id');
    if (!leaveRequest) return res.status(404).json({ message: 'Leave request not found' });
    if (req.user.role === 'HOD') {
      if (!req.user.department || !leaveRequest.department || leaveRequest.department._id.toString() !== req.user.department.toString()) {
        return res.status(403).json({ message: 'Not authorized for this department\'s leave request.' });
      }
    }
    if (leaveRequest.status !== 'PendingHOD') return res.status(400).json({ message: `Request status is ${leaveRequest.status}, not PendingHOD.`});

    leaveRequest.hodAction = { actionBy: req.user._id, actionDate: new Date(), remarks: remarks || '' };
    const studentName = leaveRequest.student.firstName;
    const subjectName = leaveRequest.subject.name;
    const fromDateFormatted = formatDateForMessage(leaveRequest.fromDate);
    const toDateFormatted = formatDateForMessage(leaveRequest.toDate);
    let notificationMessage;

    if (action.toLowerCase() === 'approve') {
      leaveRequest.status = 'Approved';
      notificationMessage = `Dear ${studentName}, your leave request for ${subjectName} from ${fromDateFormatted} to ${toDateFormatted} has been approved by the HOD. Remarks: ${remarks || 'N/A'}`;
    } else {
      leaveRequest.status = 'RejectedByHOD';
      notificationMessage = `Dear ${studentName}, your leave request for ${subjectName} from ${fromDateFormatted} to ${toDateFormatted} has been rejected by the HOD. Remarks: ${remarks}`;
    }
    await leaveRequest.save();

    createNotification({
        recipientUser: leaveRequest.student._id, senderUser: req.user._id, title: 'Leave Request Finalized',
        message: notificationMessage, type: 'LeaveStatus', link: `/student/leave/my-requests`,
    }).catch(err => console.error("Failed to notify student (HOD action):", err));

    const populatedLR = await LeaveRequest.findById(leaveRequest._id).populate('student', 'firstName lastName email usn').populate('subject', 'name code').populate('department', 'name code').populate('teacherAction.actionBy', 'firstName lastName email').populate('hodAction.actionBy', 'firstName lastName email');
    res.status(200).json({ message: `Leave request ${action.toLowerCase()}.`, leaveRequest: populatedLR });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Server error HOD acting on leave request', error: error.message });
  }
};

const viewMarksForSubjectInDepartment = async (req, res) => {
  const { subjectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(subjectId)) return res.status(400).json({ message: 'Invalid Subject ID' });
  try {
    const subject = await Subject.findById(subjectId).populate('department');
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    if (req.user.role === 'HOD' && (!req.user.department || subject.department._id.toString() !== req.user.department.toString())) {
      return res.status(403).json({ message: 'Not authorized for this subject (view marks).' });
    }
    const marksList = await Marks.find({ subject: subjectId }).populate('student', 'firstName lastName usn email').populate('subject', 'name code').populate('semester', 'semesterNumber').populate('enteredBy', 'firstName lastName').sort({ 'student.usn': 1 });
    res.status(200).json(marksList);
  } catch (error) {
    console.error('Error fetching marks for subject by HOD:', error);
    res.status(500).json({ message: 'Server error fetching marks', error: error.message });
  }
};

const sendDepartmentNotificationHOD = async (req, res) => {
  const { title, message, type = 'Announcement', link, targetRole, semesterId } = req.body;
  if (!title || !message) return res.status(400).json({ message: 'Title and message required.'});
  if (!req.user.department) return res.status(403).json({ message: 'HOD department not found.'});
  const hodDepartmentId = req.user.department.toString();
  const query = { department: hodDepartmentId };

  if (targetRole && targetRole !== 'All') {
      if (!['Teacher', 'Student'].includes(targetRole)) return res.status(400).json({ message: 'Invalid targetRole.' });
      query.role = targetRole;
      if (targetRole === 'Student' && semesterId) {
          if (!mongoose.Types.ObjectId.isValid(semesterId)) return res.status(400).json({ message: 'Invalid semesterId.'});
          const semester = await Semester.findOne({ _id: semesterId, department: hodDepartmentId });
          if (!semester) return res.status(400).json({ message: 'Semester not found or not in your department.'});
          query.semester = semesterId;
      }
  }
  try {
    const usersToNotify = await User.find(query).select('_id');
    if (!usersToNotify.length) return res.status(404).json({ message: 'No users found for criteria in your department.'});
    const deptForMessage = await Department.findById(hodDepartmentId).select('name');
    const notificationsData = usersToNotify.map(user => ({
      recipientUser: user._id, senderUser: req.user._id, title,
      message: `${message} (Department: ${ deptForMessage?.name || 'Your Department'})`,
      type, link,
    }));
    const result = await createBulkNotifications(notificationsData);
    if (result.errors && result.errors.length > 0) {
      console.error("Partial success HOD bulk notifications:", result.errors);
      return res.status(207).json({ message: `Partially sent. Success: ${result.successCount}, Failures: ${result.errors.length}`, details: result.errors });
    }
    res.status(200).json({ message: `Successfully sent notifications to ${result.successCount} users.` });
  } catch (error) {
    console.error('Error sending HOD bulk notification:', error);
    res.status(500).json({ message: 'Server error sending HOD bulk notification.', error: error.message });
  }
};

const assignMentorInDepartment = async (req, res) => {
  const { teacherId, studentId } = req.body;
  const hodDepartmentId = req.user.department ? req.user.department.toString() : null;
  if (!hodDepartmentId) return res.status(403).json({ message: 'HOD department not found.' });
  if (!mongoose.Types.ObjectId.isValid(teacherId) || !mongoose.Types.ObjectId.isValid(studentId)) return res.status(400).json({ message: 'Invalid teacher/student ID.'});
  try {
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'Teacher' || (teacher.department && teacher.department.toString() !== hodDepartmentId)) return res.status(404).json({ message: 'Teacher not valid or not in your dept.'});
    const student = await User.findById(studentId);
    if (!student || student.role !== 'Student' || (student.department && student.department.toString() !== hodDepartmentId)) return res.status(404).json({ message: 'Student not valid or not in your dept.'});
    if (student.assignedMentor && student.assignedMentor.toString() !== teacherId) await User.findByIdAndUpdate(student.assignedMentor, { $pull: { mentees: studentId } });
    else if (student.assignedMentor && student.assignedMentor.toString() === teacherId) {
       if (!teacher.mentees.includes(studentId)) await User.findByIdAndUpdate(teacherId, { $addToSet: { mentees: studentId } });
      return res.status(200).json({ message: 'Student already assigned this mentor.' });
    }
    student.assignedMentor = teacherId; await student.save();
    await User.findByIdAndUpdate(teacherId, { $addToSet: { mentees: studentId } });
    createNotification({ recipientUser: studentId, senderUser: req.user._id, title: 'Mentor Assigned', message: `HOD ${req.user.firstName} assigned ${teacher.firstName} as your mentor.`, type: 'MentoringAlert', link: `/student/my-mentor`}).catch(err => console.error("Notif error (student):", err));
    createNotification({ recipientUser: teacherId, senderUser: req.user._id, title: 'New Mentee Assigned by HOD', message: `HOD ${req.user.firstName} assigned ${student.firstName} to you.`, type: 'MentoringAlert', link: `/teacher/mentees`}).catch(err => console.error("Notif error (teacher):", err));
    res.status(200).json({ message: 'Mentor assigned in department.', student });
  } catch (error) { res.status(500).json({ message: 'Server error assigning mentor.', error: error.message });}
};

const bulkAssignMenteesToMentorInDepartment = async (req, res) => {
  const { teacherId, studentIds } = req.body;
  const hodDepartmentId = req.user.department ? req.user.department.toString() : null;
  if (!hodDepartmentId) return res.status(403).json({ message: 'HOD department not found.' });
  if (!mongoose.Types.ObjectId.isValid(teacherId) || !Array.isArray(studentIds) || studentIds.some(id => !mongoose.Types.ObjectId.isValid(id))) return res.status(400).json({ message: 'Invalid teacher/student IDs.'});
  try {
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'Teacher' || (teacher.department && teacher.department.toString() !== hodDepartmentId)) return res.status(404).json({ message: 'Teacher not valid or not in your dept.'});
    const students = await User.find({ _id: { $in: studentIds }, role: 'Student', department: hodDepartmentId });
    if (students.length !== studentIds.length) return res.status(404).json({ message: 'Some students not found/valid/in your dept.'});
    let successfullyAssigned = [], alreadyAssignedToThisMentor = [], errors = [];
    for (const student of students) {
      try {
        if (student.assignedMentor && student.assignedMentor.toString() !== teacherId) await User.findByIdAndUpdate(student.assignedMentor, { $pull: { mentees: student._id } });
        else if (student.assignedMentor && student.assignedMentor.toString() === teacherId) { if (!teacher.mentees.includes(student._id)) await User.findByIdAndUpdate(teacherId, { $addToSet: { mentees: student._id } }); alreadyAssignedToThisMentor.push(student._id); continue; }
        student.assignedMentor = teacherId; await student.save(); successfullyAssigned.push(student._id);
      } catch (assignError) { errors.push({ studentId: student._id, error: assignError.message }); }
    }
    const allMenteesForThisTeacher = [...new Set([...successfullyAssigned, ...alreadyAssignedToThisMentor])];
    if (allMenteesForThisTeacher.length > 0) await User.findByIdAndUpdate(teacherId, { $addToSet: { mentees: { $each: allMenteesForThisTeacher } } });
    if (successfullyAssigned.length > 0) {
      const studentDetailsForNotif = students.filter(s => successfullyAssigned.includes(s._id));
      studentDetailsForNotif.forEach(student => createNotification({ recipientUser: student._id, senderUser: req.user._id, title: 'Mentor Assigned by HOD', message: `HOD ${req.user.firstName} assigned ${teacher.firstName} as mentor.`, type: 'MentoringAlert', link: `/student/my-mentor`}).catch(err => console.error("Notif error (student bulk):", err)));
      createNotification({ recipientUser: teacherId, senderUser: req.user._id, title: 'New Mentees Assigned by HOD', message: `HOD ${req.user.firstName} assigned ${studentDetailsForNotif.map(s => s.firstName).join(', ')} to you.`, type: 'MentoringAlert', link: `/teacher/mentees`}).catch(err => console.error("Notif error (teacher bulk):", err));
    }
    res.status(200).json({ message: 'Bulk assignment completed.', successfullyAssignedCount: successfullyAssigned.length, alreadyAssignedToThisMentorCount: alreadyAssignedToThisMentor.length, errorsCount: errors.length, errors });
  } catch (error) { res.status(500).json({ message: 'Server error bulk assigning.', error: error.message });}
};

// --- Achievement Management by HOD (View-only) ---
const viewStudentAchievementsInDepartment = async (req, res) => {
  const { studentId } = req.params; const { type, studentName } = req.query;
  const hodDepartmentId = req.user.department ? req.user.department.toString() : null;
  if (!hodDepartmentId) return res.status(403).json({ message: 'HOD department not found.' });
  const achievementQuery = {}; const studentQuery = { department: hodDepartmentId, role: 'Student' };
  if (studentId) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) return res.status(400).json({ message: 'Invalid student ID.'});
    const student = await User.findOne({ _id: studentId, department: hodDepartmentId, role: 'Student' });
    if (!student) return res.status(404).json({ message: 'Student not found or not in your dept.'});
    achievementQuery.student = studentId;
  } else if (studentName) {
      const nameParts = studentName.split(' '); const nameRegex = nameParts.map(part => new RegExp(part, 'i'));
      studentQuery.$or = [{ firstName: { $in: nameRegex } }, { lastName: { $in: nameRegex } }];
      const studentsInDeptByName = await User.find(studentQuery).select('_id');
      if (!studentsInDeptByName.length) return res.status(200).json([]);
      achievementQuery.student = { $in: studentsInDeptByName.map(s => s._id) };
  }
  if (type) achievementQuery.type = type;
  try {
    if (!achievementQuery.student) {
        const studentsInDept = await User.find(studentQuery).select('_id');
        if (!studentsInDept.length) return res.status(200).json([]);
        achievementQuery.student = { $in: studentsInDept.map(s => s._id) };
    }
    const achievements = await Achievement.find(achievementQuery).populate('student', 'firstName lastName usn email').populate('verifiedBy', 'firstName lastName email').sort({ 'student.usn': 1, dateOfAchievement: -1 });
    res.status(200).json(achievements);
  } catch (error) { res.status(500).json({ message: 'Server error fetching achievements.', error: error.message });}
};

module.exports = {
    assignTeacherToSubject, removeTeacherFromSubject, getSubjectsInMyDepartment,
    uploadStudyMaterialByHOD, getDepartmentStudyMaterialsHOD,
    getLeaveRequestsForHODApproval, actOnLeaveRequestByHOD,
    viewMarksForSubjectInDepartment,
    sendDepartmentNotificationHOD,
    assignMentorInDepartment, bulkAssignMenteesToMentorInDepartment,
    viewStudentAchievementsInDepartment, // New export
};
