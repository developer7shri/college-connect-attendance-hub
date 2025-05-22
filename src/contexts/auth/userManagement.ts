
import { useState } from "react";
import { User, UserRole, GeneratedCredentials, UserCreationRequest } from "@/types";
import { UserData } from "./types";
import { generateUsername, generateRandomString } from "./utils";
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

  // Create a new user (restricted by current user's role)
  const createUser = (
    userRequest: UserCreationRequest,
    currentUser: User | null
  ): GeneratedCredentials | null => {
    if (!currentUser) return null;

    // Permission checks
    if (
      // Admin can create HODs only
      (currentUser.role === 'admin' && userRequest.role !== 'hod') ||
      // HODs can create teachers only in their department
      (currentUser.role === 'hod' && 
        (userRequest.role !== 'teacher' || currentUser.department !== userRequest.department)) ||
      // Teachers can create students only in their department
      (currentUser.role === 'teacher' && 
        (userRequest.role !== 'student' || currentUser.department !== userRequest.department)) ||
      // Students cannot create users
      currentUser.role === 'student'
    ) {
      toast.error("Permission Denied: You don't have permission to create this type of user");
      return null;
    }

    // Generate username and password
    const username = generateUsername(userRequest.role, userRequest.name, userRequest.department);
    
    // Check if username already exists
    if (allUsers[username]) {
      toast.error("Error Creating User: Username already exists in the system");
      return null;
    }

    // Use provided password or generate a random one
    const password = userRequest.password || 
      (userRequest.role === 'student' ? username : generateRandomString(8));
    
    const userId = `${Object.keys(allUsers).length + 1}`;

    const newUser: User = {
      id: userId,
      name: userRequest.name,
      email: userRequest.email,
      role: userRequest.role,
      department: userRequest.department,
      profileImageUrl: "/placeholder.svg"
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
      username,
      password,
      name: userRequest.name,
      email: userRequest.email,
      role: userRequest.role,
    };
  };

  // Update user profile
  const updateUserProfile = (updatedUser: User) => {
    // Find the username for the given user ID
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
