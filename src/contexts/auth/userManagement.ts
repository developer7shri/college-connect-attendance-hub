
import { useState } from "react";
import { User, UserRole, GeneratedCredentials, UserCreationRequest } from "@/types";
import { UserData } from "./types";
import { toast } from "sonner";

/**
 * Custom hook for user management functionality
 */
export const useUserManagement = (initialUsers: Record<string, UserData>) => {
  const [allUsers, setAllUsers] = useState<Record<string, UserData>>(initialUsers);

  // Save users to localStorage whenever they change
  const saveUsers = (users: Record<string, UserData>) => {
    localStorage.setItem("allUsers", JSON.stringify(users));
  };

  // Create a new user
  const createUser = (
    userRequest: UserCreationRequest,
    currentUser: User | null
  ): GeneratedCredentials | null => {
    if (!currentUser) return null;

    // Check permissions: Admin can create all types, HOD can create teachers and students in their department
    if (currentUser.role === 'admin') {
      // Admin can create HOD, teachers, and students (but not other admins)
      if (userRequest.role === 'admin') {
        toast.error("Permission Denied: Cannot create Admin accounts");
        return null;
      }
    } else if (currentUser.role === 'hod') {
      // HOD can only create teachers and students in their department
      if (userRequest.role === 'hod' || userRequest.role === 'admin') {
        toast.error("Permission Denied: HOD can only create teachers and students");
        return null;
      }
      if (userRequest.department !== currentUser.department) {
        toast.error("Permission Denied: Can only create users in your department");
        return null;
      }
    } else if (currentUser.role === 'teacher') {
      // Teachers can only create students in their department
      if (userRequest.role !== 'student') {
        toast.error("Permission Denied: Teachers can only create students");
        return null;
      }
      if (userRequest.department !== currentUser.department) {
        toast.error("Permission Denied: Can only create students in your department");
        return null;
      }
    } else {
      toast.error("Permission Denied: Insufficient privileges to create users");
      return null;
    }

    // Use email as username
    const username = userRequest.email;
    
    // Check if email/username already exists
    if (allUsers[username]) {
      toast.error("Error Creating User: Email already exists in the system");
      return null;
    }

    // Use phone number as initial password
    const password = userRequest.phone;
    
    const userId = `${Object.keys(allUsers).length + 1}`;

    const newUser: User = {
      id: userId,
      name: userRequest.name,
      email: userRequest.email,
      role: userRequest.role,
      department: userRequest.department,
      phone: userRequest.phone,
      profileImageUrl: "/placeholder.svg",
      // Teacher-specific fields
      subjects: userRequest.subjects || [],
      classes: userRequest.classes || [],
      // Student-specific fields
      usn: userRequest.usn,
      semester: userRequest.semester,
    };

    // Add to our users record
    const updatedUsers = {
      ...allUsers,
      [username]: {
        password,
        user: newUser
      }
    };
    
    setAllUsers(updatedUsers);
    saveUsers(updatedUsers);

    toast.success(`User Created Successfully: Created ${userRequest.role}: ${userRequest.name}`);

    return {
      username, // This is the email
      password, // This is the phone number
      name: userRequest.name,
      email: userRequest.email,
      role: userRequest.role,
    };
  };

  // Update user profile
  const updateUserProfile = (updatedUser: User, currentUser: User | null) => {
    if (!currentUser) {
      toast.error("Permission Denied: User not authenticated");
      return;
    }

    // Check permissions
    if (currentUser.role !== 'admin' && currentUser.id !== updatedUser.id) {
      toast.error("Permission Denied: Can only update your own profile");
      return;
    }

    // Find the username (email) for the given user ID
    const username = Object.keys(allUsers).find(
      (key) => allUsers[key].user.id === updatedUser.id
    );
    
    if (username) {
      const updatedUsers = {
        ...allUsers,
        [username]: {
          ...allUsers[username],
          user: updatedUser,
        },
      };
      setAllUsers(updatedUsers);
      saveUsers(updatedUsers);
      toast.success("Profile updated successfully");
    }
  };

  // Retrieve all users
  const getAllUsers = (): User[] => {
    return Object.values(allUsers).map(entry => entry.user);
  };

  // Get users by department
  const getUsersByDepartment = (department: string): User[] => {
    return Object.values(allUsers)
      .filter(entry => entry.user.department === department)
      .map(entry => entry.user);
  };

  // Get users by role
  const getUsersByRole = (role: UserRole): User[] => {
    return Object.values(allUsers)
      .filter(entry => entry.user.role === role)
      .map(entry => entry.user);
  };

  return {
    allUsers,
    setAllUsers,
    createUser,
    updateUserProfile,
    getAllUsers,
    getUsersByDepartment,
    getUsersByRole
  };
};
