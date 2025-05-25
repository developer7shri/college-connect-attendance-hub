
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, Settings, User, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const TopBar: React.FC = () => {
  const { authState, logout } = useAuth();
  const { user } = authState;
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getHomePath = () => {
    if (!user) return "/";
    
    switch (user.role) {
      case "admin": return "/admin/dashboard";
      case "hod": return "/hod/dashboard";
      case "teacher": return "/teacher/dashboard";
      case "student": return "/student/dashboard";
      default: return "/";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white shadow-sm h-14 md:h-16 px-3 md:px-6">
      <div className="flex items-center gap-2">
        <Link to={getHomePath()} className="flex items-center gap-2">
          <div className="bg-scahts-700 text-white font-bold p-1.5 md:p-2 rounded">
            SCAHTS
          </div>
          <span className="text-base md:text-lg font-semibold hidden md:inline-block">
            College Attendance System
          </span>
          {isMobile && (
            <span className="text-sm font-semibold">
              Attendance
            </span>
          )}
        </Link>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 md:h-9 md:w-9"
          onClick={() => toast.info("No new notifications")}
        >
          <Bell size={isMobile ? 16 : 18} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 md:h-9 md:w-9 rounded-full">
              <Avatar className="h-8 w-8 md:h-9 md:w-9">
                <AvatarImage src={user?.profileImageUrl} alt={user?.name} />
                <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.info("Profile feature coming soon")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Settings feature coming soon")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
