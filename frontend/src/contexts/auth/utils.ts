
import { UserRole } from "@/types";

/**
 * Generates a random string for passwords
 */
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generates username based on role, name and department
 */
export const generateUsername = (role: UserRole, name: string, department: string): string => {
  if (role === 'student') {
    // For students, generate USN
    const deptCode = department.substring(0, 2).toUpperCase();
    const randomDigits = Math.floor(Math.random() * 900) + 100; // 100-999
    return `${deptCode}${randomDigits}`;
  } else if (role === 'hod') {
    // For HOD, use department and HOD
    const deptCode = department.substring(0, 3).toLowerCase();
    return `hod_${deptCode}`;
  } else if (role === 'teacher') {
    // For teachers, use name initials and department
    const initials = name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toLowerCase();
    const deptCode = department.substring(0, 2).toLowerCase();
    return `${initials}_${deptCode}`;
  }
  // For admin (shouldn't be created, but just in case)
  return `admin_${name.toLowerCase().replace(/\s+/g, '')}`;
};
