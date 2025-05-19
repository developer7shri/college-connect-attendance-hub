
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  
  useEffect(() => {
    // Redirect based on authentication status
    if (authState.isAuthenticated && authState.user) {
      // Redirect to appropriate dashboard
      switch (authState.user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "hod":
          navigate("/hod/dashboard");
          break;
        case "teacher":
          navigate("/teacher/dashboard");
          break;
        case "student":
          navigate("/student/dashboard");
          break;
        default:
          navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [authState, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
          <div className="bg-scahts-700 text-white font-bold p-2 rounded">
            SCAHTS
          </div>
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          College Attendance & Mentoring System
        </p>
        <div className="mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scahts-600 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
