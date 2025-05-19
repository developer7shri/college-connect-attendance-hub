
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "@/types";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface MainLayoutProps {
  allowedRoles?: UserRole[];
}

const MainLayout: React.FC<MainLayoutProps> = ({ allowedRoles }) => {
  const { authState } = useAuth();
  const { isAuthenticated, isLoading, user } = authState;

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    let redirectPath = "/";
    
    switch (user.role) {
      case "admin":
        redirectPath = "/admin";
        break;
      case "hod":
        redirectPath = "/hod";
        break;
      case "teacher":
        redirectPath = "/teacher";
        break;
      case "student":
        redirectPath = "/student";
        break;
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
