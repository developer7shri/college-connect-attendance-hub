
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Student, MentoringSession, StudentProgress, InternalMarks, ExternalMarks, StudentAchievement } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar, FileText, UserCheck, Award, ChevronDown, Upload, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TeacherMentoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState("mentees");
  const [newNote, setNewNote] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showMarksDialog, setShowMarksDialog] = useState(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [showAchievementDialog, setShowAchievementDialog] = useState(false);
  const [showViewAchievementDialog, setShowViewAchievementDialog] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<StudentAchievement | null>(null);

  // Mock data for students (mentees)
  const mentees: Student[] = [
    { 
      id: "1", 
      name: "John Doe", 
      usn: "1XX22CS001", 
      email: "john.doe@example.com", 
      department: "Computer Science", 
      semester: 4 
    },
    { 
      id: "2", 
      name: "Jane Smith", 
      usn: "1XX22CS002", 
      email: "jane.smith@example.com", 
      department: "Computer Science", 
      semester: 4 
    },
    { 
      id: "3", 
      name: "Alex Johnson", 
      usn: "1XX22CS003", 
      email: "alex.johnson@example.com", 
      department: "Computer Science", 
      semester: 4 
    },
    // Add 7 more students to make total of 10
    { 
      id: "4", 
      name: "Priya Patel", 
      usn: "1XX22CS004", 
      email: "priya.p@example.com", 
      department: "Computer Science", 
      semester: 4 
    },
    { 
      id: "5", 
      name: "Mohammed Ali", 
      usn: "1XX22CS005", 
      email: "mohammed.a@example.com", 
      department: "Computer Science", 
      semester: 4 
    },
    { 
      id: "6", 
      name: "Sarah Williams", 
      usn: "1XX22CS006", 
      email: "sarah.w@example.com", 
      department: "Computer Science", 
      semester: 4 
    },
    { 
      id: "7", 
      name: "David Chen", 
      usn: "1XX22CS007", 
      email: "david.c@example.com", 
      department: "Computer Science", 
      semester: 4 
    },
    { 
      id: "8", 
      name: "Fatima Khan", 
      usn: "1XX22CS008", 
      email: "fatima.k@example.com", 
      department: "Computer Science", 
      semester: 4 
    },
    { 
      id: "9", 
      name: "Raj Kumar", 
      usn: "1XX22CS009", 
      email: "raj.k@example.com", 
      department: "Computer Science", 
      semester: 4 
    },
    { 
      id: "10", 
      name: "Emily Zhang", 
      usn: "1XX22CS010", 
      email: "emily.z@example.com", 
      department: "Computer Science", 
      semester: 4 
    }
  ];

  // Mock data for mentoring notes
  const menteeNotes = [
    { id: "1", studentId: "1", note: "Excellent progress in programming fundamentals", date: "2023-05-15" },
    { id: "2", studentId: "1", note: "Needs improvement in data structures", date: "2023-06-10" },
    { id: "3", studentId: "2", note: "Very good at problem-solving", date: "2023-05-20" },
  ];

  // Mock data for mentoring sessions
  const mentoringSessions: MentoringSession[] = [
    { 
      id: "1", 
      mentorId: "teacher1", 
      studentId: "1", 
      date: "2023-05-15", 
      duration: 30, 
      notes: "Discussed academic progress and career goals", 
      topics: ["Academic Performance", "Career Guidance"],
      status: "completed" 
    },
    { 
      id: "2", 
      mentorId: "teacher1", 
      studentId: "2", 
      date: "2023-06-10", 
      duration: 45, 
      notes: "Reviewed project work and provided feedback", 
      topics: ["Project Review", "Technical Skills"],
      status: "completed" 
    },
    { 
      id: "3", 
      mentorId: "teacher1", 
      studentId: "3", 
      date: "2023-07-01", 
      duration: 30, 
      notes: "Scheduled for next week", 
      topics: ["Academic Performance", "Attendance"],
      status: "scheduled" 
    },
  ];

  // Mock data for student marks
  const [internalMarks, setInternalMarks] = useState<InternalMarks[]>([
    { 
      id: "1",
      studentId: "1",
      subjectId: "CS101",
      firstCI: 12,
      secondCI: 13,
      assignments: 8,
      labInternals: 9,
      total: 42,
      updatedBy: "teacher1",
      updatedAt: "2023-06-15"
    },
    { 
      id: "2",
      studentId: "2",
      subjectId: "CS101",
      firstCI: 10,
      secondCI: 11,
      assignments: 7,
      labInternals: 8,
      total: 36,
      updatedBy: "teacher1",
      updatedAt: "2023-06-15"
    }
  ]);
  
  const [externalMarks, setExternalMarks] = useState<ExternalMarks[]>([
    { 
      id: "1",
      studentId: "1",
      subjectId: "CS101",
      marks: 45,
      updatedBy: "teacher1",
      updatedAt: "2023-07-30"
    },
    { 
      id: "2",
      studentId: "2",
      subjectId: "CS101",
      marks: 40,
      updatedBy: "teacher1",
      updatedAt: "2023-07-30"
    }
  ]);

  // Mock data for student achievements
  const [studentAchievements, setStudentAchievements] = useState<StudentAchievement[]>([
    {
      id: "1",
      studentId: "1",
      title: "Best Project Award",
      description: "Won first place in the department project showcase",
      date: "2023-04-15",
      certificateUrl: "https://example.com/certificate1.pdf",
      verified: true,
      verifiedBy: "teacher1",
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
    }
  ]);

  // Form state for marks
  const [marksForm, setMarksForm] = useState({
    firstCI: 0,
    secondCI: 0,
    assignments: 0,
    labInternals: 0,
    external: 0
  });

  // Form state for sessions
  const [sessionForm, setSessionForm] = useState({
    date: new Date().toISOString().substring(0, 10),
    duration: 30,
    notes: "",
    topics: "Academic Performance"
  });

  // Form state for achievements
  const [achievementForm, setAchievementForm] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().substring(0, 10),
    certificateFile: null
  });

  const handleAddNote = (studentId: string) => {
    if (newNote.trim()) {
      // In a real app, this would be an API call to add a note
      toast.success("Note added successfully");
      setNewNote("");
    } else {
      toast.error("Please enter some text before saving");
    }
  };

  const handleScheduleMeeting = (studentId: string) => {
    toast.success("Meeting request sent to student");
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab("marks");
  };

  const handleOpenMarksDialog = (student: Student) => {
    setSelectedStudent(student);
    
    // Find existing marks for this student
    const existing = internalMarks.find(m => m.studentId === student.id);
    const externalMark = externalMarks.find(m => m.studentId === student.id);
    
    setMarksForm({
      firstCI: existing?.firstCI || 0,
      secondCI: existing?.secondCI || 0,
      assignments: existing?.assignments || 0,
      labInternals: existing?.labInternals || 0,
      external: externalMark?.marks || 0
    });
    
    setShowMarksDialog(true);
  };

  const handleOpenSessionDialog = (student: Student) => {
    setSelectedStudent(student);
    setShowSessionDialog(true);
  };

  const handleOpenAchievementDialog = (student: Student) => {
    setSelectedStudent(student);
    setShowAchievementDialog(true);
  };

  const handleViewAchievement = (achievement: StudentAchievement) => {
    setSelectedAchievement(achievement);
    setShowViewAchievementDialog(true);
  };

  const handleSaveMarks = () => {
    if (!selectedStudent) return;
    
    const total = marksForm.firstCI + marksForm.secondCI + marksForm.assignments + marksForm.labInternals;
    
    // Update internal marks
    const existingInternalIndex = internalMarks.findIndex(m => m.studentId === selectedStudent.id);
    if (existingInternalIndex >= 0) {
      const updatedMarks = [...internalMarks];
      updatedMarks[existingInternalIndex] = {
        ...updatedMarks[existingInternalIndex],
        firstCI: marksForm.firstCI,
        secondCI: marksForm.secondCI,
        assignments: marksForm.assignments,
        labInternals: marksForm.labInternals,
        total: total,
        updatedAt: new Date().toISOString()
      };
      setInternalMarks(updatedMarks);
    } else {
      setInternalMarks([...internalMarks, {
        id: `internal-${Date.now()}`,
        studentId: selectedStudent.id,
        subjectId: "CS101",
        firstCI: marksForm.firstCI,
        secondCI: marksForm.secondCI,
        assignments: marksForm.assignments,
        labInternals: marksForm.labInternals,
        total: total,
        updatedBy: "teacher1",
        updatedAt: new Date().toISOString()
      }]);
    }
    
    // Update external marks
    if (marksForm.external > 0) {
      const existingExternalIndex = externalMarks.findIndex(m => m.studentId === selectedStudent.id);
      if (existingExternalIndex >= 0) {
        const updatedMarks = [...externalMarks];
        updatedMarks[existingExternalIndex] = {
          ...updatedMarks[existingExternalIndex],
          marks: marksForm.external,
          updatedAt: new Date().toISOString()
        };
        setExternalMarks(updatedMarks);
      } else {
        setExternalMarks([...externalMarks, {
          id: `external-${Date.now()}`,
          studentId: selectedStudent.id,
          subjectId: "CS101",
          marks: marksForm.external,
          updatedBy: "teacher1",
          updatedAt: new Date().toISOString()
        }]);
      }
    }
    
    toast.success("Marks updated successfully");
    setShowMarksDialog(false);
  };

  const handleSaveSession = () => {
    if (!selectedStudent) return;
    
    // Add new session
    const newSession: MentoringSession = {
      id: `session-${Date.now()}`,
      mentorId: "teacher1",
      studentId: selectedStudent.id,
      date: sessionForm.date,
      duration: sessionForm.duration,
      notes: sessionForm.notes,
      topics: sessionForm.topics.split(","),
      status: "scheduled"
    };
    
    // In a real app, this would be an API call
    toast.success("Mentoring session scheduled");
    setShowSessionDialog(false);
  };

  const handleSaveAchievement = () => {
    if (!selectedStudent) return;
    
    // Add new achievement
    const newAchievement: StudentAchievement = {
      id: `achievement-${Date.now()}`,
      studentId: selectedStudent.id,
      title: achievementForm.title,
      description: achievementForm.description,
      date: achievementForm.date,
      certificateUrl: "https://example.com/uploaded-certificate.pdf", // This would be the actual uploaded file URL
      verified: false,
      uploadedAt: new Date().toISOString()
    };
    
    setStudentAchievements([...studentAchievements, newAchievement]);
    toast.success("Achievement recorded successfully");
    setShowAchievementDialog(false);
  };

  const handleVerifyAchievement = (achievementId: string) => {
    const updatedAchievements = studentAchievements.map(a => 
      a.id === achievementId 
        ? { 
            ...a, 
            verified: true, 
            verifiedBy: "teacher1", 
            verifiedAt: new Date().toISOString() 
          } 
        : a
    );
    
    setStudentAchievements(updatedAchievements);
    setSelectedAchievement(null);
    setShowViewAchievementDialog(false);
    toast.success("Achievement verified successfully");
  };

  // Calculate total marks for a student
  const calculateTotalMarks = (studentId: string): TotalMarks => {
    const internal = internalMarks.find(m => m.studentId === studentId);
    const external = externalMarks.find(m => m.studentId === studentId);
    
    return {
      studentId,
      subjectId: "CS101",
      internal: internal?.total || 0,
      external: external?.marks || 0,
      total: (internal?.total || 0) + (external?.marks || 0)
    };
  };

  // Get student achievements
  const getStudentAchievements = (studentId: string) => {
    return studentAchievements.filter(a => a.studentId === studentId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mentoring</h1>
        <p className="text-muted-foreground">
          Manage your mentees and track their progress
        </p>
      </div>

      <Tabs defaultValue="mentees" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="mentees">Mentees</TabsTrigger>
          <TabsTrigger value="marks">Marks & Progress</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="mentees" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mentees.map((mentee) => (
              <Card key={mentee.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${mentee.name}`} />
                    <AvatarFallback>{mentee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{mentee.name}</CardTitle>
                    <CardDescription>{mentee.usn}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{mentee.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Department:</span>
                      <span>{mentee.department}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Semester:</span>
                      <span>{mentee.semester}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button 
                      variant="outline"
                      className="w-full flex items-center gap-2"
                      onClick={() => handleViewStudent(mentee)}
                    >
                      <UserCheck className="h-4 w-4" />
                      View Details
                    </Button>
                    <Button 
                      className="w-full flex items-center gap-2"
                      onClick={() => handleOpenSessionDialog(mentee)}
                    >
                      <Calendar className="h-4 w-4" />
                      Schedule Session
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full flex items-center gap-2"
                      onClick={() => handleOpenMarksDialog(mentee)}
                    >
                      <FileText className="h-4 w-4" />
                      Update Marks
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full flex items-center gap-2"
                      onClick={() => handleOpenAchievementDialog(mentee)}
                    >
                      <Award className="h-4 w-4" />
                      Add Achievement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="marks" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Marks</CardTitle>
              <CardDescription>
                Track internal and external marks for all mentees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-center">First CI (15)</TableHead>
                    <TableHead className="text-center">Second CI (15)</TableHead>
                    <TableHead className="text-center">Assignments (10)</TableHead>
                    <TableHead className="text-center">Lab Internals (10)</TableHead>
                    <TableHead className="text-center">Internal Total (50)</TableHead>
                    <TableHead className="text-center">External (50)</TableHead>
                    <TableHead className="text-center">Total (100)</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mentees.map((mentee) => {
                    const internal = internalMarks.find(m => m.studentId === mentee.id);
                    const external = externalMarks.find(m => m.studentId === mentee.id);
                    const total = calculateTotalMarks(mentee.id);
                    
                    return (
                      <TableRow key={mentee.id}>
                        <TableCell className="font-medium">{mentee.name}</TableCell>
                        <TableCell className="text-center">{internal?.firstCI || "-"}</TableCell>
                        <TableCell className="text-center">{internal?.secondCI || "-"}</TableCell>
                        <TableCell className="text-center">{internal?.assignments || "-"}</TableCell>
                        <TableCell className="text-center">{internal?.labInternals || "-"}</TableCell>
                        <TableCell className="text-center">{internal?.total || "-"}</TableCell>
                        <TableCell className="text-center">{external?.marks || "-"}</TableCell>
                        <TableCell className="text-center">
                          {total.total > 0 ? total.total : "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenMarksDialog(mentee)}
                          >
                            Update
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

        <TabsContent value="sessions" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mentoring Sessions</CardTitle>
              <CardDescription>
                Track all mentoring sessions with students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Upcoming Sessions</h3>
                  <div className="space-y-2">
                    {mentoringSessions
                      .filter(session => session.status === "scheduled")
                      .map(session => {
                        const student = mentees.find(m => m.id === session.studentId);
                        return (
                          <Card key={session.id} className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{student?.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(session.date).toLocaleDateString()} - {session.duration} minutes
                                </p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {session.topics.map((topic, index) => (
                                    <span 
                                      key={index} 
                                      className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">Cancel</Button>
                                <Button size="sm" variant="outline">Reschedule</Button>
                                <Button size="sm">Complete</Button>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    {mentoringSessions.filter(session => session.status === "scheduled").length === 0 && (
                      <p className="text-center text-muted-foreground py-4">No upcoming sessions</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Past Sessions</h3>
                  <div className="space-y-2">
                    {mentoringSessions
                      .filter(session => session.status === "completed")
                      .map(session => {
                        const student = mentees.find(m => m.id === session.studentId);
                        return (
                          <Card key={session.id} className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{student?.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(session.date).toLocaleDateString()} - {session.duration} minutes
                                </p>
                                <p className="text-sm mt-1">{session.notes}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {session.topics.map((topic, index) => (
                                    <span 
                                      key={index} 
                                      className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <Button size="sm" variant="outline">View Details</Button>
                            </div>
                          </Card>
                        );
                      })}
                    {mentoringSessions.filter(session => session.status === "completed").length === 0 && (
                      <p className="text-center text-muted-foreground py-4">No past sessions</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={() => {
                      setSelectedStudent(null);
                      setShowSessionDialog(true);
                    }}
                  >
                    Schedule New Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Achievements</CardTitle>
              <CardDescription>
                View and verify student achievements and certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mentees.map(mentee => {
                  const achievements = getStudentAchievements(mentee.id);
                  if (achievements.length === 0) return null;
                  
                  return (
                    <div key={mentee.id} className="space-y-2">
                      <h3 className="font-medium">{mentee.name}</h3>
                      <div className="space-y-2">
                        {achievements.map(achievement => (
                          <Card key={achievement.id} className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{achievement.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(achievement.date).toLocaleDateString()}
                                </p>
                                <p className="text-sm mt-1">{achievement.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {achievement.verified ? (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Verified
                                  </span>
                                ) : (
                                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                                    Pending
                                  </span>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleViewAchievement(achievement)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                {studentAchievements.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No achievements recorded</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for updating marks */}
      <Dialog open={showMarksDialog} onOpenChange={setShowMarksDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Update Marks for {selectedStudent?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>First Continuous Internal (out of 15)</Label>
              <Input 
                type="number" 
                min="0" 
                max="15" 
                value={marksForm.firstCI} 
                onChange={(e) => setMarksForm({...marksForm, firstCI: Number(e.target.value)})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Second Continuous Internal (out of 15)</Label>
              <Input 
                type="number" 
                min="0" 
                max="15" 
                value={marksForm.secondCI} 
                onChange={(e) => setMarksForm({...marksForm, secondCI: Number(e.target.value)})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Assignments (out of 10)</Label>
              <Input 
                type="number" 
                min="0" 
                max="10" 
                value={marksForm.assignments} 
                onChange={(e) => setMarksForm({...marksForm, assignments: Number(e.target.value)})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Lab Internals (out of 10)</Label>
              <Input 
                type="number" 
                min="0" 
                max="10" 
                value={marksForm.labInternals} 
                onChange={(e) => setMarksForm({...marksForm, labInternals: Number(e.target.value)})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>External Marks (out of 50)</Label>
              <Input 
                type="number" 
                min="0" 
                max="50" 
                value={marksForm.external} 
                onChange={(e) => setMarksForm({...marksForm, external: Number(e.target.value)})}
              />
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Internal Total:</span>
                <span>{marksForm.firstCI + marksForm.secondCI + marksForm.assignments + marksForm.labInternals}/50</span>
              </div>
              <Progress 
                value={(marksForm.firstCI + marksForm.secondCI + marksForm.assignments + marksForm.labInternals) * 2} 
                className="mt-2" 
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-medium">
                <span>Grand Total:</span>
                <span>
                  {marksForm.firstCI + marksForm.secondCI + marksForm.assignments + marksForm.labInternals + marksForm.external}/100
                </span>
              </div>
              <Progress 
                value={marksForm.firstCI + marksForm.secondCI + marksForm.assignments + marksForm.labInternals + marksForm.external} 
                className="mt-2" 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMarksDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveMarks}>Save Marks</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for scheduling sessions */}
      <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Schedule Mentoring Session
              {selectedStudent && ` with ${selectedStudent.name}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {!selectedStudent && (
              <div className="space-y-2">
                <Label>Select Student</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentees.map(mentee => (
                      <SelectItem key={mentee.id} value={mentee.id}>{mentee.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Date</Label>
              <Input 
                type="date" 
                value={sessionForm.date} 
                onChange={(e) => setSessionForm({...sessionForm, date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Select 
                value={String(sessionForm.duration)}
                onValueChange={(value) => setSessionForm({...sessionForm, duration: Number(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Topics (comma separated)</Label>
              <Input 
                value={sessionForm.topics} 
                onChange={(e) => setSessionForm({...sessionForm, topics: e.target.value})}
                placeholder="Academic Performance, Career Guidance, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Session Notes</Label>
              <Textarea 
                value={sessionForm.notes} 
                onChange={(e) => setSessionForm({...sessionForm, notes: e.target.value})}
                placeholder="Enter any notes or agenda items for this session"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSessionDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveSession}>Schedule Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for adding achievements */}
      <Dialog open={showAchievementDialog} onOpenChange={setShowAchievementDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Record Achievement for {selectedStudent?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Achievement Title</Label>
              <Input 
                value={achievementForm.title} 
                onChange={(e) => setAchievementForm({...achievementForm, title: e.target.value})}
                placeholder="e.g. Hackathon Winner, Best Project Award"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={achievementForm.description} 
                onChange={(e) => setAchievementForm({...achievementForm, description: e.target.value})}
                placeholder="Enter details about this achievement"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Date</Label>
              <Input 
                type="date" 
                value={achievementForm.date} 
                onChange={(e) => setAchievementForm({...achievementForm, date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Upload Certificate</Label>
              <div className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-center text-muted-foreground mb-2">
                  Click to upload or drag and drop
                </p>
                <Button variant="outline" size="sm">Select File</Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAchievementDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveAchievement}>Record Achievement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for viewing achievements */}
      <Dialog open={showViewAchievementDialog} onOpenChange={setShowViewAchievementDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedAchievement?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="border rounded-md p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span>{selectedAchievement?.date && new Date(selectedAchievement.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span>
                    {selectedAchievement?.verified ? (
                      <span className="text-green-600">Verified</span>
                    ) : (
                      <span className="text-amber-600">Pending Verification</span>
                    )}
                  </span>
                </div>
                {selectedAchievement?.verifiedBy && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Verified by:</span>
                    <span>{selectedAchievement.verifiedBy}</span>
                  </div>
                )}
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">Description:</p>
                  <p>{selectedAchievement?.description}</p>
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
          </div>
          
          <DialogFooter>
            {selectedAchievement && !selectedAchievement.verified && (
              <Button onClick={() => handleVerifyAchievement(selectedAchievement.id)}>Verify Achievement</Button>
            )}
            <Button variant="outline" onClick={() => setShowViewAchievementDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherMentoring;
