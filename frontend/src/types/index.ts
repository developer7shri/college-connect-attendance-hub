// User roles
export type UserRole = 'Admin' | 'HOD' | 'Teacher' | 'Student'; // Capitalized to match backend

// User interface
export interface User {
  id: string; // Was _id from backend
  email: string;
  role: UserRole;
  name: string; // Was firstName + lastName
  firstName?: string; // Keep if still used directly
  lastName?: string;  // Keep if still used directly
  phone?: string;     // Was phoneNumber
  department?: string;
  semester?: number; // Consistent as number
  usn?: string;
  profileImageUrl?: string;
  subjects?: Subject[]; // Array of subjects for teachers
  classes?: string[]; // Array of class/semester identifiers for teachers
  isPasswordDefault: boolean; // Added this line
  createdAt?: string; // Or Date
  updatedAt?: string; // Or Date
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
  email: string;
  password: string; // Password is required for self-registration
  role: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  department?: string;
  semester?: number; // Consistent with User type
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
