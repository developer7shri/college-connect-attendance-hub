// User roles
export type UserRole = 'admin' | 'hod' | 'teacher' | 'student';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  profileImageUrl?: string;
  phone?: string;
  subjects?: Subject[]; // Array of subjects for teachers
  classes?: string[]; // Array of class/semester identifiers for teachers
  usn?: string; // USN for students
  semester?: number;
}

// Subject interface
export interface Subject {
  id: string;
  name: string;
  code: string;
  semester: number;
  department: string;
  teacherId?: string;
}

// Authentication state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Notification
export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// Department
export interface Department {
  id: string;
  name: string;
  hodId?: string;
}

// Student
export interface Student {
  id: string;
  name: string;
  usn: string;
  email: string;
  department: string;
  semester: number;
  mentorId?: string;
}

// Attendance
export interface Attendance {
  id: string;
  studentId: string;
  subjectId: string;
  date: string;
  status: 'present' | 'absent';
  markedBy: string;
  markedAt: string;
}

// Leave Request
export interface LeaveRequest {
  id: string;
  studentId: string;
  reason: string;
  fromDate: string;
  toDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

// QR Code
export interface QRCodeData {
  subjectId: string;
  teacherId: string;
  timestamp: string;
  expiresAt: string;
}

// User Creation Request
export interface UserCreationRequest {
  name: string;
  email: string; // This will be used as the user ID
  phone: string; // This will be used as the initial password
  department: string;
  role: UserRole;
  semester?: number;
  subjects?: Subject[]; // For teachers - multiple subjects
  classes?: string[]; // For teachers - multiple classes/semesters
  usn?: string;
}

// Generated Credentials
export interface GeneratedCredentials {
  username: string; // This will be the email
  password: string; // This will be the phone number
  name: string;
  email: string;
  role: UserRole;
}

// Internal Marks
export interface InternalMarks {
  id: string;
  studentId: string;
  subjectId: string;
  firstCI: number; // out of 15
  secondCI: number; // out of 15
  assignments: number; // out of 10
  labInternals: number; // out of 10
  total: number; // out of 50
  updatedBy: string;
  updatedAt: string;
}

// External Marks
export interface ExternalMarks {
  id: string;
  studentId: string;
  subjectId: string;
  marks: number; // out of 50
  updatedBy: string;
  updatedAt: string;
}

// Total Marks
export interface TotalMarks {
  studentId: string;
  subjectId: string;
  internal: number; // out of 50
  external: number; // out of 50
  total: number; // out of 100
}

// Mentoring Session
export interface MentoringSession {
  id: string;
  mentorId: string;
  studentId: string;
  date: string;
  duration: number; // in minutes
  notes: string;
  topics: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
}

// Student Progress
export interface StudentProgress {
  id: string;
  studentId: string;
  academicPerformance: 'excellent' | 'good' | 'average' | 'poor';
  attendancePercentage: number;
  achievements: string[];
  areasOfImprovement: string[];
  updatedAt: string;
}

// Student Certificate/Achievement
export interface StudentAchievement {
  id: string;
  studentId: string;
  title: string;
  description: string;
  date: string;
  certificateUrl: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  uploadedAt: string;
}
