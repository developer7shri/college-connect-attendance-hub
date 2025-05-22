
import { UserData } from "./types";

// Dummy users for demo purposes (will be replaced with API calls)
export const DUMMY_USERS: Record<string, UserData> = {
  "admin": {
    password: "admin123",
    user: {
      id: "1",
      name: "Admin User",
      email: "admin@scahts.edu",
      role: "admin",
      profileImageUrl: "/placeholder.svg"
    }
  },
  "hod123": {
    password: "hod123",
    user: {
      id: "2",
      name: "Department Head",
      email: "hod@scahts.edu",
      role: "hod",
      department: "Computer Science",
      profileImageUrl: "/placeholder.svg"
    }
  },
  "teacher": {
    password: "teacher123",
    user: {
      id: "3",
      name: "Teacher User",
      email: "teacher@scahts.edu",
      role: "teacher",
      department: "Computer Science",
      profileImageUrl: "/placeholder.svg"
    }
  },
  "CS001": {
    password: "CS001",
    user: {
      id: "4",
      name: "Student User",
      email: "student@scahts.edu",
      role: "student",
      department: "Computer Science",
      profileImageUrl: "/placeholder.svg"
    }
  }
};

// Available departments
export const DEPARTMENTS: string[] = [
  "Computer Science", 
  "Mechanical Engineering", 
  "Electrical Engineering", 
  "Civil Engineering", 
  "Electronics Engineering"
];
