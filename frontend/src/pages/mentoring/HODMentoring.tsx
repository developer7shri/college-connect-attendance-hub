
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Student, MentoringSession, StudentAchievement, User } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search,
  UserCheck, 
  Calendar,
  FileText, 
  Award,
  BarChart,
  Download,
  PieChart,
  Users,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const HODMentoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSessionDetailsDialog, setShowSessionDetailsDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);
  const [showTeacherDetailsDialog, setShowTeacherDetailsDialog] = useState(false);
  const [showStudentDetailsDialog, setShowStudentDetailsDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAchievementDialog, setShowAchievementDialog] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<StudentAchievement | null>(null);
  const [selectedSession, setSelectedSession] = useState<MentoringSession | null>(null);
  const [newNote, setNewNote] = useState("");

  // Mock data - in a real app this would come from API
  const teachers: User[] = [
    { id: "1", name: "Dr. Robert Smith", email: "robert.smith@scahts.edu", role: "teacher", department: "Computer Science" },
    { id: "2", name: "Prof. Sarah Johnson", email: "sarah.johnson@scahts.edu", role: "teacher", department: "Computer Science" },
    { id: "3", name: "Dr. Michael Brown", email: "michael.brown@scahts.edu", role: "teacher", department: "Computer Science" },
  ];

  const mentees: Student[] = [
    { id: "1", name: "John Doe", usn: "1XX22CS001", email: "john.doe@example.com", department: "Computer Science", semester: 4, mentorId: "1" },
    { id: "2", name: "Jane Smith", usn: "1XX22CS002", email: "jane.smith@example.com", department: "Computer Science", semester: 4, mentorId: "1" },
    { id: "3", name: "Alex Johnson", usn: "1XX22CS003", email: "alex.johnson@example.com", department: "Computer Science", semester: 4, mentorId: "2" },
    { id: "4", name: "Priya Patel", usn: "1XX22CS004", email: "priya.p@example.com", department: "Computer Science", semester: 4, mentorId: "2" },
    { id: "5", name: "Mohammed Ali", usn: "1XX22CS005", email: "mohammed.a@example.com", department: "Computer Science", semester: 4, mentorId: "3" },
  ];

  // Mock mentoring sessions
  const mentoringSessions: MentoringSession[] = [
    { 
      id: "1", 
      mentorId: "1", 
      studentId: "1", 
      date: "2023-05-15", 
      duration: 30, 
      notes: "Discussed academic progress and career goals", 
      topics: ["Academic Performance", "Career Guidance"],
      status: "completed" 
    },
    { 
      id: "2", 
      mentorId: "1", 
      studentId: "2", 
      date: "2023-06-10", 
      duration: 45, 
      notes: "Reviewed project work and provided feedback", 
      topics: ["Project Review", "Technical Skills"],
      status: "completed" 
    },
    { 
      id: "3", 
      mentorId: "2", 
      studentId: "3", 
      date: "2023-07-01", 
      duration: 30, 
      notes: "Scheduled for next week", 
      topics: ["Academic Performance", "Attendance"],
      status: "scheduled" 
    },
  ];

  // Mock student achievements
  const studentAchievements: StudentAchievement[] = [
    {
      id: "1",
      studentId: "1",
      title: "Best Project Award",
      description: "Won first place in the department project showcase",
      date: "2023-04-15",
      certificateUrl: "https://example.com/certificate1.pdf",
      verified: true,
      verifiedBy: "1",
      verifiedAt: "2023-04-16",
      uploadedAt: "2023-04-15"
    },
    {
      id: "2",
      studentId: "2",
      title: "Hackathon Winner",
      description: "Part of winning team at regional hackathon",
      date: "2023-03-10",
      certificateUrl: "https://example.com/certificate2.pdf",
      verified: false,
      uploadedAt: "2023-03-11"
    },
    {
      id: "3",
      studentId: "3",
      title: "Programming Contest Winner",
      description: "First place in college coding competition",
      date: "2023-05-20",
      certificateUrl: "https://example.com/certificate3.pdf",
      verified: true,
      verifiedBy: "2",
      verifiedAt: "2023-05-21",
      uploadedAt: "2023-05-20"
    }
  ];

  // Mentoring statistics
  const mentoringStats = {
    totalMentoringHours: 62,
    sessionCount: 34,
    sessionThisMonth: 12,
    averageDuration: 25,
    unverifiedAchievements: studentAchievements.filter(a => !a.verified).length,
    upcomingSessions: mentoringSessions.filter(s => s.status === "scheduled").length
  };

  // Performance data for teachers
  const teacherPerformanceData = [
    { teacherId: "1", mentoringHours: 28, sessionCount: 15, studentsCount: 10, satisfaction: 4.8 },
    { teacherId: "2", mentoringHours: 18, sessionCount: 10, studentsCount: 8, satisfaction: 4.6 },
    { teacherId: "3", mentoringHours: 16, sessionCount: 9, studentsCount: 7, satisfaction: 4.5 },
  ];

  // Get mentees for a specific teacher
  const getMenteesForTeacher = (teacherId: string) => {
    return mentees.filter(m => m.mentorId === teacherId);
  };

  // Get sessions for a specific teacher
  const getSessionsForTeacher = (teacherId: string) => {
    return mentoringSessions.filter(s => s.mentorId === teacherId);
  };

  // Get achievements for a specific student
  const getAchievementsForStudent = (studentId: string) => {
    return studentAchievements.filter(a => a.studentId === studentId);
  };

  // Handle viewing teacher details
  const handleViewTeacher = (teacher: User) => {
    setSelectedTeacher(teacher);
    setShowTeacherDetailsDialog(true);
  };

  // Handle viewing student details
  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentDetailsDialog(true);
  };

  // Handle viewing achievement details
  const handleViewAchievement = (achievement: StudentAchievement) => {
    setSelectedAchievement(achievement);
    setShowAchievementDialog(true);
  };

  // Handle viewing session details
  const handleViewSession = (session: MentoringSession) => {
    setSelectedSession(session);
    setShowSessionDetailsDialog(true);
  };

  // Handle adding a note
  const handleAddNote = (studentId: string) => {
    if (newNote.trim()) {
      toast.success("Note added successfully");
      setNewNote("");
    } else {
      toast.error("Please enter some text before saving");
    }
  };

  // Handle verifying an achievement
  const handleVerifyAchievement = () => {
    if (!selectedAchievement) return;
    
    // In real app, this would be an API call
    toast.success("Achievement verified successfully");
    setShowAchievementDialog(false);
  };

  // Get teacher by ID
  const getTeacherById = (teacherId: string) => {
    return teachers.find(t => t.id === teacherId);
  };

  // Get student by ID
  const getStudentById = (studentId: string) => {
    return mentees.find(s => s.id === studentId);
  };

  // Filter teachers based on search
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Department Mentoring</h1>
        <p className="text-muted-foreground">
          Overview of mentorship activities within your department
        </p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mentoringStats.sessionCount}</div>
                <p className="text-xs text-muted-foreground">
                  {mentoringStats.sessionThisMonth} sessions this month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Mentoring Hours</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mentoringStats.totalMentoringHours}</div>
                <p className="text-xs text-muted-foreground">
                  Avg. {mentoringStats.averageDuration} min per session
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentAchievements.length}</div>
                <p className="text-xs text-muted-foreground">
                  {mentoringStats.unverifiedAchievements} pending verification
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Teacher Performance</CardTitle>
                <CardDescription>Mentoring effectiveness metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teachers.map(teacher => {
                    const performance = teacherPerformanceData.find(p => p.teacherId === teacher.id);
                    
                    if (!performance) return null;
                    
                    return (
                      <div key={teacher.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${teacher.name}`} />
                              <AvatarFallback>{teacher.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{teacher.name}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewTeacher(teacher)}
                          >
                            Details
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Sessions</span>
                          <span>{performance.sessionCount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Students</span>
                          <span>{performance.studentsCount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Satisfaction</span>
                          <span>{performance.satisfaction}/5.0</span>
                        </div>
                        <Progress value={performance.satisfaction * 20} className="h-1" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest mentoring activities in department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mentoringSessions
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 5)
                    .map(session => {
                      const teacher = getTeacherById(session.mentorId);
                      const student = getStudentById(session.studentId);
                      
                      if (!teacher || !student) return null;
                      
                      return (
                        <div key={session.id} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">
                              {teacher.name} mentored {student.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(session.date).toLocaleDateString()} • {session.duration} min
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewSession(session)}
                          >
                            View
                          </Button>
                        </div>
                      );
                    })
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-4 mt-4">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  className="pl-8 w-full max-w-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeachers.map((teacher) => {
              const menteeCount = getMenteesForTeacher(teacher.id).length;
              const sessionCount = getSessionsForTeacher(teacher.id).length;
              const performance = teacherPerformanceData.find(p => p.teacherId === teacher.id);
              
              return (
                <Card key={teacher.id}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${teacher.name}`} />
                      <AvatarFallback>{teacher.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{teacher.name}</CardTitle>
                      <CardDescription>{teacher.email}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Mentees:</span>
                        <span>{menteeCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sessions:</span>
                        <span>{sessionCount}</span>
                      </div>
                      {performance && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Hours:</span>
                          <span>{performance.mentoringHours}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleViewTeacher(teacher)}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        className="w-full"
                      >
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Mentees</CardTitle>
              <CardDescription>Students assigned to mentors in your department</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>USN</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mentees.map(student => {
                    const mentor = getTeacherById(student.mentorId || "");
                    const sessionCount = mentoringSessions.filter(s => s.studentId === student.id).length;
                    
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            {student.name}
                          </div>
                        </TableCell>
                        <TableCell>{student.usn}</TableCell>
                        <TableCell>{student.semester}</TableCell>
                        <TableCell>
                          {mentor?.name || "Not Assigned"}
                        </TableCell>
                        <TableCell>{sessionCount}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewStudent(student)}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Achievements</CardTitle>
              <CardDescription>Achievements uploaded by students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Pending Verification</h3>
                </div>
                <div className="space-y-2">
                  {studentAchievements.filter(a => !a.verified).map(achievement => {
                    const student = getStudentById(achievement.studentId);
                    
                    return (
                      <Card key={achievement.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{achievement.title}</p>
                              <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {student?.name} • {new Date(achievement.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm mt-1 line-clamp-1">{achievement.description}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewAchievement(achievement)}
                          >
                            Review
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                  {studentAchievements.filter(a => !a.verified).length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No pending achievements</p>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Verified Achievements</h3>
                </div>
                <div className="space-y-2">
                  {studentAchievements.filter(a => a.verified).map(achievement => {
                    const student = getStudentById(achievement.studentId);
                    const verifier = getTeacherById(achievement.verifiedBy || "");
                    
                    return (
                      <Card key={achievement.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{achievement.title}</p>
                              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {student?.name} • {new Date(achievement.date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Verified by {verifier?.name}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewAchievement(achievement)}
                          >
                            View
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mentoring Reports</CardTitle>
              <CardDescription>Departmental mentoring statistics and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Mentoring Activity Report</h3>
                    <p className="text-sm text-muted-foreground">Overview of all mentoring activities</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Student Progress Report</h3>
                    <p className="text-sm text-muted-foreground">Cumulative student progress data</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Teacher Performance Report</h3>
                    <p className="text-sm text-muted-foreground">Mentoring effectiveness metrics</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Achievement Verification Report</h3>
                    <p className="text-sm text-muted-foreground">Student achievements and verification status</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Generate Custom Report</CardTitle>
              <CardDescription>Create reports with specific parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="report-type" className="text-sm font-medium">Report Type</label>
                    <select 
                      id="report-type" 
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="mentoring">Mentoring Activities</option>
                      <option value="student">Student Progress</option>
                      <option value="teacher">Teacher Performance</option>
                      <option value="achievement">Student Achievements</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="time-period" className="text-sm font-medium">Time Period</label>
                    <select 
                      id="time-period" 
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="last-month">Last Month</option>
                      <option value="last-quarter">Last Quarter</option>
                      <option value="last-semester">Last Semester</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="additional-filters" className="text-sm font-medium">Additional Filters</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">By Teacher</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">By Semester</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">By Performance</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">By Subject</Badge>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for teacher details */}
      <Dialog open={showTeacherDetailsDialog} onOpenChange={setShowTeacherDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedTeacher?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedTeacher && (
              <>
                <div className="flex gap-4 items-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedTeacher.name}`} />
                    <AvatarFallback>{selectedTeacher.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{selectedTeacher.name}</h3>
                    <p className="text-muted-foreground">{selectedTeacher.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Mentee Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Total Mentees</span>
                          <span className="font-medium">{getMenteesForTeacher(selectedTeacher.id).length}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Active Mentees</span>
                          <span className="font-medium">{getMenteesForTeacher(selectedTeacher.id).length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Session Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Total Sessions</span>
                          <span className="font-medium">{getSessionsForTeacher(selectedTeacher.id).length}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Hours Spent</span>
                          <span className="font-medium">
                            {teacherPerformanceData.find(p => p.teacherId === selectedTeacher.id)?.mentoringHours || 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Mentee List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>USN</TableHead>
                          <TableHead>Sessions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getMenteesForTeacher(selectedTeacher.id).map(mentee => (
                          <TableRow key={mentee.id}>
                            <TableCell className="font-medium">{mentee.name}</TableCell>
                            <TableCell>{mentee.usn}</TableCell>
                            <TableCell>
                              {mentoringSessions.filter(s => s.studentId === mentee.id && s.mentorId === selectedTeacher.id).length}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTeacherDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for student details */}
      <Dialog open={showStudentDetailsDialog} onOpenChange={setShowStudentDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedStudent?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedStudent && (
              <>
                <div className="flex gap-4 items-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedStudent.name}`} />
                    <AvatarFallback>{selectedStudent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{selectedStudent.name}</h3>
                    <p className="text-muted-foreground">{selectedStudent.usn}</p>
                    <p className="text-sm text-muted-foreground">{selectedStudent.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Student Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Department</span>
                          <span className="font-medium">{selectedStudent.department}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Semester</span>
                          <span className="font-medium">{selectedStudent.semester}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Mentor</span>
                          <span className="font-medium">
                            {getTeacherById(selectedStudent.mentorId || "")?.name || "Not Assigned"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Mentoring Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Sessions Attended</span>
                          <span className="font-medium">
                            {mentoringSessions.filter(s => s.studentId === selectedStudent.id).length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Achievements</span>
                          <span className="font-medium">
                            {studentAchievements.filter(a => a.studentId === selectedStudent.id).length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Add Note</h3>
                  <Textarea 
                    placeholder="Add a note about this student..." 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="mb-2"
                  />
                  <Button 
                    size="sm" 
                    onClick={() => handleAddNote(selectedStudent.id)}
                  >
                    Save Note
                  </Button>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {getAchievementsForStudent(selectedStudent.id).map(achievement => (
                        <div key={achievement.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{achievement.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(achievement.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {achievement.verified ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800">Verified</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-100 text-amber-800">Pending</Badge>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewAchievement(achievement)}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                      {getAchievementsForStudent(selectedStudent.id).length === 0 && (
                        <p className="text-center text-muted-foreground py-2">No achievements</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStudentDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for achievement details */}
      <Dialog open={showAchievementDialog} onOpenChange={setShowAchievementDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedAchievement?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedAchievement && (
              <>
                <div className="border rounded-md p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Student:</span>
                      <span>{getStudentById(selectedAchievement.studentId)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">USN:</span>
                      <span>{getStudentById(selectedAchievement.studentId)?.usn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Date:</span>
                      <span>{selectedAchievement.date && new Date(selectedAchievement.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span>
                        {selectedAchievement.verified ? (
                          <span className="text-green-600">Verified</span>
                        ) : (
                          <span className="text-amber-600">Pending Verification</span>
                        )}
                      </span>
                    </div>
                    {selectedAchievement.verifiedBy && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Verified by:</span>
                        <span>{getTeacherById(selectedAchievement.verifiedBy)?.name}</span>
                      </div>
                    )}
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground">Description:</p>
                      <p>{selectedAchievement.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Certificate Preview</h4>
                  <div className="bg-muted rounded-md p-8 flex items-center justify-center">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <div className="flex justify-center mt-2">
                    <Button variant="outline" size="sm">View Full Certificate</Button>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            {selectedAchievement && !selectedAchievement.verified && (
              <Button onClick={handleVerifyAchievement}>Verify Achievement</Button>
            )}
            <Button variant="outline" onClick={() => setShowAchievementDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for session details */}
      <Dialog open={showSessionDetailsDialog} onOpenChange={setShowSessionDetailsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Mentoring Session Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedSession && (
              <>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Teacher</p>
                    <p className="font-medium">{getTeacherById(selectedSession.mentorId)?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Student</p>
                    <p className="font-medium">{getStudentById(selectedSession.studentId)?.name}</p>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Date:</span>
                      <span>{new Date(selectedSession.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Duration:</span>
                      <span>{selectedSession.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span>
                        {selectedSession.status === "completed" ? (
                          <span className="text-green-600 capitalize">{selectedSession.status}</span>
                        ) : (
                          <span className="text-amber-600 capitalize">{selectedSession.status}</span>
                        )}
                      </span>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground">Topics Covered:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedSession.topics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="bg-primary/10">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground">Notes:</p>
                      <p>{selectedSession.notes}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSessionDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HODMentoring;
