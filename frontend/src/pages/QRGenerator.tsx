
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import QRCode from "qrcode.react";

interface Subject {
  id: string;
  name: string;
  code: string;
  semester: number;
}

const QRGenerator: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [qrValue, setQrValue] = useState<string>("");
  const [expiryTime, setExpiryTime] = useState<number>(5); // minutes
  const [countdown, setCountdown] = useState<number>(0);
  const [countdownActive, setCountdownActive] = useState<boolean>(false);

  // Mock subjects data - would come from API in real app
  const subjects: Subject[] = [
    { id: "1", name: "Data Structures", code: "CS301", semester: 3 },
    { id: "2", name: "Database Systems", code: "CS302", semester: 3 },
    { id: "3", name: "Computer Networks", code: "CS303", semester: 3 },
    { id: "4", name: "Web Development", code: "CS304", semester: 3 },
  ];

  // Handle countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (countdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && countdownActive) {
      setCountdownActive(false);
      setQrValue("");
      toast.info("QR Code has expired. Generate a new one.");
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, countdownActive]);

  const generateQRCode = () => {
    if (!selectedSubject) {
      toast.error("Please select a subject first");
      return;
    }

    // Create a QR code with encoded data
    const subject = subjects.find((s) => s.id === selectedSubject);
    const timestamp = new Date().toISOString();
    const expiryTimestamp = new Date(Date.now() + expiryTime * 60 * 1000).toISOString();
    
    const qrData = JSON.stringify({
      subjectId: selectedSubject,
      subjectCode: subject?.code,
      teacherId: "3", // Would be actual teacher ID in real app
      timestamp: timestamp,
      expiresAt: expiryTimestamp,
    });

    setQrValue(qrData);
    setCountdown(expiryTime * 60); // Convert minutes to seconds
    setCountdownActive(true);
    toast.success(`QR code generated for ${subject?.name}. Valid for ${expiryTime} minutes.`);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Generate Attendance QR Code</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>QR Code Generator</CardTitle>
            <CardDescription>
              Create a QR code for students to scan and mark their attendance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Select Subject</Label>
              <Select
                value={selectedSubject}
                onValueChange={(value) => setSelectedSubject(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry">Validity Period (minutes)</Label>
              <Select
                value={expiryTime.toString()}
                onValueChange={(value) => setExpiryTime(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select validity period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full bg-scahts-700 hover:bg-scahts-800" 
              onClick={generateQRCode}
              disabled={!selectedSubject || countdownActive}
            >
              Generate QR Code
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
            <CardDescription>
              Show this QR code to your students or display it on a projector
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            {qrValue ? (
              <>
                <div className="border-4 border-scahts-100 p-4 rounded-lg shadow-md">
                  <QRCode 
                    value={qrValue}
                    size={240}
                    level="H"
                    renderAs="svg"
                  />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Subject: {subjects.find((s) => s.id === selectedSubject)?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Code: {subjects.find((s) => s.id === selectedSubject)?.code}
                  </p>
                  <p className="mt-2 text-xl font-bold">
                    Expires in: {formatTime(countdown)}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                <svg
                  className="h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-4">
                  Select a subject and generate a QR code for attendance
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRGenerator;
