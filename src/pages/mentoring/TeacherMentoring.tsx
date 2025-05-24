
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  Award, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Search
} from "lucide-react";

const TeacherMentoring = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("students");

  // Dummy data for students (replace with actual data fetching)
  const students = [
    {
      id: "1",
      name: "Alice Wonderland",
      usn: "1AY20CS001",
      attendance: 92,
      academicPerformance: "Good",
      achievements: 3,
      lastSession: "2024-08-15",
    },
    {
      id: "2",
      name: "Bob The Builder",
      usn: "1AY20CS002",
      attendance: 78,
      academicPerformance: "Average",
      achievements: 1,
      lastSession: "2024-08-10",
    },
    {
      id: "3",
      name: "Charlie Chaplin",
      usn: "1AY20CS003",
      attendance: 65,
      academicPerformance: "Poor",
      achievements: 0,
      lastSession: "2024-08-01",
    },
  ];

  // Dummy data for mentoring sessions
  const mentoringSessions = [
    {
      id: "1",
      studentId: "1",
      date: "2024-08-15",
      duration: 60,
      topics: ["React Basics", "State Management"],
      status: "completed",
    },
    {
      id: "2",
      studentId: "2",
      date: "2024-08-10",
      duration: 45,
      topics: ["JavaScript Fundamentals", "DOM Manipulation"],
      status: "completed",
    },
    {
      id: "3",
      studentId: "3",
      date: "2024-08-01",
      duration: 30,
      topics: ["HTML Structure", "CSS Styling"],
      status: "completed",
    },
  ];

  // Dummy data for student achievements
  const studentAchievements = [
    {
      id: "1",
      studentId: "1",
      title: "Hackathon Winner",
      date: "2024-07-20",
      description: "Won first place in the national hackathon.",
    },
    {
      id: "2",
      studentId: "2",
      title: "Coding Competition Finalist",
      date: "2024-06-15",
      description: "Reached the finals of the coding competition.",
    },
  ];

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.usn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mentoring</h1>
          <p className="text-muted-foreground">
            Manage mentoring sessions, track student progress, and view achievements.
          </p>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <div className="relative">
          <Input
            placeholder="Search students..."
            className="pl-10 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="students">
            <Users className="mr-2 h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Clock className="mr-2 h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Award className="mr-2 h-4 w-4" />
            Achievements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <CardHeader className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold">{student.name}</CardTitle>
                    <CardDescription className="text-gray-500">{student.usn}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span>Attendance: {student.attendance}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Performance: {student.academicPerformance}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-green-500" />
                    <span>Achievements: {student.achievements}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Last Session: {student.lastSession}</span>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mentoring Sessions</CardTitle>
              <CardDescription>List of all mentoring sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mentoringSessions.map((session) => {
                  const student = students.find((s) => s.id === session.studentId);
                  return (
                    <div key={session.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{student?.name}</h3>
                          <p className="text-sm text-gray-500">
                            Date: {session.date}, Duration: {session.duration} mins
                          </p>
                          <p className="text-sm text-gray-500">
                            Topics: {session.topics.join(", ")}
                          </p>
                        </div>
                        <div>
                          {session.status === "completed" ? (
                            <Badge variant="outline" className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              <span>Completed</span>
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              <span>{session.status}</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Achievements</CardTitle>
              <CardDescription>List of student achievements and certificates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentAchievements.map((achievement) => {
                  const student = students.find((s) => s.id === achievement.studentId);
                  return (
                    <div key={achievement.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-gray-500">Date: {achievement.date}</p>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          {student && (
                            <div className="mt-2 flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-500">Student: {student.name}</span>
                            </div>
                          )}
                        </div>
                        <Button variant="outline">View Certificate</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherMentoring;
