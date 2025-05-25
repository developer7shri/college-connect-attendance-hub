// Required Models and Utilities
const User = require('../models/User');
const Subject = require('../models/Subject');
const Semester = require('../models/Semester');
const Department = require('../models/Department');
const LeaveRequest = require('../models/LeaveRequest');
const StudyMaterial = require('../models/StudyMaterial');
const Marks = require('../models/Marks');
const AttendanceRecord = require('../models/AttendanceRecord');
const MentoringSession = require('../models/MentoringSession');
const Achievement = require('../models/Achievement'); // New
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { createNotification, createBulkNotifications } = require('../utils/notificationUtils');

// Helper function to format date for notification messages
const formatDateForMessage = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Existing functions (getMyAssignedSubjects, getStudentsInSubject, etc. - assumed to be defined correctly)
const getMyAssignedSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ assignedTeacher: req.user._id })
      .populate('department', 'name code')
      .populate('semester', 'semesterNumber');
    res.status(200).json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching assigned subjects', error: error.message });
  }
};

const getStudentsInSubject = async (req, res) => {
  const { subjectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(subjectId)) {
    return res.status(400).json({ message: 'Invalid subject ID format' });
  }
  try {
    const subject = await Subject.findById(subjectId)
      .populate('department', '_id name')
      .populate('semester', '_id semesterNumber');
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    if (req.user.role === 'Teacher' && (!subject.assignedTeacher || subject.assignedTeacher.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to view students for this subject.' });
    }
    if (!subject.department || !subject.department._id || !subject.semester || !subject.semester._id) {
        return res.status(404).json({ message: 'Subject department or semester details missing.' });
    }
    const students = await User.find({
      role: 'Student',
      department: subject.department._id.toString(),
      semester: subject.semester._id.toString(),
    }).select('firstName lastName email usn');
    res.status(200).json({
        subject: { name: subject.name, code: subject.code, department: subject.department.name, semester: subject.semester.semesterNumber },
        students
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching students', error: error.message });
  }
};

const getLeaveRequestsForApproval = async (req, res) => {
  try {
    const taughtSubjects = await Subject.find({ assignedTeacher: req.user._id }).select('_id');
    if (!taughtSubjects.length) return res.status(200).json([]);
    const taughtSubjectIds = taughtSubjects.map(s => s._id);
    const leaveRequests = await LeaveRequest.find({
      subject: { $in: taughtSubjectIds }, status: 'PendingTeacher',
    })
    .populate('student', 'firstName lastName email usn department semester')
    .populate({ path: 'student', populate: [{ path: 'department', model: 'Department', select: 'name code' }, { path: 'semester', model: 'Semester', select: 'semesterNumber' }]})
    .populate('subject', 'name code')
    .populate('department', 'name code')
    .sort({ createdAt: 1 });
    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching leave requests for approval', error: error.message });
  }
};

const actOnLeaveRequestByTeacher = async (req, res) => {
  const { leaveRequestId } = req.params;
  const { action, remarks } = req.body;
  if (!mongoose.Types.ObjectId.isValid(leaveRequestId)) return res.status(400).json({ message: 'Invalid leave ID' });
  if (!action || !['approve', 'reject'].includes(action.toLowerCase())) return res.status(400).json({ message: "Action must be 'approve' or 'reject'"});
  if (action.toLowerCase() === 'reject' && !remarks) return res.status(400).json({ message: "Remarks required for rejection."});

  try {
    const leaveRequest = await LeaveRequest.findById(leaveRequestId).populate('subject').populate('student', 'firstName _id');
    if (!leaveRequest) return res.status(404).json({ message: 'Leave request not found' });
    if (req.user.role === 'Teacher' && (!leaveRequest.subject.assignedTeacher || leaveRequest.subject.assignedTeacher.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized for this leave request.' });
    }
    if (leaveRequest.status !== 'PendingTeacher') return res.status(400).json({ message: `Request status is ${leaveRequest.status}, not PendingTeacher.`});

    leaveRequest.teacherAction = { actionBy: req.user._id, actionDate: new Date(), remarks: remarks || '', status: action.toLowerCase() === 'approve' ? 'Approved' : 'Rejected' };
    const studentName = leaveRequest.student.firstName;
    const subjectName = leaveRequest.subject.name;
    const fromDateFormatted = formatDateForMessage(leaveRequest.fromDate);
    const toDateFormatted = formatDateForMessage(leaveRequest.toDate);
    let notificationMessage, notificationTitle = 'Leave Request Update';

    if (action.toLowerCase() === 'approve') {
      leaveRequest.status = 'PendingHOD';
      notificationMessage = `Dear ${studentName}, your leave request for ${subjectName} from ${fromDateFormatted} to ${toDateFormatted} has been approved by your teacher and is now pending HOD approval. Remarks: ${remarks || 'N/A'}`;
    } else {
      leaveRequest.status = 'RejectedByTeacher';
      notificationMessage = `Dear ${studentName}, your leave request for ${subjectName} from ${fromDateFormatted} to ${toDateFormatted} has been rejected by your teacher. Remarks: ${remarks}`;
    }
    await leaveRequest.save();

    createNotification({
        recipientUser: leaveRequest.student._id, senderUser: req.user._id, title: notificationTitle,
        message: notificationMessage, type: 'LeaveStatus', link: `/student/leave/my-requests`,
    }).catch(err => console.error("Failed to notify student (teacher action):", err));

    if (leaveRequest.status === 'PendingHOD') {
      const subjectDetails = await Subject.findById(leaveRequest.subject._id).populate('department');
      if (subjectDetails && subjectDetails.department) {
        const hodUsers = await User.find({ role: 'HOD', department: subjectDetails.department._id.toString() });
        hodUsers.forEach(hod => {
          createNotification({
              recipientUser: hod._id, senderUser: req.user._id, title: 'Leave Request Awaiting Your Approval',
              message: `A leave request for ${subjectName} (Student: ${studentName}) from ${fromDateFormatted} to ${toDateFormatted} has been approved by the teacher and requires your approval.`,
              type: 'LeaveStatus', link: `/hod/leave-requests`,
          }).catch(err => console.error(`Failed to notify HOD ${hod._id}:`, err));
        });
      }
    }
    const populatedLR = await LeaveRequest.findById(leaveRequest._id).populate('student', 'firstName lastName email usn').populate('subject', 'name code').populate('department', 'name code').populate('teacherAction.actionBy', 'firstName lastName email').populate('hodAction.actionBy', 'firstName lastName email');
    res.status(200).json({ message: `Leave request ${action.toLowerCase() === 'approve' ? 'forwarded to HOD' : 'rejected'}.`, leaveRequest: populatedLR });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Server error acting on leave request', error: error.message });
  }
};

const uploadStudyMaterialByTeacher = async (req, res) => {
  const { title, description, fileUrl, subjectId, visibility } = req.body;
  if (!title || !fileUrl || !visibility || !subjectId) return res.status(400).json({ message: 'Title, fileUrl, subjectId, and visibility required.'});
  if (!mongoose.Types.ObjectId.isValid(subjectId)) return res.status(400).json({ message: 'Invalid subject ID.'});
  const allowedVisibilities = ['PublicToSubjectStudents', 'PrivateToSelf'];
  if (!allowedVisibilities.includes(visibility)) return res.status(400).json({ message: `Visibility '${visibility}' not allowed for Teacher.`});

  try {
    const subject = await Subject.findById(subjectId).populate('department').populate('semester');
    if (!subject) return res.status(404).json({ message: 'Subject not found.'});
    if (req.user.role === 'Teacher' && (!subject.assignedTeacher || subject.assignedTeacher.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not assigned to this subject.' });
    }
    const materialDepartment = subject.department._id;
    const materialSemester = subject.semester._id;
    if (visibility === 'PublicToSubjectStudents' && (!subjectId || !materialSemester || !materialDepartment)) {
       return res.status(400).json({ message: 'Subject, Semester, and Department required for this visibility.' });
    }
    const newMaterial = new StudyMaterial({
      title, description, fileUrl, uploadedBy: req.user._id,
      subject: subjectId, semester: materialSemester, department: materialDepartment, visibility,
    });
    await newMaterial.save();

    if (visibility === 'PublicToSubjectStudents') {
      const students = await User.find({ role: 'Student', department: materialDepartment.toString(), semester: materialSemester.toString() }).select('_id');
      if (students.length > 0) {
        const notificationsData = students.map(student => ({
          recipientUser: student._id, senderUser: req.user._id, title: 'New Study Material Available',
          message: `New study material "${title}" for subject ${subject.name} by ${req.user.firstName} ${req.user.lastName}.`,
          type: 'NewMaterial', link: `/student/studymaterials`
        }));
        createBulkNotifications(notificationsData).catch(err => console.error("Error in bulk material notifications:", err));
      }
    }
    const populatedMaterial = await StudyMaterial.findById(newMaterial._id).populate('uploadedBy', 'firstName lastName email').populate('subject', 'name code').populate('semester', 'semesterNumber').populate('department', 'name code');
    res.status(201).json(populatedMaterial);
  } catch (error) {
    console.error('Teacher upload material error:', error);
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Server error uploading material', error: error.message });
  }
};

const getRelevantStudyMaterialsTeacher = async (req, res) => {
  try {
    const userId = req.user._id;
    const userDepartment = req.user.department;
    const taughtSubjectObjects = await Subject.find({ assignedTeacher: userId }).populate('semester');
    const taughtSubjectIds = taughtSubjectObjects.map(s => s._id);
    const taughtSemesterIds = [...new Set(taughtSubjectObjects.map(s => s.semester?._id).filter(id => id))];
    const query = {
      $or: [
        { visibility: 'PublicToAll' }, { uploadedBy: userId },
        { subject: { $in: taughtSubjectIds }, visibility: 'PublicToSubjectStudents' },
      ]
    };
    if (userDepartment && mongoose.Types.ObjectId.isValid(userDepartment.toString())) {
      query.$or.push({ department: userDepartment, visibility: 'PublicToDepartment' });
    }
    if (taughtSemesterIds.length > 0) {
        query.$or.push({ semester: { $in: taughtSemesterIds }, visibility: 'PublicToSemester' });
    }
    const materials = await StudyMaterial.find(query).populate('uploadedBy', 'firstName lastName email').populate('subject', 'name code').populate('semester', 'semesterNumber').populate('department', 'name code').sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error) {
    console.error('Teacher get materials error:', error);
    res.status(500).json({ message: 'Server error fetching Teacher study materials', error: error.message });
  }
};

const enterOrUpdateStudentMarksForSubject = async (req, res) => {
  const { subjectId, studentId } = req.params;
  const { theoryInternal, otherInternal, externalMarks, remarks, grade } = req.body;
  if (!mongoose.Types.ObjectId.isValid(subjectId) || !mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: 'Invalid Subject/Student ID' });
  }
  try {
    const subject = await Subject.findById(subjectId).populate('semester');
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    if (req.user.role === 'Teacher' && (!subject.assignedTeacher || subject.assignedTeacher.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized for this subject (marks).' });
    }
    const student = await User.findById(studentId);
    if (!student || student.role !== 'Student') return res.status(404).json({ message: 'Student not found.' });
    if (student.department !== subject.department.toString() || student.semester !== subject.semester._id.toString()) {
      return res.status(400).json({ message: 'Student not enrolled in subject\'s dept/sem.' });
    }
    const marksData = { student: studentId, subject: subjectId, semester: subject.semester._id, enteredBy: req.user._id };
    if (theoryInternal) marksData.theoryInternal = theoryInternal;
    if (otherInternal) marksData.otherInternal = otherInternal;
    if (externalMarks !== undefined) marksData.externalMarks = externalMarks;
    if (remarks !== undefined) marksData.remarks = remarks;
    if (grade !== undefined) marksData.grade = grade;

    const updatedMarks = await Marks.findOneAndUpdate(
      { student: studentId, subject: subjectId }, { $set: marksData },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).populate('student', 'firstName lastName usn').populate('subject', 'name code').populate('semester', 'semesterNumber');
    res.status(200).json(updatedMarks);
  } catch (error) {
    console.error('Error entering/updating marks:', error);
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message, errors: error.errors });
    res.status(500).json({ message: 'Server error entering/updating marks', error: error.message });
  }
};

const getStudentMarksForSubject = async (req, res) => {
  const { subjectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(subjectId)) return res.status(400).json({ message: 'Invalid Subject ID' });
  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    if (req.user.role === 'Teacher' && (!subject.assignedTeacher || subject.assignedTeacher.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized for this subject (view marks).' });
    }
    const marksList = await Marks.find({ subject: subjectId }).populate('student', 'firstName lastName usn email').populate('subject', 'name code').populate('semester', 'semesterNumber').populate('enteredBy', 'firstName lastName').sort({ 'student.usn': 1 });
    res.status(200).json(marksList);
  } catch (error) {
    console.error('Error fetching marks for subject:', error);
    res.status(500).json({ message: 'Server error fetching marks', error: error.message });
  }
};

const generateAttendanceQRToken = async (req, res) => {
  const { subjectId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(subjectId)) return res.status(400).json({ message: 'Invalid Subject ID' });
  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    if (req.user.role === 'Teacher' && (!subject.assignedTeacher || subject.assignedTeacher.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized for QR generation (not assigned).' });
    }
    const todayDateString = new Date().toISOString().split('T')[0];
    const payload = { subjectId: subject._id.toString(), date: todayDateString, teacherId: req.user._id.toString(), type: 'ATTENDANCE_QR' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.QR_TOKEN_EXPIRES_IN || '5m' });
    res.status(200).json({ qrToken: token });
  } catch (error) {
    console.error('Error generating QR token:', error);
    res.status(500).json({ message: 'Server error generating QR token', error: error.message });
  }
};

const markAttendanceManually = async (req, res) => {
  const { subjectId } = req.params;
  const { studentId, date, isPresent } = req.body;
  if (!mongoose.Types.ObjectId.isValid(subjectId) || !mongoose.Types.ObjectId.isValid(studentId)) return res.status(400).json({ message: 'Invalid Subject/Student ID' });
  if (!date || typeof isPresent !== 'boolean') return res.status(400).json({ message: 'Date and isPresent required.' });
  const normalizedDate = new Date(Date.UTC(new Date(date).getUTCFullYear(), new Date(date).getUTCMonth(), new Date(date).getUTCDate()));
  try {
    const subject = await Subject.findById(subjectId).populate('semester');
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    if (req.user.role === 'Teacher' && (!subject.assignedTeacher || subject.assignedTeacher.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized for this subject (manual attendance).' });
    }
    const student = await User.findById(studentId);
    if (!student || student.role !== 'Student') return res.status(404).json({ message: 'Student not found.' });
    if (student.department !== subject.department.toString() || student.semester !== subject.semester._id.toString()) {
      return res.status(400).json({ message: 'Student not enrolled in subject\'s dept/sem.' });
    }
    const attendanceData = { student: studentId, subject: subjectId, date: normalizedDate, isPresent, markedBy: 'ManualTeacher', teacher: req.user._id };
    const updatedAttendance = await AttendanceRecord.findOneAndUpdate(
      { student: studentId, subject: subjectId, date: normalizedDate }, { $set: attendanceData },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).populate('student', 'firstName lastName usn').populate('subject', 'name code');
    res.status(200).json(updatedAttendance);
  } catch (error) {
    console.error('Error marking attendance manually:', error);
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message, errors: error.errors });
    res.status(500).json({ message: 'Server error marking attendance manually', error: error.message });
  }
};

const getAttendanceForSubject = async (req, res) => {
  const { subjectId } = req.params;
  const { date, fromDate, toDate } = req.query;
  if (!mongoose.Types.ObjectId.isValid(subjectId)) return res.status(400).json({ message: 'Invalid Subject ID' });
  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    if (req.user.role === 'Teacher' && (!subject.assignedTeacher || subject.assignedTeacher.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized for this subject (view attendance).' });
    }
    const query = { subject: subjectId };
    if (date) query.date = new Date(Date.UTC(new Date(date).getUTCFullYear(), new Date(date).getUTCMonth(), new Date(date).getUTCDate()));
    else if (fromDate && toDate) query.date = { $gte: new Date(Date.UTC(new Date(fromDate).getUTCFullYear(), new Date(fromDate).getUTCMonth(), new Date(fromDate).getUTCDate())), $lte: new Date(Date.UTC(new Date(toDate).getUTCFullYear(), new Date(toDate).getUTCMonth(), new Date(toDate).getUTCDate()))};
    const attendanceList = await AttendanceRecord.find(query).populate('student', 'firstName lastName usn email').sort({ date: -1, 'student.usn': 1 });
    res.status(200).json(attendanceList);
  } catch (error) {
    console.error('Error fetching attendance for subject:', error);
    res.status(500).json({ message: 'Server error fetching attendance', error: error.message });
  }
};

const sendClassNotificationTeacher = async (req, res) => {
  const { title, message, type = 'Announcement', link, subjectId } = req.body;
  if (!title || !message || !subjectId) return res.status(400).json({ message: 'Title, message, and subjectId required.'});
  if (!mongoose.Types.ObjectId.isValid(subjectId)) return res.status(400).json({ message: 'Invalid subject ID.'});
  try {
    const subject = await Subject.findById(subjectId).populate('department').populate('semester');
    if (!subject) return res.status(404).json({ message: 'Subject not found.'});
    if (req.user.role === 'Teacher' && (!subject.assignedTeacher || subject.assignedTeacher.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized for this subject (send notification).'});
    }
    const students = await User.find({
      role: 'Student', department: subject.department._id.toString(), semester: subject.semester._id.toString(),
    }).select('_id');
    if (!students || students.length === 0) return res.status(404).json({ message: 'No students for this class.'});
    const notificationsData = students.map(student => ({
      recipientUser: student._id, senderUser: req.user._id, title,
      message: `${message} (For subject: ${subject.name})`, type, link,
    }));
    const result = await createBulkNotifications(notificationsData);
    if (result.errors && result.errors.length > 0) {
      console.error("Partial success class notifications:", result.errors);
      return res.status(207).json({ message: `Partially sent. Success: ${result.successCount}, Failures: ${result.errors.length}`, details: result.errors });
    }
    res.status(200).json({ message: `Successfully sent notifications to ${result.successCount} students.` });
  } catch (error) {
    console.error('Error sending class notification by Teacher:', error);
    res.status(500).json({ message: 'Server error sending class notification.', error: error.message });
  }
};

// --- Mentoring System by Teacher ---
const getMyAssignedMentees = async (req, res) => {
  try {
    const teacherWithMentees = await User.findById(req.user._id)
      .populate({ path: 'mentees', select: 'firstName lastName email usn department semester assignedMentor', populate: [ { path: 'department', model: 'Department', select: 'name code'}, { path: 'semester', model: 'Semester', select: 'semesterNumber'}]});
    if (!teacherWithMentees) return res.status(404).json({ message: 'Teacher not found.' });
    res.status(200).json(teacherWithMentees.mentees);
  } catch (error) { res.status(500).json({ message: 'Server error fetching assigned mentees.', error: error.message });}
};

const createMentoringSession = async (req, res) => {
  const { menteeId, date, notesByMentor } = req.body; const mentorId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(menteeId)) return res.status(400).json({ message: 'Invalid mentee ID.'});
  if (!date || !notesByMentor) return res.status(400).json({ message: 'Mentee ID, date, and notes required.'});
  try {
    const teacher = await User.findById(mentorId);
    if (!teacher || !teacher.mentees.includes(menteeId)) return res.status(403).json({ message: 'Student is not an assigned mentee.'});
    const mentee = await User.findById(menteeId);
    if (!mentee || mentee.role !== 'Student') return res.status(404).json({ message: 'Mentee not found.'});
    const newSession = new MentoringSession({ mentor: mentorId, mentee: menteeId, date, notesByMentor });
    await newSession.save();
    createNotification({
      recipientUser: menteeId, senderUser: mentorId, title: 'New Mentoring Session Logged',
      message: `Mentor ${teacher.firstName} ${teacher.lastName} logged a session for ${formatDateForMessage(date)}. View notes & add feedback.`,
      type: 'MentoringAlert', link: `/student/mentoring-sessions`
    }).catch(err => console.error("Notif error (new session to mentee):", err));
    const populatedSession = await MentoringSession.findById(newSession._id).populate('mentor', 'firstName lastName email').populate('mentee', 'firstName lastName email usn');
    res.status(201).json(populatedSession);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Server error creating mentoring session.', error: error.message });
  }
};

const updateMentoringSession = async (req, res) => {
  const { sessionId } = req.params; const { date, notesByMentor } = req.body; const mentorId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(sessionId)) return res.status(400).json({ message: 'Invalid session ID.'});
  if (!date && !notesByMentor) return res.status(400).json({ message: 'Nothing to update.'});
  try {
    const session = await MentoringSession.findById(sessionId).populate('mentee', '_id firstName'); // Populate mentee for notification
    if (!session) return res.status(404).json({ message: 'Session not found.'});
    if (session.mentor.toString() !== mentorId.toString()) return res.status(403).json({ message: 'Not authorized to update (not mentor).'});
    if (date) session.date = date; if (notesByMentor) session.notesByMentor = notesByMentor;
    await session.save();
    createNotification({
      recipientUser: session.mentee._id, senderUser: mentorId, title: 'Mentoring Session Updated',
      message: `Session with ${req.user.firstName} ${req.user.lastName} for ${formatDateForMessage(session.date)} updated.`,
      type: 'MentoringAlert', link: `/student/mentoring-sessions`
    }).catch(err => console.error("Notif error (update session to mentee):", err));
    const populatedSession = await MentoringSession.findById(session._id).populate('mentor', 'firstName lastName email').populate('mentee', 'firstName lastName email usn');
    res.status(200).json(populatedSession);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Server error updating mentoring session.', error: error.message });
  }
};

const viewMentoringSessionsForMentee = async (req, res) => {
  const { menteeId } = req.params; const mentorId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(menteeId)) return res.status(400).json({ message: 'Invalid mentee ID.'});
  try {
    const teacher = await User.findById(mentorId);
    if (!teacher.mentees.map(id => id.toString()).includes(menteeId)) return res.status(403).json({ message: 'Student is not your mentee.'});
    const sessions = await MentoringSession.find({ mentor: mentorId, mentee: menteeId }).populate('mentor', 'firstName lastName email').populate('mentee', 'firstName lastName email usn').sort({ date: -1 });
    res.status(200).json(sessions);
  } catch (error) { res.status(500).json({ message: 'Server error fetching sessions for mentee.', error: error.message });}
};

// --- Achievement Management by Teacher (Mentor) ---
const viewMenteeAchievements = async (req, res) => {
  const { menteeId } = req.params; const mentorId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(menteeId)) return res.status(400).json({ message: 'Invalid mentee ID.'});
  try {
    const teacher = await User.findById(mentorId);
    if (!teacher.mentees.map(id => id.toString()).includes(menteeId)) return res.status(403).json({ message: 'Student is not your mentee.'});
    const achievements = await Achievement.find({ student: menteeId }).populate('student', 'firstName lastName usn').populate('verifiedBy', 'firstName lastName email').sort({ dateOfAchievement: -1 });
    res.status(200).json(achievements);
  } catch (error) { res.status(500).json({ message: 'Server error fetching mentee achievements.', error: error.message });}
};

module.exports = {
  getMyAssignedSubjects, getStudentsInSubject,
  getLeaveRequestsForApproval, actOnLeaveRequestByTeacher,
  uploadStudyMaterialByTeacher, getRelevantStudyMaterialsTeacher,
  enterOrUpdateStudentMarksForSubject, getStudentMarksForSubject,
  generateAttendanceQRToken, markAttendanceManually, getAttendanceForSubject,
  sendClassNotificationTeacher,
  getMyAssignedMentees, createMentoringSession, updateMentoringSession, viewMentoringSessionsForMentee,
  viewMenteeAchievements, // New export
};
