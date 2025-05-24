
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthState, User, UserRole, GeneratedCredentials, UserCreationRequest } from "@/types";
import { toast } from "@/components/ui/sonner";
import { AuthContextType } from "./types";
import { DUMMY_USERS, DEPARTMENTS } from "./mockData";
import { useUserManagement } from "./userManagement";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const [departments] = useState<string[]>(DEPARTMENTS);

  // Initialize user management
  const {
    allUsers,
    setAllUsers,
    createUser: createUserInternal,
    updateUserProfile: updateUserProfileInternal,
    getAllUsers,
    getUsersByDepartment,
    getUsersByRole
  } = useUserManagement(DUMMY_USERS);

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
    
    // Also update the user in our users database
    updateUserProfile(user);
  };

  // Wrapper for the createUser function to pass the current user
  const createUser = (userRequest: UserCreationRequest): GeneratedCredentials | null => {
    return createUserInternal(userRequest, authState.user);
  };

  // Wrapper for updateUserProfile to pass current user
  const updateUserProfile = (updatedUser: User) => {
    updateUserProfileInternal(updatedUser, authState.user);
    
    // If updating current user, also update auth state
    if (authState.user && authState.user.id === updatedUser.id) {
      setAuthState({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
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
        departments,
        updateUserProfile
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
