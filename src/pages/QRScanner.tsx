
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

const QRScanner: React.FC = () => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // This would use a real QR scanner library in production
  const startScanning = () => {
    setScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      // Mock QR scan result
      const mockResult = {
        subjectId: "1",
        subjectCode: "CS301",
        subjectName: "Data Structures",
        teacherId: "3",
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      };
      
      // Process scanned data
      handleScanSuccess(mockResult);
    }, 2000);
  };

  const handleScanSuccess = (data: any) => {
    setScanning(false);
    setScanned(true);
    setScanResult(data);
    
    // Simulate API call to mark attendance
    setTimeout(() => {
      toast.success(`Attendance marked successfully for ${data.subjectName} (${data.subjectCode})`);
    }, 1000);
  };

  const resetScanner = () => {
    setScanned(false);
    setScanResult(null);
  };

  const goToDashboard = () => {
    navigate("/student/dashboard");
  };

  return (
    <div className="w-full mx-auto py-4 md:py-8 px-2 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Scan Attendance QR Code</h1>
      
      <Card className="max-w-md mx-auto">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl md:text-2xl">Attendance QR Scanner</CardTitle>
          <CardDescription className="text-sm">
            Scan the QR code displayed by your teacher to mark your attendance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="border rounded-lg overflow-hidden aspect-square relative">
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="animate-ping absolute h-12 w-12 md:h-16 md:w-16 rounded-full bg-scahts-600 opacity-75"></div>
                <div className="relative h-12 w-12 md:h-16 md:w-16 rounded-full bg-scahts-500"></div>
              </div>
            )}
            
            {scanned && scanResult && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 p-2 md:p-4">
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg text-center">
                  <svg
                    className="h-12 w-12 md:h-16 md:w-16 text-green-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <h3 className="text-lg md:text-xl font-semibold mt-2">Success!</h3>
                  <p className="text-sm mt-1">Your attendance has been recorded</p>
                  <p className="text-sm mt-1 font-medium">{scanResult.subjectName} ({scanResult.subjectCode})</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date().toLocaleTimeString()} • {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
            
            {!scanning && !scanned && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                <svg
                  className="h-12 w-12 md:h-16 md:w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v1m6 11h2m-2 0h-2m0 0V4m0 12v4M4 12h14M4 12c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3z"
                  />
                </svg>
                <p className="text-center text-sm text-muted-foreground mt-4 px-2">
                  Press the button below to start scanning
                </p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-2">
            {!scanned ? (
              <Button
                onClick={startScanning}
                disabled={scanning}
                className="w-full bg-scahts-700 hover:bg-scahts-800 py-2.5"
              >
                {scanning ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                    Scanning...
                  </div>
                ) : (
                  "Scan QR Code"
                )}
              </Button>
            ) : (
              <>
                <Button onClick={resetScanner} variant="outline" className="w-full py-2.5">
                  Scan Another QR Code
                </Button>
                <Button onClick={goToDashboard} className="w-full py-2.5 bg-scahts-700 hover:bg-scahts-800">
                  Return to Dashboard
                </Button>
              </>
            )}
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Make sure the QR code is clearly visible and within the frame
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;
