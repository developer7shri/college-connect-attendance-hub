
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";

// Sample data for the reports
const attendanceData = [
  { subject: "Mathematics", present: 42, absent: 4, total: 46 },
  { subject: "Physics", present: 38, absent: 8, total: 46 },
  { subject: "Chemistry", present: 40, absent: 6, total: 46 },
  { subject: "Computer Science", present: 44, absent: 2, total: 46 },
  { subject: "English", present: 39, absent: 7, total: 46 },
];

const performanceData = [
  { subject: "Mathematics", marks: 85, classAvg: 76 },
  { subject: "Physics", marks: 78, classAvg: 72 },
  { subject: "Chemistry", marks: 72, classAvg: 68 },
  { subject: "Computer Science", marks: 92, classAvg: 80 },
  { subject: "English", marks: 88, classAvg: 78 },
];

const progressData = [
  { month: "Jan", marks: 72 },
  { month: "Feb", marks: 76 },
  { month: "Mar", marks: 78 },
  { month: "Apr", marks: 75 },
  { month: "May", marks: 82 },
  { month: "Jun", marks: 87 },
  { month: "Jul", marks: 90 },
];

const StudentReports: React.FC = () => {
  const { authState } = useAuth();
  const [activeTab, setActiveTab] = useState("attendance");
  
  // Calculate attendance percentages
  const totalClasses = attendanceData.reduce((sum, subject) => sum + subject.total, 0);
  const totalPresent = attendanceData.reduce((sum, subject) => sum + subject.present, 0);
  const attendancePercentage = Math.round((totalPresent / totalClasses) * 100);
  
  // Calculate average performance
  const totalMarks = performanceData.reduce((sum, subject) => sum + subject.marks, 0);
  const averageMarks = Math.round(totalMarks / performanceData.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Reports</h1>
        <p className="text-muted-foreground">
          View your academic performance and attendance records
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{attendancePercentage}%</div>
              <div className={`rounded-full px-2 py-1 text-xs ${
                attendancePercentage >= 75 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}>
                {attendancePercentage >= 75 ? "Good Standing" : "Attention Required"}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalPresent} present out of {totalClasses} total classes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageMarks}/100</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <div className={`rounded-full px-2 py-1 ${
                averageMarks >= 60 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
              }`}>
                {averageMarks >= 80 ? "Excellent" : 
                 averageMarks >= 70 ? "Very Good" : 
                 averageMarks >= 60 ? "Good" : 
                 averageMarks >= 50 ? "Average" : "Needs Improvement"}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progress Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <Line 
                    type="monotone" 
                    dataKey="marks" 
                    stroke="#6366f1" 
                    strokeWidth={2} 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Attendance</CardTitle>
              <CardDescription>
                Your attendance record for each subject this semester
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={attendanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="present" 
                      name="Present" 
                      stackId="a" 
                      fill="#10b981" 
                    />
                    <Bar 
                      dataKey="absent" 
                      name="Absent" 
                      stackId="a" 
                      fill="#ef4444" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 space-y-4">
                {attendanceData.map((subject) => (
                  <div key={subject.subject} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{subject.subject}</h4>
                      <p className="text-sm text-muted-foreground">
                        {subject.present} of {subject.total} classes attended
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            (subject.present / subject.total) * 100 >= 75 
                              ? "bg-green-500" 
                              : "bg-red-500"
                          }`}
                          style={{ width: `${(subject.present / subject.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round((subject.present / subject.total) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
              <CardDescription>
                Your performance in each subject compared to class average
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="marks" 
                      name="Your Marks" 
                      fill="#6366f1" 
                    />
                    <Bar 
                      dataKey="classAvg" 
                      name="Class Average" 
                      fill="#9ca3af" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 space-y-4">
                {performanceData.map((subject) => (
                  <div key={subject.subject} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{subject.subject}</h4>
                      <p className="text-sm text-muted-foreground">
                        {subject.marks > subject.classAvg
                          ? `${subject.marks - subject.classAvg} marks above average`
                          : subject.marks < subject.classAvg
                          ? `${subject.classAvg - subject.marks} marks below average`
                          : "On par with class average"}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      {subject.marks}/100
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
              <CardDescription>
                Your performance trend over the current semester
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="marks"
                      name="Performance"
                      stroke="#6366f1"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Performance Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Your academic performance has shown a {
                    progressData[progressData.length - 1].marks > progressData[0].marks
                      ? "positive"
                      : "negative"
                  } trend over the semester with a {
                    Math.abs(progressData[progressData.length - 1].marks - progressData[0].marks)
                  }% {
                    progressData[progressData.length - 1].marks > progressData[0].marks
                      ? "improvement"
                      : "decline"
                  } from the beginning of the term.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentReports;
