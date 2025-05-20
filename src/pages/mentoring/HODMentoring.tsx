
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/types";

const HODMentoring: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("teachers");
  const [newNote, setNewNote] = useState("");

  // Mock data - in a real app this would come from API
  const teachers = [
    { id: "1", name: "Dr. Robert Smith", department: "Computer Science", mentees: 8 },
    { id: "2", name: "Prof. Sarah Johnson", department: "Computer Science", mentees: 10 },
    { id: "3", name: "Dr. Michael Brown", department: "Computer Science", mentees: 5 },
  ];

  const mentees: Student[] = [
    { id: "1", name: "John Doe", usn: "1XX22CS001", email: "john.doe@example.com", department: "Computer Science", semester: 4 },
    { id: "2", name: "Jane Smith", usn: "1XX22CS002", email: "jane.smith@example.com", department: "Computer Science", semester: 4 },
  ];

  const handleAddNote = (studentId: string) => {
    if (newNote.trim()) {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Department Mentoring</h1>
        <p className="text-muted-foreground">
          Overview of mentorship activities within your department
        </p>
      </div>

      <Tabs defaultValue="teachers" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="students">My Mentees</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="teachers" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teachers.map((teacher) => (
              <Card key={teacher.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${teacher.name}`} />
                    <AvatarFallback>{teacher.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{teacher.name}</CardTitle>
                    <CardDescription>{teacher.department}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mentees:</span>
                      <span>{teacher.mentees}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
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
            ))}
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4 mt-4">
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
                      <span className="text-muted-foreground">Semester:</span>
                      <span>{mentee.semester}</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Textarea 
                      placeholder="Add a new note..." 
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="mb-2"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleAddNote(mentee.id)}
                      className="w-full"
                    >
                      Save Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                  <Button variant="outline">Download</Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Student Progress Report</h3>
                    <p className="text-sm text-muted-foreground">Cumulative student progress data</p>
                  </div>
                  <Button variant="outline">Download</Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Teacher Performance Report</h3>
                    <p className="text-sm text-muted-foreground">Mentoring effectiveness metrics</p>
                  </div>
                  <Button variant="outline">Download</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HODMentoring;
