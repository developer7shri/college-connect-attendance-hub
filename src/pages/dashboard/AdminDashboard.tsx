
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { GeneratedCredentials } from "@/types";
import { 
  DashboardStats, 
  RecentActivities, 
  QuickActions,
  AddHODDialog
} from "./admin";

type HODFormValues = {
  name: string;
  email: string;
  password: string;
  department: string;
};

const AdminDashboard: React.FC = () => {
  const { getUsersByRole, createUser, departments } = useAuth();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  // This would be fetched from API in a real application
  const dashboardStats = {
    totalDepartments: departments.length,
    totalTeachers: getUsersByRole("teacher").length,
    totalStudents: getUsersByRole("student").length,
    totalHODs: getUsersByRole("hod").length,
    pendingApprovals: 8,
  };

  const recentActivities = [
    { action: "Added new HOD", department: "Mechanical Eng.", time: "2 hours ago" },
    { action: "Updated teacher permissions", department: "Computer Science", time: "5 hours ago" },
    { action: "Created new department", department: "Electronics Eng.", time: "1 day ago" },
    { action: "Updated system settings", department: "All departments", time: "2 days ago" },
  ];

  const handleAddHOD = () => {
    setDialogOpen(true);
  };

  const handleCreateDepartment = () => {
    navigate("/admin/departments");
  };

  const handleManageTeachers = () => {
    navigate("/admin/teachers");
  };

  const handleGenerateReports = () => {
    navigate("/admin/reports");
  };

  const handleSubmitHODForm = (data: HODFormValues): GeneratedCredentials | null => {
    return createUser({
      name: data.name,
      email: data.email,
      password: data.password,
      department: data.department,
      role: "hod"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to SCAHTS admin dashboard. Manage departments, HODs, and system settings.
        </p>
      </div>

      <DashboardStats 
        totalDepartments={dashboardStats.totalDepartments}
        totalHODs={dashboardStats.totalHODs}
        totalTeachers={dashboardStats.totalTeachers}
        totalStudents={dashboardStats.totalStudents}
        pendingApprovals={dashboardStats.pendingApprovals}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivities activities={recentActivities} />
        
        <QuickActions
          onAddHOD={handleAddHOD}
          onCreateDepartment={handleCreateDepartment}
          onManageTeachers={handleManageTeachers}
          onGenerateReports={handleGenerateReports}
        />
      </div>

      <AddHODDialog
        open={dialogOpen}
        departments={departments}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmitHODForm}
      />
    </div>
  );
};

export default AdminDashboard;
