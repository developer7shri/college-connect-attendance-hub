
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthState, User, UserRole, GeneratedCredentials, UserCreationRequest } from "@/types";
import { toast } from "@/components/ui/sonner";

// Dummy users for demo purposes (will be replaced with API calls)
const DUMMY_USERS: Record<string, { password: string; user: User }> = {
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

interface AuthContextType {
  authState: AuthState;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (user: User) => void;
  createUser: (userRequest: UserCreationRequest) => GeneratedCredentials | null;
  getAllUsers: () => User[];
  getUsersByDepartment: (department: string) => User[];
  getUsersByRole: (role: UserRole) => User[];
  departments: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const [allUsers, setAllUsers] = useState<Record<string, { password: string; user: User }>>(DUMMY_USERS);
  const [departments] = useState<string[]>([
    "Computer Science", 
    "Mechanical Engineering", 
    "Electrical Engineering", 
    "Civil Engineering", 
    "Electronics Engineering"
  ]);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }

    // Load users from localStorage if any
    const storedUsers = localStorage.getItem("allUsers");
    if (storedUsers) {
      try {
        setAllUsers(JSON.parse(storedUsers));
      } catch (error) {
        console.error("Error parsing stored users:", error);
      }
    } else {
      // Initialize localStorage with dummy users
      localStorage.setItem("allUsers", JSON.stringify(allUsers));
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("allUsers", JSON.stringify(allUsers));
  }, [allUsers]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Check if user exists in dummy data
    const userData = allUsers[username];
    
    if (userData && userData.password === password) {
      // Login successful
      const { user } = userData;
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    // Clear user from localStorage
    localStorage.removeItem("user");
    
    // Update state
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateProfile = (user: User) => {
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
    localStorage.setItem("user", JSON.stringify(user));
    
    // Update the user in allUsers as well
    const username = Object.keys(allUsers).find(
      (key) => allUsers[key].user.id === user.id
    );
    
    if (username) {
      setAllUsers((prev) => ({
        ...prev,
        [username]: {
          ...prev[username],
          user,
        },
      }));
    }
  };

  // Helper to generate a random string (for password)
  const generateRandomString = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Generate username based on role and name
  const generateUsername = (role: UserRole, name: string, department: string): string => {
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

  // Create a new user (restricted by current user's role)
  const createUser = (userRequest: UserCreationRequest): GeneratedCredentials | null => {
    const currentUser = authState.user;
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
      toast({
        title: "Permission Denied",
        description: "You don't have permission to create this type of user",
        variant: "destructive"
      });
      return null;
    }

    // Generate username and password
    const username = generateUsername(userRequest.role, userRequest.name, userRequest.department);
    // Check if username already exists
    if (allUsers[username]) {
      toast({
        title: "Error Creating User",
        description: "Username already exists in the system",
        variant: "destructive"
      });
      return null;
    }

    const password = userRequest.role === 'student' ? username : generateRandomString(8);
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
    setAllUsers(prev => ({
      ...prev,
      [username]: {
        password,
        user: newUser
      }
    }));

    toast({
      title: "User Created Successfully",
      description: `Created ${userRequest.role}: ${userRequest.name}`,
    });

    return {
      username,
      password,
      name: userRequest.name,
      email: userRequest.email,
      role: userRequest.role,
    };
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

  return (
    <AuthContext.Provider 
      value={{ 
        authState, 
        login, 
        logout, 
        updateProfile, 
        createUser,
        getAllUsers,
        getUsersByDepartment,
        getUsersByRole,
        departments
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
