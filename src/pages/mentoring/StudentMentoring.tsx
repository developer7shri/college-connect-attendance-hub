
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Upload, FileText, Award, PieChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { InternalMarks, ExternalMarks, StudentAchievement } from "@/types";

const StudentMentoring: React.FC = () => {
  const [message, setMessage] = useState("");
  const [showAchievementDialog, setShowAchievementDialog] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<StudentAchievement | null>(null);
  const [showViewAchievementDialog, setShowViewAchievementDialog] = useState(false);
  
  // Form state for achievement
  const [achievementForm, setAchievementForm] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().substring(0, 10),
  });

  // Mock data - in a real app this would come from API
  const mentor = {
    id: "1",
    name: "Dr. Robert Smith",
    department: "Computer Science",
    email: "robert.smith@scahts.edu",
    phone: "123-456-7890",
    meetingHours: "Monday and Wednesday, 2-4 PM"
  };

  // Mock notes data
  const notes = [
    { id: "1", content: "Excellent progress in programming fundamentals", date: "2023-05-15" },
    { id: "2", content: "Needs improvement in data structures", date: "2023-06-10" },
    { id: "3", content: "Very good at problem-solving", date: "2023-05-20" },
  ];

  // Mock meetings data
  const meetings = [
    { id: "1", date: "2023-06-01", time: "14:00", status: "completed", topic: "Academic Progress Review" },
    { id: "2", date: "2023-07-15", time: "15:30", status: "upcoming", topic: "Career Guidance Discussion" },
  ];

  // Mock marks data
  const internalMarks: InternalMarks[] = [
    {
      id: "1",
      studentId: "current-student",
      subjectId: "CS101",
      firstCI: 12,
      secondCI: 14,
      assignments: 9,
      labInternals: 8,
      total: 43,
      updatedBy: "teacher1",
      updatedAt: "2023-06-15"
    },
    {
      id: "2",
      studentId: "current-student",
      subjectId: "CS102",
      firstCI: 11,
      secondCI: 13,
      assignments: 8,
      labInternals: 9,
      total: 41,
      updatedBy: "teacher2",
      updatedAt: "2023-06-16"
    }
  ];
  
  const externalMarks: ExternalMarks[] = [
    {
      id: "1",
      studentId: "current-student",
      subjectId: "CS101",
      marks: 42,
      updatedBy: "teacher1",
      updatedAt: "2023-07-30"
    },
    {
      id: "2",
      studentId: "current-student",
      subjectId: "CS102",
      marks: 45,
      updatedBy: "teacher2",
      updatedAt: "2023-07-30"
    }
  ];

  // Mock student achievements
  const [achievements, setAchievements] = useState<StudentAchievement[]>([
    {
      id: "1",
      studentId: "current-student",
      title: "Best Project Award",
      description: "Won first place in the department project showcase",
      date: "2023-04-15",
      certificateUrl: "https://example.com/certificate1.pdf",
      verified: true,
      verifiedBy: "Dr. Robert Smith",
      verifiedAt: "2023-04-16",
      uploadedAt: "2023-04-15"
    },
    {
      id: "2",
      studentId: "current-student",
      title: "Hackathon Winner",
      description: "Part of winning team at regional hackathon",
      date: "2023-03-10",
      certificateUrl: "https://example.com/certificate2.pdf",
      verified: false,
      uploadedAt: "2023-03-11"
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      toast.success("Message sent to your mentor");
      setMessage("");
    } else {
      toast.error("Please enter some text before sending");
    }
  };

  const handleRequestMeeting = () => {
    toast.success("Meeting request sent to your mentor");
  };
  
  const handleUploadAchievement = () => {
    setShowAchievementDialog(true);
  };
  
  const handleSubmitAchievement = () => {
    // Validate form
    if (!achievementForm.title || !achievementForm.description) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Create new achievement
    const newAchievement: StudentAchievement = {
      id: `achievement-${Date.now()}`,
      studentId: "current-student",
      title: achievementForm.title,
      description: achievementForm.description,
      date: achievementForm.date,
      certificateUrl: "https://example.com/uploaded-certificate.pdf", // This would be the actual uploaded file URL
      verified: false,
      uploadedAt: new Date().toISOString()
    };
    
    // Add to achievements list
    setAchievements([...achievements, newAchievement]);
    
    // Reset form and close dialog
    setAchievementForm({
      title: "",
      description: "",
      date: new Date().toISOString().substring(0, 10),
    });
    setShowAchievementDialog(false);
    
    toast.success("Achievement submitted for verification");
  };
  
  const handleViewAchievement = (achievement: StudentAchievement) => {
    setSelectedAchievement(achievement);
    setShowViewAchievementDialog(true);
  };

  // Calculate total marks per subject
  const getTotalMarks = (subjectId: string) => {
    const internal = internalMarks.find(m => m.subjectId === subjectId);
    const external = externalMarks.find(m => m.subjectId === subjectId);
    
    return {
      subjectId,
      internal: internal?.total || 0,
      external: external?.marks || 0,
      total: (internal?.total || 0) + (external?.marks || 0)
    };
  };

  // Subject names mapping
  const subjectNames: {[key: string]: string} = {
    "CS101": "Data Structures",
    "CS102": "Database Systems"
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Mentor</h1>
        <p className="text-muted-foreground">
          Connect with your mentor and track your progress
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="marks">Marks</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="notes">Notes & Progress</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${mentor.name}`} />
                <AvatarFallback>{mentor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{mentor.name}</CardTitle>
                <CardDescription>{mentor.department}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{mentor.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{mentor.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Office Hours:</span>
                    <span>{mentor.meetingHours}</span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Button onClick={handleRequestMeeting}>Request Meeting</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {notes.slice(0, 2).map(note => (
                  <div key={note.id} className="border rounded-md p-3 mb-2">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Note</span>
                      <span>{note.date}</span>
                    </div>
                    <p>{note.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                {meetings
                  .filter(meeting => meeting.status === "upcoming")
                  .map(meeting => (
                    <div key={meeting.id} className="border rounded-md p-3 mb-2">
                      <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>{meeting.topic}</span>
                        <span>{meeting.date} at {meeting.time}</span>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button size="sm" variant="outline">Reschedule</Button>
                      </div>
                    </div>
                  ))
                }
                {meetings.filter(meeting => meeting.status === "upcoming").length === 0 && (
                  <p className="text-center py-4 text-muted-foreground">No upcoming meetings</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="marks" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>Your marks in different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {internalMarks.map(mark => {
                  const subject = subjectNames[mark.subjectId] || mark.subjectId;
                  const external = externalMarks.find(e => e.subjectId === mark.subjectId);
                  const totalMarks = getTotalMarks(mark.subjectId);
                  
                  return (
                    <div key={mark.id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">{subject}</h3>
                        <div className="text-2xl font-bold">{totalMarks.total}/100</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Internal Assessment (50)</span>
                            <span>{mark.total}/50</span>
                          </div>
                          <Progress value={mark.total * 2} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span>External Assessment (50)</span>
                            <span>{external?.marks || 0}/50</span>
                          </div>
                          <Progress value={(external?.marks || 0) * 2} className="h-2" />
                        </div>
                        
                        <div className="border rounded-md mt-2 p-4">
                          <h4 className="text-sm font-medium mb-2">Marks Breakdown</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">First CI:</span>
                              <span>{mark.firstCI}/15</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Second CI:</span>
                              <span>{mark.secondCI}/15</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Assignments:</span>
                              <span>{mark.assignments}/10</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Lab Internals:</span>
                              <span>{mark.labInternals}/10</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <hr className="my-2" />
                    </div>
                  );
                })}
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-medium">Overall Performance</span>
                  </div>
                  <div className="text-lg font-semibold">
                    {Math.round(
                      (internalMarks.reduce((sum, mark) => sum + mark.total, 0) + 
                      externalMarks.reduce((sum, mark) => sum + mark.marks, 0)) / 
                      (internalMarks.length * 100) * 100
                    )}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Achievements</h2>
            <Button onClick={handleUploadAchievement}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Achievement
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map(achievement => (
              <Card key={achievement.id} className="overflow-hidden">
                <div className="bg-primary/10 p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-primary mr-2" />
                    <h3 className="font-medium">{achievement.title}</h3>
                  </div>
                  {achievement.verified ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>
                  )}
                </div>
                <CardContent className="pt-4">
                  <p className="text-sm line-clamp-2 mb-2">{achievement.description}</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    {new Date(achievement.date).toLocaleDateString()}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => handleViewAchievement(achievement)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Certificate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {achievements.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Award className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">You haven't uploaded any achievements yet</p>
                <Button onClick={handleUploadAchievement}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Achievement
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mentor Notes</CardTitle>
              <CardDescription>Feedback and observations from your mentor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notes.map(note => (
                  <div key={note.id} className="border rounded-md p-3">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Note</span>
                      <span>{note.date}</span>
                    </div>
                    <p>{note.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Meetings</CardTitle>
              <CardDescription>Your past and upcoming meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="font-medium">Upcoming</h3>
                <div className="space-y-2">
                  {meetings
                    .filter(meeting => meeting.status === "upcoming")
                    .map(meeting => (
                      <div key={meeting.id} className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{meeting.topic}</h4>
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Upcoming</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{meeting.date} at {meeting.time}</p>
                        <div className="flex justify-end gap-2 mt-2">
                          <Button size="sm" variant="outline">Cancel</Button>
                          <Button size="sm" variant="outline">Reschedule</Button>
                        </div>
                      </div>
                    ))
                  }
                  {meetings.filter(meeting => meeting.status === "upcoming").length === 0 && (
                    <p className="text-center py-4 text-muted-foreground">No upcoming meetings</p>
                  )}
                </div>

                <h3 className="font-medium pt-2">Past Meetings</h3>
                <div className="space-y-2">
                  {meetings
                    .filter(meeting => meeting.status === "completed")
                    .map(meeting => (
                      <div key={meeting.id} className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{meeting.topic}</h4>
                          <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">Completed</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{meeting.date} at {meeting.time}</p>
                      </div>
                    ))
                  }
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleRequestMeeting} className="w-full">Request New Meeting</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Your Mentor</CardTitle>
              <CardDescription>Send a message directly to your mentor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea 
                  placeholder="Write your message here..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[150px]"
                />
                <Button onClick={handleSendMessage} className="w-full">Send Message</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Ways to reach your mentor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{mentor.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{mentor.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Office Hours:</span>
                  <span>{mentor.meetingHours}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Office:</span>
                  <span>Room 203, CS Building</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog for uploading achievement */}
      <Dialog open={showAchievementDialog} onOpenChange={setShowAchievementDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Achievement</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="achievement-title">Achievement Title</Label>
              <Input
                id="achievement-title"
                value={achievementForm.title}
                onChange={(e) => setAchievementForm({...achievementForm, title: e.target.value})}
                placeholder="e.g. Hackathon Winner, Best Project Award"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="achievement-description">Description</Label>
              <Textarea
                id="achievement-description"
                value={achievementForm.description}
                onChange={(e) => setAchievementForm({...achievementForm, description: e.target.value})}
                placeholder="Enter details about this achievement"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="achievement-date">Date</Label>
              <Input
                id="achievement-date"
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
            <Button onClick={handleSubmitAchievement}>Submit Achievement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for viewing achievement */}
      <Dialog open={showViewAchievementDialog} onOpenChange={setShowViewAchievementDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedAchievement?.title}</DialogTitle>
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
                <Button variant="outline" size="sm">Download Certificate</Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewAchievementDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentMentoring;
