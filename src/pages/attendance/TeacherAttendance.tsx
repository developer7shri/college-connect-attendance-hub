
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, Search, FileDown, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TeacherAttendance: React.FC = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState("cs3a");
  const [selectedSubject, setSelectedSubject] = useState("ds");
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for classes and subjects
  const classes = [
    { id: "cs3a", name: "CS 3A" },
    { id: "cs3b", name: "CS 3B" },
    { id: "cs5a", name: "CS 5A" },
  ];

  const subjects = [
    { id: "ds", name: "Data Structures" },
    { id: "dbms", name: "Database Management Systems" },
    { id: "cn", name: "Computer Networks" },
  ];

  // Mock data for students
  const students = [
    { id: "1", name: "John Doe", usn: "1XX22CS001", present: true },
    { id: "2", name: "Jane Smith", usn: "1XX22CS002", present: true },
    { id: "3", name: "Michael Johnson", usn: "1XX22CS003", present: false },
    { id: "4", name: "Emily Williams", usn: "1XX22CS004", present: true },
    { id: "5", name: "Robert Brown", usn: "1XX22CS005", present: true },
    { id: "6", name: "Sarah Davis", usn: "1XX22CS006", present: false },
    { id: "7", name: "Thomas Miller", usn: "1XX22CS007", present: true },
    { id: "8", name: "Lisa Wilson", usn: "1XX22CS008", present: true },
  ];

  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.usn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePresence = (studentId: string) => {
    // In a real app, this would update the state
    toast({
      title: "Attendance Updated",
      description: `Attendance status toggled for student ID: ${studentId}`,
    });
  };

  const handleSaveAttendance = () => {
    toast({
      title: "Attendance Saved",
      description: "The attendance has been saved successfully",
    });
  };

  const generateQRCode = () => {
    toast({
      title: "QR Code Generated",
      description: "Navigate to QR Generator page to share with students",
    });
  };

  const downloadReport = () => {
    toast({
      title: "Downloading Report",
      description: "Your attendance report is being downloaded",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance Management</h1>
        <p className="text-muted-foreground">
          Mark and manage student attendance records
        </p>
      </div>

      <Tabs defaultValue="mark">
        <TabsList>
          <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="mark" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mark Attendance</CardTitle>
              <CardDescription>
                Record attendance for your class
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="class">Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger id="class">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="date">Date</Label>
                  <div className="relative">
                    <Input 
                      id="date" 
                      type="date" 
                      value={date ? date.toISOString().split('T')[0] : ''} 
                      onChange={(e) => setDate(new Date(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between gap-4 flex-wrap">
                <div className="flex gap-2 items-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Mark all present
                      toast({
                        title: "All Present",
                        description: "All students marked as present",
                      });
                    }}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Mark All Present
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Mark all absent
                      toast({
                        title: "All Absent",
                        description: "All students marked as absent",
                      });
                    }}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Mark All Absent
                  </Button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name or USN"
                    className="pl-8 w-full md:w-auto"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted border-b">
                      <th className="text-left py-3 px-4">USN</th>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-center py-3 px-4">Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b">
                        <td className="py-3 px-4">{student.usn}</td>
                        <td className="py-3 px-4">{student.name}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => togglePresence(student.id)}
                              className={`rounded-full p-1 ${
                                student.present
                                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                                  : "bg-red-100 text-red-600 hover:bg-red-200"
                              }`}
                            >
                              {student.present ? (
                                <CheckCircle2 className="h-6 w-6" />
                              ) : (
                                <XCircle className="h-6 w-6" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={generateQRCode}
                >
                  Generate QR Code
                </Button>
                <Button onClick={handleSaveAttendance}>
                  Save Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports</CardTitle>
              <CardDescription>
                Generate and view attendance reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="reportClass">Class</Label>
                  <Select defaultValue={classes[0].id}>
                    <SelectTrigger id="reportClass">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="reportSubject">Subject</Label>
                  <Select defaultValue={subjects[0].id}>
                    <SelectTrigger id="reportSubject">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Period</Label>
                  <Select defaultValue="month">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="semester">This Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={downloadReport}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted border-b">
                      <th className="text-left py-3 px-4">USN</th>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-center py-3 px-4">Classes Attended</th>
                      <th className="text-center py-3 px-4">Total Classes</th>
                      <th className="text-center py-3 px-4">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => {
                      const attended = Math.floor(Math.random() * 10) + 15; // Random between 15-24
                      const total = 24;
                      const percentage = Math.round((attended / total) * 100);
                      
                      return (
                        <tr key={student.id} className="border-b">
                          <td className="py-3 px-4">{student.usn}</td>
                          <td className="py-3 px-4">{student.name}</td>
                          <td className="py-3 px-4 text-center">{attended}</td>
                          <td className="py-3 px-4 text-center">{total}</td>
                          <td className={`py-3 px-4 text-center font-medium ${
                            percentage >= 75 ? "text-green-600" : "text-red-600"
                          }`}>
                            {percentage}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Analytics</CardTitle>
              <CardDescription>
                Insights and trends about student attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Average Attendance</CardDescription>
                    <CardTitle className="text-3xl">85%</CardTitle>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Below 75%</CardDescription>
                    <CardTitle className="text-3xl">3 Students</CardTitle>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Perfect Attendance</CardDescription>
                    <CardTitle className="text-3xl">5 Students</CardTitle>
                  </CardHeader>
                </Card>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Class-wise Attendance</h3>
                
                <div className="space-y-2">
                  {classes.map((cls) => (
                    <div key={cls.id} className="space-y-1">
                      <div className="flex justify-between">
                        <span>{cls.name}</span>
                        <span className="font-medium">
                          {Math.floor(Math.random() * 10) + 80}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: `${Math.floor(Math.random() * 10) + 80}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <h3 className="font-medium">Subject-wise Attendance</h3>
                
                <div className="space-y-2">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="space-y-1">
                      <div className="flex justify-between">
                        <span>{subject.name}</span>
                        <span className="font-medium">
                          {Math.floor(Math.random() * 15) + 75}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${Math.floor(Math.random() * 15) + 75}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherAttendance;
