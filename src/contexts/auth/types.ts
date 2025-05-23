
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
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (user: User) => void;
  updateUserProfile: (user: User) => void; 
  createUser: (userRequest: UserCreationRequest) => GeneratedCredentials | null;
  getAllUsers: () => User[];
  getUsersByDepartment: (department: string) => User[];
  getUsersByRole: (role: UserRole) => User[];
  departments: string[];
}

// User data structure for storage
export interface UserData {
  password: string;
  user: User;
}
