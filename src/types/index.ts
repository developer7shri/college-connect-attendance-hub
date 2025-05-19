
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

// Subject
export interface Subject {
  id: string;
  name: string;
  code: string;
  semester: number;
  department: string;
  teacherId?: string;
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
