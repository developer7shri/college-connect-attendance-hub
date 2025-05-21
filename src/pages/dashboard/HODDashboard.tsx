
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserPlus, Calendar, CheckSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GeneratedCredentials } from "@/types";

const teacherFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  })
});

type TeacherFormValues = z.infer<typeof teacherFormSchema>;

const HODDashboard: React.FC = () => {
  const { authState, getUsersByDepartment, createUser } = useAuth();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<GeneratedCredentials | null>(null);

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // This would be fetched from API in a real application
  const dashboardStats = {
    totalTeachers: getUsersByDepartment(authState.user?.department || "").filter(u => u.role === "teacher").length,
    totalStudents: getUsersByDepartment(authState.user?.department || "").filter(u => u.role === "student").length,
    teachersPresent: 10,
    teachersAbsent: 2,
    pendingLeaves: 5,
  };

  function onSubmit(data: TeacherFormValues) {
    if (!authState.user?.department) return;
    
    const credentials = createUser({
      name: data.name,
      email: data.email,
      department: authState.user.department,
      role: "teacher"
    });

    if (credentials) {
      setCreatedCredentials(credentials);
    }
  }

  const handleAddTeacher = () => {
    setCreatedCredentials(null);
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
            <DialogDescription>
              Create a new teacher account for your department. The system will generate credentials.
            </DialogDescription>
          </DialogHeader>

          {!createdCredentials ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@scahts.edu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Create Teacher Account</Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <div className="border rounded p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Teacher Account Created</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Name:</div>
                  <div>{createdCredentials.name}</div>
                  <div className="text-muted-foreground">Username:</div>
                  <div className="font-mono">{createdCredentials.username}</div>
                  <div className="text-muted-foreground">Password:</div>
                  <div className="font-mono">{createdCredentials.password}</div>
                  <div className="text-muted-foreground">Email:</div>
                  <div>{createdCredentials.email}</div>
                  <div className="text-muted-foreground">Department:</div>
                  <div>{authState.user?.department}</div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HODDashboard;
