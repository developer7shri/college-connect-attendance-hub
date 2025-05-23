
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserPlus, Calendar, CheckSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AddTeacherDialog from "@/components/dialogs/AddTeacherDialog";

const HODDashboard: React.FC = () => {
  const { authState, getUsersByDepartment } = useAuth();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  // This would be fetched from API in a real application
  const dashboardStats = {
    totalTeachers: getUsersByDepartment(authState.user?.department || "").filter(u => u.role === "teacher").length,
    totalStudents: getUsersByDepartment(authState.user?.department || "").filter(u => u.role === "student").length,
    teachersPresent: 10,
    teachersAbsent: 2,
    pendingLeaves: 5,
  };

  const handleAddTeacher = () => {
    setDialogOpen(true);
  };

  const handleMarkTeacherAttendance = () => {
    navigate("/hod/attendance");
  };

  const handleReviewLeaveRequests = () => {
    navigate("/hod/leave");
  };

  const handleManageStudents = () => {
    navigate("/hod/students");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">HOD Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to SCAHTS HOD dashboard. Manage teachers, students, and department activities.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">
              Teachers in your department
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Students in your department
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{dashboardStats.teachersPresent}</div>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{dashboardStats.teachersAbsent}</div>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Leave Requests</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.pendingLeaves}</div>
            <p className="text-xs text-muted-foreground">
              Requests awaiting your approval
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest department activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Added new teacher", subject: "Data Structures", time: "2 hours ago" },
                { action: "Approved leave request", subject: "Prof. Sharma", time: "5 hours ago" },
                { action: "Updated timetable", subject: "Semester 4", time: "1 day ago" },
                { action: "Completed teacher attendance", subject: "Today's record", time: "2 days ago" },
              ].map((activity, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.subject}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used HOD operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleAddTeacher}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Teacher
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleMarkTeacherAttendance}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                Mark Teacher Attendance
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleReviewLeaveRequests}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Review Leave Requests
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleManageStudents}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Students
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Teacher Dialog */}
      <AddTeacherDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default HODDashboard;
