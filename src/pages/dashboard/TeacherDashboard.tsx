
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, QrCode, UserCheck, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GeneratedCredentials } from "@/types";

const studentFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  semester: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 8, {
    message: "Semester must be between 1 and 8.",
  }),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authState, getUsersByDepartment, createUser } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<GeneratedCredentials | null>(null);
  
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      semester: "1",
    },
  });
  
  // This would be fetched from API in a real application
  const dashboardStats = {
    totalStudents: getUsersByDepartment(authState.user?.department || "").filter(u => u.role === "student").length,
    studentsPresent: 52,
    studentsAbsent: 8,
    pendingLeaves: 3,
    mentees: 10,
  };

  function onSubmit(data: StudentFormValues) {
    if (!authState.user?.department) return;
    
    const credentials = createUser({
      name: data.name,
      email: data.email,
      department: authState.user.department,
      role: "student",
      semester: Number(data.semester),
    });

    if (credentials) {
      setCreatedCredentials(credentials);
    }
  }

  const handleGenerateQR = () => {
    navigate("/teacher/qr-generator");
  };

  const handleAddStudent = () => {
    setCreatedCredentials(null);
    setDialogOpen(true);
  };

  const handleReviewLeaveRequests = () => {
    navigate("/teacher/leave");
  };

  const handleMenteeUpdates = () => {
    navigate("/teacher/mentoring");
    toast({
      title: "Mentee Section",
      description: "Viewing your mentees information",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to SCAHTS teacher dashboard. Manage your classes, attendance, and mentees.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Students in your classes
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
                <div className="text-2xl font-bold">{dashboardStats.studentsPresent}</div>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{dashboardStats.studentsAbsent}</div>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Mentees</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.mentees}</div>
            <p className="text-xs text-muted-foreground">
              Students under your mentorship
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
            <CardDescription>
              Your scheduled classes for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { subject: "Data Structures", class: "CS-3A", time: "10:00 AM - 11:00 AM", status: "Completed" },
                { subject: "Database Management", class: "CS-5B", time: "11:15 AM - 12:15 PM", status: "Upcoming" },
                { subject: "Programming Lab", class: "CS-2A", time: "2:00 PM - 4:00 PM", status: "Upcoming" },
              ].map((session, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{session.subject}</p>
                    <p className="text-xs text-muted-foreground">{session.class}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{session.time}</p>
                    <p className={`text-xs ${session.status === "Completed" ? "text-green-600" : "text-amber-600"}`}>
                      {session.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used teacher operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleGenerateQR}
              >
                <QrCode className="mr-2 h-4 w-4" />
                Generate QR Code
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={handleAddStudent}
              >
                <Users className="mr-2 h-4 w-4" />
                Add Student
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
                onClick={handleMenteeUpdates}
              >
                <User className="mr-2 h-4 w-4" />
                Mentee Updates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Student Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Create a new student account for your department. The system will generate credentials.
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
                        <Input placeholder="Student Name" {...field} />
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
                        <Input placeholder="student@scahts.edu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a semester" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <SelectItem key={sem} value={String(sem)}>Semester {sem}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Create Student Account</Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <div className="border rounded p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Student Account Created</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Name:</div>
                  <div>{createdCredentials.name}</div>
                  <div className="text-muted-foreground">USN/Username:</div>
                  <div className="font-mono">{createdCredentials.username}</div>
                  <div className="text-muted-foreground">Password:</div>
                  <div className="font-mono">{createdCredentials.password}</div>
                  <div className="text-muted-foreground">Email:</div>
                  <div>{createdCredentials.email}</div>
                  <div className="text-muted-foreground">Department:</div>
                  <div>{authState.user?.department}</div>
                  <div className="text-muted-foreground">Semester:</div>
                  <div>{form.getValues().semester}</div>
                </div>
                <p className="text-xs mt-4 text-amber-500">
                  Note: Student's initial password is the same as their USN.
                </p>
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

export default TeacherDashboard;
