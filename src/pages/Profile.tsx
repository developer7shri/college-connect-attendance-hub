
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Building, BookOpen, Calendar } from "lucide-react";

const Profile = () => {
  const { authState } = useAuth();
  const { user } = authState;

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRandomActivity = () => {
    const activities = [
      "Updated attendance record",
      "Submitted a leave request",
      "Attended a mentoring session",
      "Viewed class schedule",
      "Downloaded attendance report"
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  };

  const getRandomDate = () => {
    const days = ["Today", "Yesterday", "3 days ago", "Last week", "2 weeks ago"];
    return days[Math.floor(Math.random() * days.length)];
  };

  const activities = Array.from({ length: 5 }, () => ({
    activity: getRandomActivity(),
    date: getRandomDate()
  }));

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">
          View and manage your profile information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.profileImageUrl} alt={user.name} />
                  <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
                <Badge className="mb-2">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Badge>
                <p className="text-muted-foreground text-sm mb-4">{user.email}</p>
                <Button 
                  variant="outline" 
                  className="w-full mb-2"
                  onClick={() => toast.info("This feature is coming soon")}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => toast.info("This feature is coming soon")}
                >
                  Change Avatar
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">+91 98765XXXXX</span>
                </div>
                {user.department && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.department} Department</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>About Me</CardTitle>
              <CardDescription>Your personal bio and information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {user.role === "student" 
                  ? "Dedicated student passionate about learning and growth. Active participant in classroom activities and eager to expand knowledge through practical applications." 
                  : user.role === "teacher" 
                    ? "Experienced educator committed to fostering a supportive learning environment. Specialized in interactive teaching methodologies that engage students and encourage critical thinking."
                    : user.role === "hod"
                      ? "Department Head with extensive experience in academic leadership. Committed to maintaining educational excellence and fostering innovation within the department."
                      : "Administrator responsible for overseeing the college attendance management system. Focused on improving efficiency and accuracy of attendance tracking."}
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Education</h3>
                  </div>
                  <p className="text-sm">
                    {user.role === "student" 
                      ? "Bachelor of Technology - Computer Science" 
                      : "Ph.D in Computer Science - Stanford University"}
                  </p>
                </div>
                
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <h3 className="font-medium">Joined</h3>
                  </div>
                  <p className="text-sm">August 2022</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="text-sm">{item.activity}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
