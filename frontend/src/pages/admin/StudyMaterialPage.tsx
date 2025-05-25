import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input'; // For file input
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { useAuth } from '@/contexts/AuthContext'; // Placeholder for future use

type ShareWithOption = 'everyone' | 'teachers' | 'students';

// Mock semester data - in a real app, this might come from context or API
const semesters = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8", "All Semesters"];

const StudyMaterialPage: React.FC = () => {
  // const { departments } = useAuth(); // Example
  const [shareWith, setShareWith] = useState<ShareWithOption>('everyone');
  const [selectedSemester, setSelectedSemester] = useState<string>(semesters[semesters.length - 1]);
  const [studyMaterialFile, setStudyMaterialFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Placeholder for department data
  const currentDepartment = "the department";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Basic validation (e.g., file type, size) can be added here
      // For now, just accept common document types as an example
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (allowedTypes.includes(file.type)) {
        setStudyMaterialFile(file);
        setFileError(null);
      } else {
        setStudyMaterialFile(null);
        setFileError('Invalid file type. Please upload PDF, DOC, DOCX, or TXT.');
      }
    } else {
      setStudyMaterialFile(null);
      setFileError(null);
    }
  };

  const handleShareMaterial = () => {
    if (!studyMaterialFile) {
      // Show toast: "Please select a file to upload."
      console.warn("No study material file selected.");
      setFileError("Please select a file to upload.");
      return;
    }
    if (fileError) {
      console.warn("Cannot share due to file error:", fileError);
      return;
    }

    const materialDetails = {
      fileName: studyMaterialFile.name,
      fileType: studyMaterialFile.type,
      fileSize: studyMaterialFile.size,
      shareWith,
      department: currentDepartment,
      ...(shareWith === 'students' && { semester: selectedSemester }),
    };

    console.log("Sharing study material:", materialDetails);
    // In a real application, this would involve:
    // 1. Uploading the file to a server/storage.
    // 2. Getting a shareable link.
    // 3. Storing metadata and the link.
    // 4. Potentially sending notifications about the new material.
    // Example: uploadAndShareMaterial(studyMaterialFile, materialDetails);

    // Clear file input after sharing (optional, might need to reset the input field value)
    // setStudyMaterialFile(null); 
    // const fileInput = document.getElementById('studyMaterialFile') as HTMLInputElement;
    // if (fileInput) fileInput.value = '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Study Material Management</h1>
        <p className="text-muted-foreground">
          Upload and share study materials for {currentDepartment}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Study Material</CardTitle>
          <CardDescription>
            Select a file and choose who to share it with.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studyMaterialFile">Study Material File:</Label>
            <Input 
              id="studyMaterialFile" 
              type="file" 
              onChange={handleFileChange} 
              accept=".pdf,.doc,.docx,.txt" // Basic client-side filter
            />
            {fileError && <p className="text-sm text-red-600">{fileError}</p>}
            {studyMaterialFile && !fileError && <p className="text-sm text-muted-foreground">Selected file: {studyMaterialFile.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shareWith">Share material links to:</Label>
            <RadioGroup
              id="shareWith"
              value={shareWith}
              onValueChange={(value: string) => setShareWith(value as ShareWithOption)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="everyone" id="shareEveryone" />
                <Label htmlFor="shareEveryone">Everyone in {currentDepartment}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teachers" id="shareTeachers" />
                <Label htmlFor="shareTeachers">All Teachers in {currentDepartment}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="students" id="shareStudents" />
                <Label htmlFor="shareStudents">All Students in {currentDepartment}</Label>
              </div>
            </RadioGroup>
          </div>

          {shareWith === 'students' && (
            <div className="space-y-2">
              <Label htmlFor="semesterShare">Select Semester:</Label>
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger id="semesterShare" className="w-[280px]">
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

          <Button onClick={handleShareMaterial}>
            Upload and Share Material
          </Button>
        </CardContent>
      </Card>

      {/* 
        Placeholder for data fetching and actions:
        - Fetch department list
        - Fetch semester list (if dynamic)
        - Actual API call for uploading file and sharing material link
      */}
    </div>
  );
};

export default StudyMaterialPage;
