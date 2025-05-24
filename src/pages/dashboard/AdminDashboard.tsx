
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types";
import { 
  DashboardStats, 
  RecentActivities, 
  QuickActions,
  EditHODDialog,
  ManageHODsTable 
} from "./admin";
import AddHODDialog from "./admin/AddHODDialog";
import { toast } from "@/components/ui/sonner";

type EditHODFormValues = {
  name: string;
  email: string;
  phone: string;
  department: string;
};

const AdminDashboard: React.FC = () => {
  const { getUsersByRole, departments, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedHOD, setSelectedHOD] = useState<User | null>(null);

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
    setAddDialogOpen(true);
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

  const handleEditHOD = (hod: User) => {
    setSelectedHOD(hod);
    setEditDialogOpen(true);
  };

  const handleUpdateHOD = (data: EditHODFormValues) => {
    if (!selectedHOD) return;
    
    const updatedUser: User = {
      ...selectedHOD,
      name: data.name,
      email: data.email,
      phone: data.phone,
      department: data.department
    };
    
    updateUserProfile(updatedUser);
    toast.success(`HOD ${data.name} has been updated successfully`);
  };

  const hods = getUsersByRole("hod");

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

      <ManageHODsTable 
        hods={hods} 
        onEdit={handleEditHOD} 
      />

      <AddHODDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />

      <EditHODDialog
        open={editDialogOpen}
        departments={departments}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleUpdateHOD}
        hod={selectedHOD}
      />
    </div>
  );
};

export default AdminDashboard;
