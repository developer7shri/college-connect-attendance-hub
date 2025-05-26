
import { User, UserRole, GeneratedCredentials, UserCreationRequest } from "@/types";

// Auth state interface
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Auth context interface
export interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<User | null>; // Updated return type
  logout: () => void;
  register: (userData: UserCreationRequest) => Promise<boolean>; // Added register method
  updateProfile: (user: User) => void;
  updateUserProfile: (user: User) => void; 
  createUser: (userRequest: UserCreationRequest) => GeneratedCredentials | null;
  getAllUsers: () => User[];
  getUsersByDepartment: (department: string) => User[];
  getUsersByRole: (role: UserRole) => User[];
  departments: string[];
  addDepartment: (name: string) => void;
  updatePassword: (data: UpdatePasswordData) => Promise<boolean>; // Added updatePassword
}

// Interface for password update data
export interface UpdatePasswordData {
  oldPassword: string;
  newPassword: string;
}

// User data structure for storage
export interface UserData {
  password: string;
  user: User;
}
