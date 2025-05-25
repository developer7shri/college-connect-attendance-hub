// Required Models and Utilities
const User = require('../models/User');
const Subject = require('../models/Subject');
const Semester = require('../models/Semester');
const Department = require('../models/Department');
const LeaveRequest = require('../models/LeaveRequest');
const StudyMaterial = require('../models/StudyMaterial');
const Marks = require('../models/Marks');
const AttendanceRecord = require('../models/AttendanceRecord');
const MentoringSession = require('../models/MentoringSession'); // New
const Notification = require('../models/Notification'); // For potential future use by student actions
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { createNotification } = require('../utils/notificationUtils');

// Helper function to format date for notification messages
const formatDateForMessage = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// @desc    Apply for a new leave
// @route   POST /api/student/leave/apply
// @access  Private (Student)
const applyLeave = async (req, res) => {
  const { subjectId, reason, fromDate, toDate, supportingDocs } = req.body;
  if (!subjectId || !reason || !fromDate || !toDate) return res.status(400).json({ message: 'Subject, reason, fromDate, toDate required.'});
  if (!mongoose.Types.ObjectId.isValid(subjectId)) return res.status(400).json({ message: 'Invalid subject ID.'});
  const parsedFromDate = new Date(fromDate); const parsedToDate = new Date(toDate);
  if (isNaN(parsedFromDate.getTime()) || isNaN(parsedToDate.getTime())) return res.status(400).json({ message: 'Invalid date format.'});
  if (parsedToDate < parsedFromDate) return res.status(400).json({ message: 'To Date cannot be before From Date.'});

  try {
    const student = await User.findById(req.user._id);
    const subject = await Subject.findById(subjectId).populate('department').populate('semester');
    if (!subject || !subject.department || !subject.semester) return res.status(404).json({ message: 'Subject or its details not found.'});
    if(student.department !== subject.department._id.toString() || student.semester !== subject.semester._id.toString()){
        return res.status(400).json({ message: `Not enrolled in the department/semester of this subject.`});
    }
    const leaveRequest = new LeaveRequest({
      student: req.user._id, subject: subjectId, department: subject.department._id,
      reason, fromDate: parsedFromDate, toDate: parsedToDate, supportingDocs: supportingDocs || [], status: 'PendingTeacher',
    });
    await leaveRequest.save();
    const populatedLR = await LeaveRequest.findById(leaveRequest._id).populate('student', 'firstName lastName email usn').populate('subject', 'name code').populate('department', 'name code');
    res.status(201).json({ message: 'Leave request submitted.', leaveRequest: populatedLR });
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Server error applying for leave', error: error.message });
  }
};

// @desc    Get all leave requests for the logged-in student
// @route   GET /api/student/leave/my-requests
// @access  Private (Student)
const getMyLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({ student: req.user._id })
      .populate({ path: 'subject', select: 'name code assignedTeacher', populate: { path: 'assignedTeacher', select: 'firstName lastName email' }})
      .populate('department', 'name code').populate('teacherAction.actionBy', 'firstName lastName email').populate('hodAction.actionBy', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.status(200).json(leaveRequests);
  } catch (error) { res.status(500).json({ message: 'Server error fetching leave requests', error: error.message });}
};

// @desc    Withdraw a leave request
// @route   PUT /api/student/leave/:leaveRequestId/withdraw
// @access  Private (Student)
const withdrawLeaveRequest = async (req, res) => {
  const { leaveRequestId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(leaveRequestId)) return res.status(400).json({ message: 'Invalid leave ID.'});
  try {
    const leaveRequest = await LeaveRequest.findById(leaveRequestId);
    if (!leaveRequest) return res.status(404).json({ message: 'Leave request not found.'});
    if (leaveRequest.student.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized.'});
    if (!leaveRequest.canBeWithdrawn()) return res.status(400).json({ message: `Cannot withdraw. Status: ${leaveRequest.status}.`});
    leaveRequest.status = 'Withdrawn';
    await leaveRequest.save();
    const populatedLR = await LeaveRequest.findById(leaveRequest._id).populate('student', 'firstName lastName email usn').populate('subject', 'name code').populate('department', 'name code');
    res.status(200).json({ message: 'Leave request withdrawn.', leaveRequest: populatedLR });
  } catch (error) { res.status(500).json({ message: 'Server error withdrawing leave', error: error.message });}
};

// @desc    Get available study materials for the logged-in student
// @route   GET /api/student/studymaterials
// @access  Private (Student)
const getAvailableStudyMaterialsStudent = async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    if (!student.department || !mongoose.Types.ObjectId.isValid(student.department.toString()) || !student.semester || !mongoose.Types.ObjectId.isValid(student.semester.toString())) {
      return res.status(400).json({ message: 'Student dept/sem info missing or invalid.' });
    }
    const studentDepartmentId = student.department.toString(); const studentSemesterId = student.semester.toString();
    const relevantSubjects = await Subject.find({ department: studentDepartmentId, semester: studentSemesterId }).select('_id');
    const relevantSubjectIds = relevantSubjects.map(s => s._id);
    const query = {
      $or: [
        { visibility: 'PublicToAll' }, { visibility: 'PublicToDepartment', department: studentDepartmentId },
        { visibility: 'PublicToSemester', semester: studentSemesterId },
        { visibility: 'PublicToSubjectStudents', subject: { $in: relevantSubjectIds } },
      ],
    };
    const materials = await StudyMaterial.find(query).populate('uploadedBy', 'firstName lastName email role').populate('subject', 'name code').populate('semester', 'semesterNumber').populate('department', 'name code').sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (error) { res.status(500).json({ message: 'Server error fetching student materials', error: error.message });}
};

// @desc    View all marks for the logged-in student, optionally filtered by semester
// @route   GET /api/student/marks
// @access  Private (Student)
const viewMyMarks = async (req, res) => {
  const { semesterId } = req.query;
  if (semesterId && !mongoose.Types.ObjectId.isValid(semesterId)) return res.status(400).json({ message: 'Invalid semester ID.'});
  try {
    const studentId = req.user._id; const query = { student: studentId };
    if (semesterId) query.semester = semesterId;
    const marksList = await Marks.find(query)
      .populate('subject', 'name code').populate({ path: 'semester', select: 'semesterNumber department', populate: { path: 'department', select: 'name code'}})
      .populate('enteredBy', 'firstName lastName email').sort({ 'semester.semesterNumber': 1, 'subject.name': 1 });
    if (!marksList.length) return res.status(200).json({ message: semesterId ? 'No marks for semester.' : 'No marks found.', marks: [] });
    res.status(200).json(marksList);
  } catch (error) { res.status(500).json({ message: 'Server error fetching student marks', error: error.message });}
};

// @desc    Mark attendance by scanning a QR code
// @route   POST /api/student/attendance/qr
// @access  Private (Student)
const markAttendanceByQR = async (req, res) => {
  const { qrToken } = req.body;
  if (!qrToken) return res.status(400).json({ message: 'QR Token required.'});
  try {
    const decoded = jwt.verify(qrToken, process.env.JWT_SECRET);
    if (!decoded.type || decoded.type !== 'ATTENDANCE_QR') return res.status(401).json({ message: 'Invalid QR token type.'});
    const { subjectId, date: tokenDateStr, teacherId } = decoded;
    if (!mongoose.Types.ObjectId.isValid(subjectId) || !mongoose.Types.ObjectId.isValid(teacherId)) return res.status(400).json({ message: 'Invalid subject/teacher ID in token.'});
    const student = await User.findById(req.user._id);
    const subject = await Subject.findById(subjectId).populate('semester');
    if (!subject || !subject.semester) return res.status(404).json({ message: 'Subject from QR not found or invalid.'});
    if (student.department !== subject.department.toString() || student.semester.toString() !== subject.semester._id.toString()) { // Ensure student.semester is string for comparison if it's ObjectId
      return res.status(403).json({ message: 'Not enrolled in subject in QR.' });
    }
    const normalizedDate = new Date(Date.UTC(new Date(tokenDateStr).getUTCFullYear(), new Date(tokenDateStr).getUTCMonth(), new Date(tokenDateStr).getUTCDate()));
    const existingRecord = await AttendanceRecord.findOne({ student: req.user._id, subject: subjectId, date: normalizedDate });
    if (existingRecord && existingRecord.isPresent) return res.status(200).json({ message: 'Attendance already marked present.', attendanceRecord: existingRecord });
    const attendanceData = { student: req.user._id, subject: subjectId, date: normalizedDate, isPresent: true, markedBy: 'QR', scannedAt: new Date(), teacher: teacherId };
    const updatedAttendance = await AttendanceRecord.findOneAndUpdate(
      { student: req.user._id, subject: subjectId, date: normalizedDate }, { $set: attendanceData },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).populate('student', 'firstName lastName usn').populate('subject', 'name code');
    res.status(200).json({ message: 'Attendance marked via QR.', attendanceRecord: updatedAttendance });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') return res.status(401).json({ message: `QR token invalid/expired: ${error.message}` });
    res.status(500).json({ message: 'Server error marking attendance by QR', error: error.message });
  }
};

// @desc    View attendance history for the logged-in student
// @route   GET /api/student/attendance/history
// @access  Private (Student)
const viewMyAttendanceHistory = async (req, res) => {
  const { subjectId, fromDate, toDate } = req.query; const studentId = req.user._id; const query = { student: studentId };
  if (subjectId) { if (!mongoose.Types.ObjectId.isValid(subjectId)) return res.status(400).json({ message: 'Invalid subject ID.'}); query.subject = subjectId; }
  if (fromDate && toDate) query.date = { $gte: new Date(Date.UTC(new Date(fromDate).getUTCFullYear(), new Date(fromDate).getUTCMonth(), new Date(fromDate).getUTCDate())), $lte: new Date(Date.UTC(new Date(toDate).getUTCFullYear(), new Date(toDate).getUTCMonth(), new Date(toDate).getUTCDate()))};
  else if (fromDate) query.date = { $gte: new Date(Date.UTC(new Date(fromDate).getUTCFullYear(), new Date(fromDate).getUTCMonth(), new Date(fromDate).getUTCDate()))};
  else if (toDate) query.date = { $lte: new Date(Date.UTC(new Date(toDate).getUTCFullYear(), new Date(toDate).getUTCMonth(), new Date(toDate).getUTCDate()))};
  try {
    const attendanceHistory = await AttendanceRecord.find(query).populate('subject', 'name code').populate('teacher', 'firstName lastName').sort({ date: -1 });
    res.status(200).json(attendanceHistory);
  } catch (error) { res.status(500).json({ message: 'Server error fetching attendance history', error: error.message });}
};

// @desc    View details of the assigned mentor
// @route   GET /api/student/my-mentor
// @access  Private (Student)
const viewMyMentorDetails = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).populate({
      path: 'assignedMentor', select: 'firstName lastName email department role',
      populate: { path: 'department', model: 'Department', select: 'name code'}
    });
    if (!student) return res.status(404).json({ message: 'Student not found.' });
    if (!student.assignedMentor) return res.status(200).json({ message: 'No mentor assigned yet.', mentor: null });
    res.status(200).json({ mentor: student.assignedMentor });
  } catch (error) { res.status(500).json({ message: 'Server error fetching mentor details.', error: error.message });}
};

// @desc    View all mentoring sessions for the logged-in student (mentee)
// @route   GET /api/student/mentoring-sessions
// @access  Private (Student)
const viewMyMentoringSessionsHistory = async (req, res) => {
  try {
    const sessions = await MentoringSession.find({ mentee: req.user._id })
      .populate('mentor', 'firstName lastName email').populate('mentee', 'firstName lastName email usn')
      .sort({ date: -1 });
    res.status(200).json(sessions);
  } catch (error) { res.status(500).json({ message: 'Server error fetching mentoring sessions.', error: error.message });}
};

// @desc    Add or update mentee's feedback on a mentoring session
// @route   PUT /api/student/mentoring-sessions/:sessionId/feedback
// @access  Private (Student)
const addOrUpdateMenteeFeedbackOnSession = async (req, res) => {
  const { sessionId } = req.params; const { feedbackByMentee } = req.body;
  if (!mongoose.Types.ObjectId.isValid(sessionId)) return res.status(400).json({ message: 'Invalid session ID.'});
  if (typeof feedbackByMentee !== 'string') return res.status(400).json({ message: 'Feedback must be a string.'});
  try {
    const session = await MentoringSession.findById(sessionId).populate('mentor', '_id firstName lastName'); // Populate mentor for notification
    if (!session) return res.status(404).json({ message: 'Mentoring session not found.'});
    if (session.mentee.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized for this session.'});
    session.feedbackByMentee = feedbackByMentee;
    await session.save();
    createNotification({
      recipientUser: session.mentor._id, senderUser: req.user._id, title: 'Feedback on Mentoring Session',
      message: `${req.user.firstName} ${req.user.lastName} updated feedback on session dated ${formatDateForMessage(session.date)}.`,
      type: 'MentoringAlert', link: `/teacher/mentees/${req.user._id}/sessions`
    }).catch(err => console.error("Notif error (feedback to mentor):", err));
    const populatedSession = await MentoringSession.findById(session._id).populate('mentor', 'firstName lastName email').populate('mentee', 'firstName lastName email usn');
    res.status(200).json(populatedSession);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: error.message });
    res.status(500).json({ message: 'Server error updating feedback.', error: error.message });
  }
};

module.exports = {
  applyLeave, getMyLeaveRequests, withdrawLeaveRequest,
  getAvailableStudyMaterialsStudent, viewMyMarks,
  markAttendanceByQR, viewMyAttendanceHistory,
  viewMyMentorDetails, viewMyMentoringSessionsHistory, addOrUpdateMenteeFeedbackOnSession,

  // --- Achievement Management by Student ---

  // @desc    Create a new achievement
  // @route   POST /api/student/achievements
  // @access  Private (Student)
  createAchievement: async (req, res) => {
    const { title, description, dateOfAchievement, issuingOrganization, certificateUrl, type } = req.body;
    const studentId = req.user._id;

    if (!title || !dateOfAchievement || !certificateUrl) {
      return res.status(400).json({ message: 'Title, dateOfAchievement, and certificateUrl are required.' });
    }
    // Basic URL validation (can be more robust)
    try {
        new URL(certificateUrl);
    } catch (_) {
        return res.status(400).json({ message: 'Invalid certificate URL format.' });
    }


    try {
      const student = await User.findById(studentId).select('assignedMentor firstName lastName'); // Select mentor for notification
      if (!student) return res.status(404).json({ message: 'Student not found.' });


      const newAchievement = new Achievement({
        student: studentId,
        title,
        description,
        dateOfAchievement,
        issuingOrganization,
        certificateUrl,
        type: type || 'Other', // Default if not provided
        isVerified: false, // Default
      });

      await newAchievement.save();
      
      // Notify assigned mentor if any
      if (student.assignedMentor) {
        createNotification({
          recipientUser: student.assignedMentor,
          senderUser: studentId,
          title: 'New Achievement Uploaded by Mentee',
          message: `${student.firstName} ${student.lastName} has uploaded a new achievement: "${title}". Awaiting verification.`,
          type: 'MentoringAlert', // Or a new 'AchievementUpdate' type
          link: `/teacher/mentees/${studentId}/achievements` // Example link for mentor
        }).catch(err => console.error("Notif error (new achievement to mentor):", err));
      }

      const populatedAchievement = await Achievement.findById(newAchievement._id)
                                    .populate('student', 'firstName lastName usn'); // No need to populate student again if it's self-view mostly
      res.status(201).json(populatedAchievement);

    } catch (error) {
      console.error('Error creating achievement:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message, errors: error.errors });
      }
      res.status(500).json({ message: 'Server error while creating achievement.', error: error.message });
    }
  },

  // @desc    Get all achievements for the logged-in student
  // @route   GET /api/student/achievements
  // @access  Private (Student)
  getMyAchievements: async (req, res) => {
    const studentId = req.user._id;
    const { sortBy = 'dateOfAchievement', order = 'desc' } = req.query; // Default sort by date desc

    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === 'asc' ? 1 : -1;
    }

    try {
      const achievements = await Achievement.find({ student: studentId })
        .populate('verifiedBy', 'firstName lastName email') // See who verified it
        .sort(sortOptions);

      res.status(200).json(achievements);
    } catch (error) {
      console.error('Error fetching student achievements:', error);
      res.status(500).json({ message: 'Server error while fetching achievements.', error: error.message });
    }
  },

  // @desc    Update student's own achievement
  // @route   PUT /api/student/achievements/:achievementId
  // @access  Private (Student)
  updateMyAchievement: async (req, res) => {
    const { achievementId } = req.params;
    const studentId = req.user._id;
    const { title, description, dateOfAchievement, issuingOrganization, certificateUrl, type } = req.body;

    if (!mongoose.Types.ObjectId.isValid(achievementId)) {
      return res.status(400).json({ message: 'Invalid achievement ID format.' });
    }

    try {
      const achievement = await Achievement.findById(achievementId);
      if (!achievement) {
        return res.status(404).json({ message: 'Achievement not found.' });
      }
      if (achievement.student.toString() !== studentId.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this achievement (not owner).' });
      }
      if (achievement.isVerified) {
        return res.status(403).json({ message: 'Cannot update a verified achievement. Please contact administration.' });
      }

      if (title) achievement.title = title;
      if (description) achievement.description = description;
      if (dateOfAchievement) achievement.dateOfAchievement = dateOfAchievement;
      if (issuingOrganization) achievement.issuingOrganization = issuingOrganization;
      if (certificateUrl) {
         try { new URL(certificateUrl); achievement.certificateUrl = certificateUrl; } 
         catch (_) { return res.status(400).json({ message: 'Invalid certificate URL format on update.' }); }
      }
      if (type) achievement.type = type;
      
      // Student cannot change verification status
      // achievement.isVerified = false; // Reset verification status on any update by student
      // achievement.verifiedBy = null;
      // achievement.verificationRemarks = '';


      await achievement.save();
      
      // Notify assigned mentor about update if any (optional, could be noisy)
      const student = await User.findById(studentId).select('assignedMentor firstName lastName');
      if (student && student.assignedMentor) {
        createNotification({
          recipientUser: student.assignedMentor, senderUser: studentId,
          title: 'Mentee Achievement Updated',
          message: `${student.firstName} ${student.lastName} updated their achievement: "${achievement.title}".`,
          type: 'MentoringAlert', link: `/teacher/mentees/${studentId}/achievements`
        }).catch(err => console.error("Notif error (updated achievement to mentor):", err));
      }

      res.status(200).json(achievement);
    } catch (error) {
      console.error('Error updating achievement:', error);
      if (error.name === 'ValidationError') return res.status(400).json({ message: error.message, errors: error.errors });
      res.status(500).json({ message: 'Server error while updating achievement.', error: error.message });
    }
  },

  // @desc    Delete student's own achievement
  // @route   DELETE /api/student/achievements/:achievementId
  // @access  Private (Student)
  deleteMyAchievement: async (req, res) => {
    const { achievementId } = req.params;
    const studentId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(achievementId)) {
      return res.status(400).json({ message: 'Invalid achievement ID format.' });
    }

    try {
      const achievement = await Achievement.findById(achievementId);
      if (!achievement) {
        return res.status(404).json({ message: 'Achievement not found.' });
      }
      if (achievement.student.toString() !== studentId.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this achievement (not owner).' });
      }
      if (achievement.isVerified) {
        return res.status(403).json({ message: 'Cannot delete a verified achievement. Please contact administration.' });
      }

      await achievement.deleteOne();
      
      // Notify assigned mentor about deletion if any (optional)
      const student = await User.findById(studentId).select('assignedMentor firstName lastName');
      if (student && student.assignedMentor) {
        createNotification({
          recipientUser: student.assignedMentor, senderUser: studentId,
          title: 'Mentee Achievement Deleted',
          message: `${student.firstName} ${student.lastName} deleted their achievement: "${achievement.title}".`,
          type: 'MentoringAlert', link: `/teacher/mentees/${studentId}/achievements`
        }).catch(err => console.error("Notif error (deleted achievement to mentor):", err));
      }

      res.status(200).json({ message: 'Achievement deleted successfully.' });
    } catch (error) {
      console.error('Error deleting achievement:', error);
      res.status(500).json({ message: 'Server error while deleting achievement.', error: error.message });
    }
  },
};
const Achievement = require('../models/Achievement'); // Added Achievement model
// Other models like User, Notification, etc., are assumed to be at the top
