
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const StudentMentoring: React.FC = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");

  // Mock data - in a real app this would come from API
  const mentor = {
    id: "1",
    name: "Dr. Robert Smith",
    department: "Computer Science",
    email: "robert.smith@scahts.edu",
    phone: "123-456-7890",
    meetingHours: "Monday and Wednesday, 2-4 PM"
  };

  const notes = [
    { id: "1", content: "Excellent progress in programming fundamentals", date: "2023-05-15" },
    { id: "2", content: "Needs improvement in data structures", date: "2023-06-10" },
    { id: "3", content: "Very good at problem-solving", date: "2023-05-20" },
  ];

  const meetings = [
    { id: "1", date: "2023-06-01", time: "14:00", status: "completed", topic: "Academic Progress Review" },
    { id: "2", date: "2023-07-15", time: "15:30", status: "upcoming", topic: "Career Guidance Discussion" },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      toast({
        title: "Message Sent",
        description: "Your message has been sent to your mentor",
      });
      setMessage("");
    } else {
      toast({
        title: "Empty Message",
        description: "Please enter some text before sending",
        variant: "destructive",
      });
    }
  };

  const handleRequestMeeting = () => {
    toast({
      title: "Meeting Requested",
      description: "Your meeting request has been sent to your mentor",
    });
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
    </div>
  );
};

export default StudentMentoring;
