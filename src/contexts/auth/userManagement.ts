
import { useState } from "react";
import { User, UserRole, GeneratedCredentials, UserCreationRequest } from "@/types";
import { UserData } from "./types";
import { toast } from "@/components/ui/sonner";

/**
 * Custom hook for user management functionality
 */
export const useUserManagement = (initialUsers: Record<string, UserData>) => {
  const [allUsers, setAllUsers] = useState<Record<string, UserData>>(initialUsers);

  // Save users to localStorage whenever they change
  const saveUsers = (users: Record<string, UserData>) => {
    localStorage.setItem("allUsers", JSON.stringify(users));
  };

  // Create a new user (Admin only can create HOD, Teacher, Student)
  const createUser = (
    userRequest: UserCreationRequest,
    currentUser: User | null
  ): GeneratedCredentials | null => {
    if (!currentUser) return null;

    // Only Admin can create users
    if (currentUser.role !== 'admin') {
      toast.error("Permission Denied: Only Admin can create users");
      return null;
    }

    // Admin can only create HODs, Teachers, and Students (not other admins)
    if (userRequest.role === 'admin') {
      toast.error("Permission Denied: Cannot create Admin accounts");
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

  // Update user profile (Admin only)
  const updateUserProfile = (updatedUser: User, currentUser: User | null) => {
    if (!currentUser || currentUser.role !== 'admin') {
      toast.error("Permission Denied: Only Admin can update user profiles");
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
