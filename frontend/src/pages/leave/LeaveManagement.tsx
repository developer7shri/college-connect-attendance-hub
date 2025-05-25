
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LeaveRequest } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const LeaveManagement: React.FC = () => {
  const { toast } = useToast();
  const { authState } = useAuth();
  const [activeTab, setActiveTab] = useState("apply");
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [leaveType, setLeaveType] = useState("sick");

  // Mock data for leave requests
  const leaveRequests: LeaveRequest[] = [
    {
      id: "1",
      studentId: "s1",
      reason: "Medical appointment",
      fromDate: "2023-05-15",
      toDate: "2023-05-16",
      status: "approved",
      approvedBy: "Prof. Sarah Johnson",
      approvedAt: "2023-05-10",
      createdAt: "2023-05-08"
    },
    {
      id: "2",
      studentId: "s1",
      reason: "Family function",
      fromDate: "2023-06-01",
      toDate: "2023-06-03",
      status: "pending",
      createdAt: "2023-05-20"
    },
    {
      id: "3",
      studentId: "s1",
      reason: "Personal reasons",
      fromDate: "2023-04-10",
      toDate: "2023-04-11",
      status: "rejected",
      approvedBy: "Dr. Robert Smith",
      approvedAt: "2023-04-09",
      createdAt: "2023-04-05"
    }
  ];

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromDate || !toDate) {
      toast({
        title: "Missing Information",
        description: "Please select both start and end dates",
        variant: "destructive"
      });
      return;
    }
    
    if (!reason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a reason for your leave",
        variant: "destructive"
      });
      return;
    }

    if (fromDate > toDate) {
      toast({
        title: "Invalid Date Range",
        description: "End date cannot be before start date",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been submitted successfully"
    });

    // Reset form
    setReason("");
    setFromDate(undefined);
    setToDate(undefined);
    setLeaveType("sick");
    setActiveTab("history");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leave Management</h1>
        <p className="text-muted-foreground">
          {authState.user?.role === "student" 
            ? "Apply for leave and track your leave requests" 
            : "Manage student leave requests and approvals"}
        </p>
      </div>

      <Tabs defaultValue="apply" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="apply">Apply for Leave</TabsTrigger>
          <TabsTrigger value="history">Leave History</TabsTrigger>
          <TabsTrigger value="policy">Leave Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="apply" className="space-y-4 mt-4">
          <Card>
            <form onSubmit={handleLeaveSubmit}>
              <CardHeader>
                <CardTitle>New Leave Application</CardTitle>
                <CardDescription>
                  Submit your leave request for approval
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <select 
                    id="leaveType"
                    className="w-full border border-input rounded-md h-10 px-3"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                  >
                    <option value="sick">Sick Leave</option>
                    <option value="personal">Personal Leave</option>
                    <option value="family">Family Emergency</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="reason">Reason for Leave</Label>
                  <Textarea 
                    id="reason"
                    placeholder="Please explain the reason for your leave request"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label>From Date</Label>
                    <div className="border rounded-md p-2">
                      <Calendar
                        mode="single"
                        selected={fromDate}
                        onSelect={setFromDate}
                        disabled={(date) => date < new Date()}
                        className="mx-auto"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label>To Date</Label>
                    <div className="border rounded-md p-2">
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        disabled={(date) => date < (fromDate || new Date())}
                        className="mx-auto"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="document">Supporting Document (Optional)</Label>
                  <Input
                    id="document"
                    type="file"
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload any supporting documents (PDF, JPG, PNG, max 5MB)
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Submit Leave Request
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Request History</CardTitle>
              <CardDescription>
                View all your previous leave requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests.length > 0 ? (
                  leaveRequests.map((request) => (
                    <div key={request.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">
                            {request.fromDate === request.toDate
                              ? `${request.fromDate}`
                              : `${request.fromDate} to ${request.toDate}`}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Applied on: {request.createdAt}
                          </p>
                        </div>
                        <span 
                          className={`text-xs px-2 py-1 rounded-full uppercase ${getStatusColor(request.status)}`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{request.reason}</p>
                      
                      {request.status === "approved" && (
                        <div className="text-sm text-muted-foreground">
                          <p>Approved by: {request.approvedBy}</p>
                          <p>Approved on: {request.approvedAt}</p>
                        </div>
                      )}
                      
                      {request.status === "rejected" && (
                        <div className="text-sm text-muted-foreground">
                          <p>Rejected by: {request.approvedBy}</p>
                          <p>Rejected on: {request.approvedAt}</p>
                        </div>
                      )}
                      
                      {request.status === "pending" && (
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm" className="text-xs">
                            Edit Request
                          </Button>
                          <Button variant="destructive" size="sm" className="text-xs">
                            Cancel Request
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center py-6 text-muted-foreground">
                    No leave requests found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policy" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Policy</CardTitle>
              <CardDescription>
                Information about the college leave policy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Types of Leave</h3>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>
                    <span className="font-medium">Sick Leave:</span> For medical reasons. Medical certificate required for more than 3 consecutive days.
                  </li>
                  <li>
                    <span className="font-medium">Personal Leave:</span> For personal reasons. Limited to 5 days per semester.
                  </li>
                  <li>
                    <span className="font-medium">Family Emergency:</span> For family emergencies. Supporting documents may be required.
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">Leave Application Rules</h3>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Applications should be submitted at least 3 days in advance for planned leave.</li>
                  <li>Emergency leave can be applied for retrospectively within 2 days.</li>
                  <li>Applications are reviewed by the respective class teacher and/or mentor.</li>
                  <li>Approval is subject to academic performance and previous attendance record.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">Attendance Requirements</h3>
                <p className="mt-2">
                  Students are required to maintain a minimum of 75% attendance in each subject.
                  Approved leave may be considered for attendance calculations in special cases,
                  subject to departmental approval.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaveManagement;
