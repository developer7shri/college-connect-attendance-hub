
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
      const success = await login(username, password);
      
      if (success && authState.user) { // Check authState.user here
        toast.success("Login successful. Redirecting...");
        switch (authState.user.role) {
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
      } else if (!success) { // Only handle !success if authState.user was not the issue
        toast.error("Invalid username or password"); // This might be redundant if login() already toasts
      }
    } catch (error) {
      toast.error("An error occurred during login");
      console.error(error);
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

        <div className="mt-4 text-center text-sm">
          <div className="text-gray-500">
            Demo accounts:
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
            <div className="bg-gray-100 p-2 rounded">
              <div className="font-bold">Admin</div>
              <div>Username: admin</div>
              <div>Password: admin123</div>
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <div className="font-bold">HOD</div>
              <div>Username: hod123</div>
              <div>Password: hod123</div>
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <div className="font-bold">Teacher</div>
              <div>Username: teacher</div>
              <div>Password: teacher123</div>
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <div className="font-bold">Student</div>
              <div>Username: CS001</div>
              <div>Password: CS001</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
