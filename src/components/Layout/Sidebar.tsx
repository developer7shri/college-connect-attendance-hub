
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import {
  Calendar,
  CheckSquare,
  Users,
  User,
  Settings,
  BookOpen,
  Home,
  QrCode,
  UserCircle
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["admin", "hod", "teacher", "student"],
  },
  {
    label: "Departments",
    href: "/departments",
    icon: BookOpen,
    roles: ["admin"],
  },
  {
    label: "Teachers",
    href: "/teachers",
    icon: Users,
    roles: ["admin", "hod"],
  },
  {
    label: "Students",
    href: "/students",
    icon: Users,
    roles: ["admin", "hod", "teacher"],
  },
  {
    label: "Attendance",
    href: "/attendance",
    icon: CheckSquare,
    roles: ["admin", "hod", "teacher", "student"],
  },
  {
    label: "QR Scanner",
    href: "/student/qr-scanner",
    icon: QrCode,
    roles: ["student"],
  },
  {
    label: "QR Generator",
    href: "/teacher/qr-generator",
    icon: QrCode,
    roles: ["teacher"],
  },
  {
    label: "Mentoring",
    href: "/mentoring",
    icon: User,
    roles: ["hod", "teacher", "student"],
  },
  {
    label: "Leave Management",
    href: "/leave",
    icon: Calendar,
    roles: ["hod", "teacher", "student"],
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserCircle,
    roles: ["admin", "hod", "teacher", "student"],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin", "hod", "teacher", "student"],
  },
];

interface SidebarProps {
  onNavigation?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigation }) => {
  const { authState } = useAuth();
  const { user } = authState;

  if (!user) return null;

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter((item) => 
    item.roles.includes(user.role)
  );

  // Get the base route for the current user role
  const getRoleBasePath = () => {
    switch (user.role) {
      case "admin": return "/admin";
      case "hod": return "/hod";
      case "teacher": return "/teacher";
      case "student": return "/student";
      default: return "";
    }
  };

  // Helper to correct dashboard links to point to role-specific dashboards
  const getCorrectPath = (item: NavItem) => {
    if (item.label === "Dashboard") {
      return `${getRoleBasePath()}/dashboard`;
    }
    
    // For other items, prepend the role-specific path if the href doesn't already contain it
    if (!item.href.startsWith(getRoleBasePath()) && 
        !item.href.includes('/qr-scanner') && 
        !item.href.includes('/qr-generator')) {
      return `${getRoleBasePath()}${item.href}`;
    }
    
    return item.href;
  };

  const handleNavClick = () => {
    if (onNavigation) {
      onNavigation();
    }
  };

  return (
    <aside className="w-64 h-full bg-white border-r border-border">
      <nav className="p-4 space-y-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={getCorrectPath(item)}
            onClick={handleNavClick}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-3 rounded-md transition-colors",
                isActive
                  ? "bg-scahts-50 text-scahts-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              )
            }
          >
            <item.icon size={18} />
            <span className="text-base">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
