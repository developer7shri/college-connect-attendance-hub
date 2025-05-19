
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
  FileText,
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
    href: "/qr-scanner",
    icon: QrCode,
    roles: ["student"],
  },
  {
    label: "QR Generator",
    href: "/qr-generator",
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
    label: "Reports",
    href: "/reports",
    icon: FileText,
    roles: ["admin", "hod", "teacher"],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["admin", "hod", "teacher", "student"],
  },
];

const Sidebar: React.FC = () => {
  const { authState } = useAuth();
  const { user } = authState;

  if (!user) return null;

  const filteredNavItems = navItems.filter((item) => 
    item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-white border-r border-border">
      <nav className="p-4 space-y-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-scahts-50 text-scahts-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              )
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
