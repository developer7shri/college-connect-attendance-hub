import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// It's good practice to import useAuth if we anticipate needing department/user data,
// but for this step, we'll mock data or leave placeholders.
// import { useAuth } from '@/contexts/AuthContext';

type SendToOption = 'everyone' | 'teachers' | 'students';

// Mock semester data - in a real app, this might come from context or API
const semesters = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8", "All Semesters"];

const NotificationSystemPage: React.FC = () => {
  // const { departments } = useAuth(); // Example: if departments are needed
  const [sendTo, setSendTo] = useState<SendToOption>('everyone');
  const [selectedSemester, setSelectedSemester] = useState<string>(semesters[semesters.length -1]); // Default to "All Semesters"
  const [notificationMessage, setNotificationMessage] = useState<string>('');

  // Placeholder for fetching department data
  // const currentDepartment = departments.length > 0 ? departments[0].name : "your department"; 
  // For now, let's use a static value or assume "the" department contextually
  const currentDepartment = "the department"; 


  const handleSendNotification = () => {
    if (!notificationMessage.trim()) {
      // Maybe show a toast notification here in a real app
      console.warn("Notification message is empty.");
      return;
    }
    
    const notificationDetails = {
      sendTo,
      department: currentDepartment, // This would be dynamic in a multi-department setup
      message: notificationMessage,
      ...(sendTo === 'students' && { semester: selectedSemester }),
    };

    console.log("Sending notification:", notificationDetails);
    // In a real application, this would involve an API call.
    // Example: sendNotification(notificationDetails);

    // Clear message after sending (optional)
    // setNotificationMessage(''); 
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notification System</h1>
        <p className="text-muted-foreground">
          Send notifications to various user groups within {currentDepartment}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compose Notification</CardTitle>
          <CardDescription>
            Select the target audience and write your message.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sendTo">Send notifications to:</Label>
            <RadioGroup
              id="sendTo"
              value={sendTo}
              onValueChange={(value: string) => setSendTo(value as SendToOption)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="everyone" id="everyone" />
                <Label htmlFor="everyone">Everyone in {currentDepartment}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teachers" id="teachers" />
                <Label htmlFor="teachers">All Teachers in {currentDepartment}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="students" id="students" />
                <Label htmlFor="students">All Students in {currentDepartment}</Label>
              </div>
            </RadioGroup>
          </div>

          {sendTo === 'students' && (
            <div className="space-y-2">
              <Label htmlFor="semester">Select Semester:</Label>
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger id="semester" className="w-[280px]">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notificationMessage">Message:</Label>
            <Textarea
              id="notificationMessage"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Type your notification message here..."
              rows={5}
            />
          </div>

          <Button onClick={handleSendNotification}>
            Send Notification
          </Button>
        </CardContent>
      </Card>
      
      {/* 
        Placeholder for data fetching and actions:
        - Fetch department list (if admin manages multiple departments)
        - Fetch semester list (if dynamic)
        - Actual API call for sending notification
      */}
    </div>
  );
};

export default NotificationSystemPage;
