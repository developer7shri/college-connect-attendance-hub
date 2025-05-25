
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserRole } from "@/types";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MainLayoutProps {
  allowedRoles?: UserRole[];
}

const MainLayout: React.FC<MainLayoutProps> = ({ allowedRoles }) => {
  const { authState } = useAuth();
  const { isAuthenticated, isLoading, user } = authState;
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

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
        redirectPath = "/admin/dashboard";
        break;
      case "hod":
        redirectPath = "/hod/dashboard";
        break;
      case "teacher":
        redirectPath = "/teacher/dashboard";
        break;
      case "student":
        redirectPath = "/student/dashboard";
        break;
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="flex">
        {isMobile ? (
          <>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="fixed bottom-4 right-4 z-40 md:hidden">
                <Button size="icon" className="rounded-full shadow-lg">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <div className="h-full overflow-y-auto">
                  <Sidebar onNavigation={() => setMobileMenuOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <Sidebar />
        )}
        <main className="flex-1 p-4 md:p-6 w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
