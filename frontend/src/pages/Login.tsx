
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { authState, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    setIsLoading(true);

    try {
      const loggedInUser = await login(username, password); // `username` is the email input
      
      if (loggedInUser) { // If login was successful and we got a user object
        toast.info("Redirecting to your dashboard..."); // Changed from success to info for variation
        switch (loggedInUser.role) {
          case "Admin":
            navigate("/admin/dashboard", { replace: true });
            break;
          case "HOD":
            navigate("/hod/dashboard", { replace: true });
            break;
          case "Teacher":
            navigate("/teacher/dashboard", { replace: true });
            break;
          case "Student":
            navigate("/student/dashboard", { replace: true });
            break;
          default:
            navigate("/dashboard", { replace: true }); // Fallback
            break;
        }
      } else {
        // Login failed. AuthProvider's login function should have handled
        // error toasts and state reset. No specific error toast needed here.
      }
    } catch (error) { // This catch is for unexpected errors during the login() call itself
      toast.error("An unexpected error occurred during the login process.");
      console.error("Login page handleSubmit error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // The declarative redirect block for already authenticated users has been removed.
  // Navigation for authenticated users trying to access /login will be handled by App.tsx or MainLayout.

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-scahts-700 flex items-center justify-center gap-2">
            <div className="bg-scahts-700 text-white font-bold p-2 rounded">
              SCAHTS
            </div>
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            College Attendance & Mentoring System
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username / USN</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username or USN"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="text-sm font-medium text-scahts-600 hover:text-scahts-700"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-scahts-700 hover:bg-scahts-800"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        
      </div>
    </div>
  );
};

export default Login;
