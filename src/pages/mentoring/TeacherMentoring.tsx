
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/types";

const TeacherMentoring: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("mentees");
  const [newNote, setNewNote] = useState("");

  // Mock data - in a real app this would come from API
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
  ];

  const menteeNotes = [
    { id: "1", studentId: "1", note: "Excellent progress in programming fundamentals", date: "2023-05-15" },
    { id: "2", studentId: "1", note: "Needs improvement in data structures", date: "2023-06-10" },
    { id: "3", studentId: "2", note: "Very good at problem-solving", date: "2023-05-20" },
  ];

  const handleAddNote = (studentId: string) => {
    if (newNote.trim()) {
      // In a real app, this would be an API call to add a note
      toast({
        title: "Note Added",
        description: "Your note has been saved successfully",
      });
      setNewNote("");
    } else {
      toast({
        title: "Empty Note",
        description: "Please enter some text before saving",
        variant: "destructive",
      });
    }
  };

  const handleScheduleMeeting = (studentId: string) => {
    toast({
      title: "Meeting Scheduled",
      description: "Meeting request has been sent to the student",
    });
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
          <TabsTrigger value="notes">Notes & Progress</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
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
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveTab("notes")}
                    >
                      View Notes
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleScheduleMeeting(mentee.id)}
                    >
                      Schedule Meeting
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4 mt-4">
          <div className="flex flex-col gap-4">
            {mentees.map((mentee) => (
              <Card key={`notes-${mentee.id}`}>
                <CardHeader>
                  <CardTitle>{mentee.name}</CardTitle>
                  <CardDescription>{mentee.usn}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {menteeNotes
                      .filter(note => note.studentId === mentee.id)
                      .map(note => (
                        <div key={note.id} className="border rounded-md p-3">
                          <div className="flex justify-between text-sm text-muted-foreground mb-1">
                            <span>Note</span>
                            <span>{note.date}</span>
                          </div>
                          <p>{note.note}</p>
                        </div>
                      ))
                    }
                    <div className="pt-2">
                      <Textarea 
                        placeholder="Add a new note..." 
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="mb-2"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => handleAddNote(mentee.id)}
                      >
                        Save Note
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>Scheduled meetings with your mentees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-center py-8 text-muted-foreground">No upcoming meetings scheduled</p>
                <div className="flex flex-col gap-4 mt-4">
                  <Input type="datetime-local" />
                  <select className="w-full p-2 border rounded-md">
                    {mentees.map(mentee => (
                      <option key={mentee.id} value={mentee.id}>{mentee.name}</option>
                    ))}
                  </select>
                  <Input placeholder="Meeting topic" />
                  <Button className="w-full">Schedule New Meeting</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherMentoring;
