
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthState, User, UserRole } from "@/types";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

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
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Check if user exists in dummy data
    const userData = DUMMY_USERS[username];
    
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
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, updateProfile }}>
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
