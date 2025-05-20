
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StudentAttendance: React.FC = () => {
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  // Mock data - in a real app this would come from API
  const subjects = [
    { id: "1", name: "Data Structures", code: "CS301", present: 32, absent: 4 },
    { id: "2", name: "Database Systems", code: "CS302", present: 28, absent: 8 },
    { id: "3", name: "Computer Networks", code: "CS303", present: 30, absent: 6 },
    { id: "4", name: "Web Development", code: "CS304", present: 34, absent: 2 },
  ];

  const attendanceHistory = [
    { date: "2023-05-01", subject: "Data Structures", status: "present" },
    { date: "2023-05-02", subject: "Database Systems", status: "present" },
    { date: "2023-05-03", subject: "Computer Networks", status: "absent" },
    { date: "2023-05-03", subject: "Web Development", status: "present" },
    { date: "2023-05-04", subject: "Data Structures", status: "present" },
    { date: "2023-05-05", subject: "Database Systems", status: "present" },
  ];

  const calculatePercentage = (present: number, total: number) => {
    return Math.round((present / total) * 100);
  };

  const handleViewDetails = (subjectId: string) => {
    toast({
      title: "Viewing Details",
      description: `Showing attendance details for subject ID: ${subjectId}`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Attendance</h1>
        <p className="text-muted-foreground">
          Track and monitor your attendance records
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {subjects.map((subject) => {
              const percentage = calculatePercentage(
                subject.present,
                subject.present + subject.absent
              );
              return (
                <Card key={subject.id}>
                  <CardHeader>
                    <CardTitle>{subject.name}</CardTitle>
                    <CardDescription>{subject.code}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Attendance:</span>
                          <span 
                            className={`text-sm font-medium ${
                              percentage >= 75 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              percentage >= 75 ? "bg-green-600" : "bg-red-600"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            Present: {subject.present}
                          </span>
                        </div>
                        <div>
                          <span className="flex items-center gap-1">
                            <XCircle className="h-4 w-4 text-red-600" />
                            Absent: {subject.absent}
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleViewDetails(subject.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>
                Record of your past attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceHistory.map((record, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{record.subject}</p>
                      <p className="text-sm text-muted-foreground">{record.date}</p>
                    </div>
                    <div>
                      {record.status === "present" ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          Present
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600">
                          <XCircle className="h-4 w-4" />
                          Absent
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Calendar</CardTitle>
              <CardDescription>
                View your attendance on a calendar
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
          
          {date && (
            <Card>
              <CardHeader>
                <CardTitle>{date.toDateString()}</CardTitle>
                <CardDescription>
                  Attendance for selected date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {attendanceHistory
                    .filter((record) => record.date === date.toISOString().split("T")[0])
                    .map((record, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <p>{record.subject}</p>
                        <p 
                          className={
                            record.status === "present"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {record.status === "present" ? "Present" : "Absent"}
                        </p>
                      </div>
                    ))
                  }
                  {!attendanceHistory.some(
                    (record) => record.date === date.toISOString().split("T")[0]
                  ) && <p className="text-center text-muted-foreground">No attendance records for this date</p>}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentAttendance;
