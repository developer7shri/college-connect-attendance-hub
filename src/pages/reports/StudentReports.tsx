
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const StudentReports: React.FC = () => {
  const { toast } = useToast();
  const [selectedSemester, setSelectedSemester] = useState("current");
  
  // Mock data for reports
  const attendanceData = [
    { subject: "Data Structures", attendance: 85 },
    { subject: "Database Systems", attendance: 78 },
    { subject: "Computer Networks", attendance: 92 },
    { subject: "Web Development", attendance: 88 },
    { subject: "Operating Systems", attendance: 75 },
    { subject: "Software Engineering", attendance: 82 },
  ];
  
  const performanceData = [
    { subject: "Data Structures", internal: 45, external: 38, max: 50 },
    { subject: "Database Systems", internal: 42, external: 35, max: 50 },
    { subject: "Computer Networks", internal: 47, external: 40, max: 50 },
    { subject: "Web Development", internal: 44, external: 42, max: 50 },
    { subject: "Operating Systems", internal: 40, external: 36, max: 50 },
    { subject: "Software Engineering", internal: 43, external: 39, max: 50 },
  ];
  
  const semesterData = {
    credits: 24,
    sgpa: 8.7,
    cgpa: 8.5,
    rank: 5,
    classStrength: 60,
  };

  const downloadReport = (reportType: string) => {
    toast({
      title: "Downloading Report",
      description: `Your ${reportType} report is being downloaded`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Academic Reports</h1>
        <p className="text-muted-foreground">
          View your academic reports and performance metrics
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Semester</SelectItem>
            <SelectItem value="sem3">Semester 3</SelectItem>
            <SelectItem value="sem2">Semester 2</SelectItem>
            <SelectItem value="sem1">Semester 1</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => downloadReport("consolidated")}>
          <Download className="mr-2 h-4 w-4" />
          Download All Reports
        </Button>
      </div>

      <Tabs defaultValue="marks">
        <TabsList>
          <TabsTrigger value="marks">Marks</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="semester">Semester Report</TabsTrigger>
        </TabsList>

        <TabsContent value="marks" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>
                Your internal and external assessment marks for {selectedSemester === "current" ? "the current semester" : `semester ${selectedSemester.replace("sem", "")}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar name="Internal" dataKey="internal" fill="#4f46e5" />
                    <Bar name="External" dataKey="external" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="font-medium">Detailed Marks</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Subject</th>
                        <th className="text-center py-3">Internal (50)</th>
                        <th className="text-center py-3">External (50)</th>
                        <th className="text-center py-3">Total (100)</th>
                        <th className="text-center py-3">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceData.map((subject, index) => {
                        const total = subject.internal + subject.external;
                        let grade = "F";
                        if (total >= 90) grade = "S";
                        else if (total >= 80) grade = "A";
                        else if (total >= 70) grade = "B";
                        else if (total >= 60) grade = "C";
                        else if (total >= 50) grade = "D";
                        else if (total >= 40) grade = "E";
                        
                        return (
                          <tr key={index} className="border-b">
                            <td className="py-3">{subject.subject}</td>
                            <td className="text-center py-3">{subject.internal}</td>
                            <td className="text-center py-3">{subject.external}</td>
                            <td className="text-center py-3">{total}</td>
                            <td className="text-center py-3 font-medium">{grade}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadReport("marks")}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Download Marks Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Report</CardTitle>
              <CardDescription>
                Your attendance percentage across different subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={attendanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar 
                      dataKey="attendance" 
                      name="Attendance %" 
                      fill={(data) => data.attendance >= 75 ? "#10b981" : "#ef4444"}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="font-medium">Detailed Attendance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Subject</th>
                        <th className="text-center py-3">Classes Held</th>
                        <th className="text-center py-3">Classes Attended</th>
                        <th className="text-center py-3">Percentage</th>
                        <th className="text-center py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((subject, index) => {
                        const classesHeld = Math.floor(Math.random() * 20) + 30; // Random number between 30-50
                        const classesAttended = Math.floor(classesHeld * subject.attendance / 100);
                        
                        return (
                          <tr key={index} className="border-b">
                            <td className="py-3">{subject.subject}</td>
                            <td className="text-center py-3">{classesHeld}</td>
                            <td className="text-center py-3">{classesAttended}</td>
                            <td className="text-center py-3">{subject.attendance}%</td>
                            <td className={`text-center py-3 font-medium ${subject.attendance >= 75 ? "text-green-600" : "text-red-600"}`}>
                              {subject.attendance >= 75 ? "Good" : "Low"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadReport("attendance")}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Download Attendance Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semester" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Semester Report</CardTitle>
              <CardDescription>
                Overall performance for {selectedSemester === "current" ? "the current semester" : `semester ${selectedSemester.replace("sem", "")}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>SGPA</CardDescription>
                    <CardTitle className="text-3xl">{semesterData.sgpa}</CardTitle>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>CGPA</CardDescription>
                    <CardTitle className="text-3xl">{semesterData.cgpa}</CardTitle>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Credits Earned</CardDescription>
                    <CardTitle className="text-3xl">{semesterData.credits}</CardTitle>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Class Rank</CardDescription>
                    <CardTitle className="text-3xl">{semesterData.rank}/{semesterData.classStrength}</CardTitle>
                  </CardHeader>
                </Card>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-4">Semester Performance Trend</h3>
                
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Semester 1", sgpa: 8.2 },
                        { name: "Semester 2", sgpa: 8.4 },
                        { name: "Semester 3", sgpa: 8.1 },
                        { name: "Semester 4", sgpa: 8.7 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Bar dataKey="sgpa" fill="#4f46e5" name="SGPA" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadReport("semester")}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    Download Semester Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentReports;
