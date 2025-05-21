
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, UserPlus, CheckSquare, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GeneratedCredentials } from "@/types";

const hodFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  department: z.string().min(1, {
    message: "Please select a department.",
  })
});

type HODFormValues = z.infer<typeof hodFormSchema>;

const AdminDashboard: React.FC = () => {
  const { getUsersByRole, createUser, departments } = useAuth();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<GeneratedCredentials | null>(null);

  const form = useForm<HODFormValues>({
    resolver: zodResolver(hodFormSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
    },
  });

  // This would be fetched from API in a real application
  const dashboardStats = {
    totalDepartments: departments.length,
    totalTeachers: getUsersByRole("teacher").length,
    totalStudents: getUsersByRole("student").length,
    totalHODs: getUsersByRole("hod").length,
    pendingApprovals: 8,
  };

  function onSubmit(data: HODFormValues) {
    const credentials = createUser({
      name: data.name,
      email: data.email,
      department: data.department,
      role: "hod"
    });

    if (credentials) {
      setCreatedCredentials(credentials);
    }
  }

  const handleAddHOD = () => {
    setCreatedCredentials(null);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to SCAHTS admin dashboard. Manage departments, HODs, and system settings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalDepartments}</div>
            <p className="text-xs text-muted-foreground">
              Departments in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total HODs</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalHODs}</div>
            <p className="text-xs text-muted-foreground">
              Department heads in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">
              Active teachers across all departments
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
              Active students across all departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">
              Leave requests awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest system activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Added new HOD", department: "Mechanical Eng.", time: "2 hours ago" },
                { action: "Updated teacher permissions", department: "Computer Science", time: "5 hours ago" },
                { action: "Created new department", department: "Electronics Eng.", time: "1 day ago" },
                { action: "Updated system settings", department: "All departments", time: "2 days ago" },
              ].map((activity, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.department}</p>
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
              Frequently used admin operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleAddHOD}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add New HOD
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleCreateDepartment}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Create Department
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleManageTeachers}
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Teachers
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleGenerateReports}
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add HOD Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New HOD</DialogTitle>
            <DialogDescription>
              Create a new Head of Department account. The system will generate credentials.
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
                        <Input placeholder="Dr. John Doe" {...field} />
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
                        <Input placeholder="hod@scahts.edu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Create HOD Account</Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <div className="border rounded p-4 bg-muted/50">
                <h4 className="font-medium mb-2">HOD Account Created</h4>
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
                  <div>{form.getValues().department}</div>
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

export default AdminDashboard;
