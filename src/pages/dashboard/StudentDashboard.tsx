
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, CheckSquare, QrCode, User } from "lucide-react";

const StudentDashboard: React.FC = () => {
  // This would be fetched from API in a real application
  const dashboardStats = {
    totalSubjects: 6,
    attendancePercentage: 85,
    absentCount: 12,
    leaveRequests: 2,
  };

  const subjects = [
    { name: "Data Structures", code: "CS301", attendance: 92 },
    { name: "Database Systems", code: "CS302", attendance: 78 },
    { name: "Computer Networks", code: "CS303", attendance: 88 },
    { name: "Web Development", code: "CS304", attendance: 95 },
    { name: "Software Engineering", code: "CS305", attendance: 82 },
    { name: "Operating Systems", code: "CS306", attendance: 75 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to SCAHTS student dashboard. Track your attendance and academic progress.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalSubjects}</div>
            <p className="text-xs text-muted-foreground">
              Enrolled this semester
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.attendancePercentage}%</div>
            <p className="text-xs text-muted-foreground">
              Across all subjects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Absents</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.absentCount}</div>
            <p className="text-xs text-muted-foreground">
              Classes missed this semester
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.leaveRequests}</div>
            <p className="text-xs text-muted-foreground">
              Pending leave applications
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subject Attendance</CardTitle>
            <CardDescription>
              Your attendance percentage by subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjects.map((subject, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <p className="text-sm font-medium">{subject.name}</p>
                      <p className="text-xs text-muted-foreground">{subject.code}</p>
                    </div>
                    <div className="text-sm font-medium">{subject.attendance}%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        subject.attendance >= 85 
                          ? 'bg-green-500' 
                          : subject.attendance >= 75 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                      }`} 
                      style={{ width: `${subject.attendance}%` }}
                    ></div>
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
              Frequently used student operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start">
                <QrCode className="mr-2 h-4 w-4" />
                Scan QR Code
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Apply for Leave
              </Button>
              <Button variant="outline" className="justify-start">
                <User className="mr-2 h-4 w-4" />
                Contact Mentor
              </Button>
              <Button variant="outline" className="justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                View Marks
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Mentor</CardTitle>
          <CardDescription>
            Information about your assigned mentor
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center text-gray-700 text-xl font-bold">
            PS
          </div>
          <div>
            <h3 className="font-medium">Prof. Pradeep Sharma</h3>
            <p className="text-sm text-muted-foreground">Data Structures & Algorithms</p>
            <p className="text-xs text-muted-foreground mt-1">Email: p.sharma@scahts.edu</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
