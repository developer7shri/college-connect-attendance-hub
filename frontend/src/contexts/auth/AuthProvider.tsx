
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthState, User, UserRole, GeneratedCredentials, UserCreationRequest } from "@/types";
import { toast } from "sonner";
import { AuthContextType, UpdatePasswordData } from "./types"; // Imported UpdatePasswordData
import apiClient from '../../lib/api';
import { DUMMY_USERS, DEPARTMENTS } from "./mockData";
import { useUserManagement } from "./userManagement";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const [departments, setDepartments] = useState<string[]>(DEPARTMENTS);

  // Initialize user management
  const {
    allUsers,
    setAllUsers,
    createUser: createUserInternal,
    updateUserProfile: updateUserProfileInternal,
    getAllUsers,
    getUsersByDepartment,
    getUsersByRole,
    addDepartment: addDepartmentInternal
  } = useUserManagement(DUMMY_USERS);

  useEffect(() => {
    const storedUserJSON = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUserJSON && storedToken) { // Check for both user and token
      try {
        const user = JSON.parse(storedUserJSON);
        setAuthState({
          user,
          isAuthenticated: true, // User and token exist
          isLoading: false,
        });
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token"); // Clear token if user data is corrupted
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      // If either user or token is missing, consider the user logged out
      localStorage.removeItem("user"); // Clean up inconsistent storage
      localStorage.removeItem("token");
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
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

    // Load departments from localStorage
    const storedDepartments = localStorage.getItem("departments");
    if (storedDepartments) {
      try {
        setDepartments(JSON.parse(storedDepartments));
      } catch (error) {
        console.error("Error parsing stored departments:", error);
      }
    } else {
      // Initialize localStorage with default departments
      localStorage.setItem("departments", JSON.stringify(DEPARTMENTS));
    }
  }, []);

  // useEffect to manage loading user lists (all users for Admin, DUMMY_USERS for others)
  useEffect(() => {
    const loadUserData = async () => {
      // This condition handles authenticated users
      if (authState.isAuthenticated && authState.user) {
        if (authState.user.role === 'Admin') {
          // Current user is Admin: Fetch all users from API
          setAuthState(prevState => ({ ...prevState, isLoading: true }));
          try {
            const response = await apiClient.get<User[]>('/admin/users');
            const usersRecord = Object.fromEntries(
              response.data.map(u => [u.email, { user: u }])
            );
            setAllUsers(usersRecord); // This comes from useUserManagement
            toast.success("All users loaded for Admin.");
          } catch (error: any) {
            console.error("Error fetching all users for admin:", error);
            toast.error(error.response?.data?.message || "Failed to fetch users for admin.");
            // Optionally, if admin user fetch fails, revert to DUMMY_USERS or an empty set
            // setAllUsers(DUMMY_USERS); 
          } finally {
            setAuthState(prevState => ({ ...prevState, isLoading: false }));
          }
        } else {
          // Current user is authenticated but not an Admin: load DUMMY_USERS
          setAllUsers(DUMMY_USERS);
        }
      } else if (authState.isAuthenticated === false) { 
        // Current user is explicitly logged out (isAuthenticated is false, not null)
        // Load DUMMY_USERS upon logout.
        setAllUsers(DUMMY_USERS);
      }
      // If authState.isAuthenticated is null (initial loading state), do nothing here,
      // let the initial useEffect that loads from localStorage handle the very first load.
    };

    // Only run loadUserData if isAuthenticated is determined (true or false, but not null)
    if (authState.isAuthenticated !== null) {
      loadUserData();
    }
    // Update dependency array
  }, [authState.isAuthenticated, authState.user?.role, setAllUsers]);


  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState(prevState => ({ ...prevState, isLoading: true }));
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      // Assuming backend returns token and user object directly in response.data
      const { token, ...apiUser } = response.data; 

      if (token && apiUser && apiUser._id) { // Check for token and essential user identifier
        localStorage.setItem('token', token);

        // Map backend user fields to frontend User type
        const frontendUser: User = {
          id: apiUser._id,
          name: `${apiUser.firstName} ${apiUser.lastName}`,
          email: apiUser.email,
          role: apiUser.role,
          firstName: apiUser.firstName,
          lastName: apiUser.lastName,
          department: apiUser.department,
          phone: apiUser.phoneNumber,
          usn: apiUser.usn,
          semester: apiUser.semester,
          isPasswordDefault: apiUser.isPasswordDefault,
          createdAt: apiUser.createdAt,
          updatedAt: apiUser.updatedAt,
          // profileImageUrl, subjects, classes are not in login response
        };

        localStorage.setItem('user', JSON.stringify(frontendUser));
        
        setAuthState({
          user: frontendUser,
          isAuthenticated: true,
          isLoading: false,
        });
        toast.success('Login successful!');
        return true;
      } else {
        // Handle cases where response might not be as expected
        toast.error('Login failed: Invalid response from server.');
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      localStorage.removeItem('token'); // Clear token on failed login
      localStorage.removeItem('user');  // Clear user data on failed login
      return false;
    } finally {
      setAuthState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  const updatePassword = async (data: UpdatePasswordData): Promise<boolean> => {
    if (!authState.isAuthenticated || !authState.user) {
      toast.error("You must be logged in to update your password.");
      return false;
    }
    // Optional: Add client-side validation for newPassword length if desired,
    // though the backend also validates it.
    // if (data.newPassword.length < 6) {
    //   toast.error("New password must be at least 6 characters long.");
    //   return false;
    // }

    setAuthState(prevState => ({ ...prevState, isLoading: true })); // Or a more specific loading state like isUpdatingPassword
    try {
      const response = await apiClient.put('/auth/update-password', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      if (response.status === 200 && response.data?.message) {
        toast.success(response.data.message || 'Password updated successfully!');
        // If isPasswordDefault was part of user state and backend confirms it's now false, update it.
        // This requires the backend to send back the updated user or a confirmation.
        // For now, we assume the user object in authState might have an isPasswordDefault flag.
        if (authState.user && authState.user.isPasswordDefault) {
          const updatedUser = { ...authState.user, isPasswordDefault: false };
          setAuthState(prevState => ({ ...prevState, user: updatedUser, isLoading: false }));
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } else {
          setAuthState(prevState => ({ ...prevState, isLoading: false }));
        }
        return true;
      } else {
        toast.error(response.data?.message || 'Password update failed. Please try again.');
        setAuthState(prevState => ({ ...prevState, isLoading: false }));
        return false;
      }
    } catch (error: any) {
      console.error('Update password error:', error);
      const errorMessage = error.response?.data?.message || 'Password update failed. An unexpected error occurred.';
      toast.error(errorMessage);
      setAuthState(prevState => ({ ...prevState, isLoading: false }));
      return false;
    }
  };

  const register = async (userData: UserCreationRequest): Promise<boolean> => {
    setAuthState(prevState => ({ ...prevState, isLoading: true }));
    try {
      // The backend expects fields like firstName, lastName, etc.
      // Ensure UserCreationRequest matches the backend API contract for /api/auth/register
      const response = await apiClient.post('/auth/register', userData);

      if (response.status === 201 && response.data) {
        // Backend sends back user object and token upon successful registration
        // For this basic version, we will not automatically log the user in.
        // We'll just show a success message.
        toast.success('Registration successful! Please log in.');
        // Optionally, you could store the new user in 'allUsers' if still using it for some listings,
        // but primary user management should move to backend calls.
        // Example: setAllUsers(prevUsers => ({ ...prevUsers, [response.data.email]: { user: response.data, password: '' } }));
        return true;
      } else {
        toast.error(response.data?.message || 'Registration failed. Please try again.');
        return false;
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. An unexpected error occurred.';
      toast.error(errorMessage);
      return false;
    } finally {
      setAuthState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  const logout = () => {
    // Clear user and token from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Added this line
    
    // Update state
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast.info("You have been logged out."); // Optional: Add a toast message
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

  // Add department function
  const addDepartment = (name: string) => {
    if (departments.includes(name)) {
      toast.error("Department already exists");
      return;
    }
    
    const updatedDepartments = [...departments, name];
    setDepartments(updatedDepartments);
    localStorage.setItem("departments", JSON.stringify(updatedDepartments));
    addDepartmentInternal(name);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        authState, 
        login, 
        logout,
        register, // Added register function
        updateProfile, 
        createUser,
        getAllUsers,
        getUsersByDepartment,
        getUsersByRole,
        departments,
        updateUserProfile,
        addDepartment,
        updatePassword // Added updatePassword function
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
