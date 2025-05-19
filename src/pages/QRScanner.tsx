
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const QRScanner: React.FC = () => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // This would use a real QR scanner library in production
  const startScanning = () => {
    setScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      // Mock QR scan result
      const mockResult = {
        subjectId: "1",
        subjectCode: "CS301",
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
      toast.success("Attendance marked successfully for Data Structures (CS301)");
    }, 1000);
  };

  const resetScanner = () => {
    setScanned(false);
    setScanResult(null);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Scan Attendance QR Code</h1>
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Attendance QR Scanner</CardTitle>
          <CardDescription>
            Scan the QR code displayed by your teacher to mark your attendance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-lg overflow-hidden aspect-square relative">
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="animate-ping absolute h-16 w-16 rounded-full bg-scahts-600 opacity-75"></div>
                <div className="relative h-16 w-16 rounded-full bg-scahts-500"></div>
              </div>
            )}
            
            {scanned && scanResult && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <svg
                    className="h-16 w-16 text-green-500 mx-auto"
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
                  <h3 className="text-xl font-semibold mt-2">Success!</h3>
                  <p className="text-sm mt-1">Your attendance has been recorded</p>
                  <p className="text-sm mt-1 font-medium">Data Structures (CS301)</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date().toLocaleTimeString()} • {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
            
            {!scanning && !scanned && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
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
                    d="M12 4v1m6 11h2m-2 0h-2m0 0V4m0 12v4M4 12h14M4 12c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3z"
                  />
                </svg>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Press the button below to start scanning
                </p>
              </div>
            )}
          </div>
          
          {!scanned ? (
            <Button
              onClick={startScanning}
              disabled={scanning}
              className="w-full bg-scahts-700 hover:bg-scahts-800"
            >
              {scanning ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                  Scanning...
                </div>
              ) : (
                "Scan QR Code"
              )}
            </Button>
          ) : (
            <Button onClick={resetScanner} variant="outline" className="w-full">
              Scan Another QR Code
            </Button>
          )}
          
          <p className="text-xs text-center text-muted-foreground">
            Make sure the QR code is clearly visible and within the frame
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;
