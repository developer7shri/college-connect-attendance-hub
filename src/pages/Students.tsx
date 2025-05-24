
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, UserCog, Search, Phone, Mail, BookOpen, GraduationCap } from "lucide-react";
import { User } from "@/types";
import AddStudentDialog from "@/components/dialogs/AddStudentDialog";
import EditStudentDialog from "@/components/dialogs/EditStudentDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Students = () => {
  const { authState, getUsersByRole, getUsersByDepartment } = useAuth();
  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);
  const [editStudentDialogOpen, setEditStudentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Get students based on user role
  const allStudents = authState.user?.role === "admin" 
    ? getUsersByRole("student")
    : getUsersByDepartment(authState.user?.department || "").filter(user => user.role === "student");
  
  // Filter students based on search term
  const students = allStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.usn && student.usn.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.phone && student.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.semester && student.semester.toString().includes(searchTerm))
  );

  // Check if the current user can add students (admin, teacher or HOD)
  const canAddStudents = ["admin", "teacher", "hod"].includes(authState.user?.role || "");

  // Handle edit button click
  const handleEditStudent = (student: User) => {
    setSelectedStudent(student);
    setEditStudentDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">
            Manage students, view their details, and monitor their academic progress.
          </p>
        </div>
        <div className="flex gap-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "cards")}>
            <TabsList>
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
            </TabsList>
          </Tabs>
          {canAddStudents && (
            <Button onClick={() => setAddStudentDialogOpen(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Student
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input 
          placeholder="Search students by name, email, USN, phone..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 mb-4"
        />
      </div>

      {viewMode === "table" ? (
        <div className="rounded-md border">
          <Table>
            <TableCaption>A list of all students{authState.user?.role !== "admin" ? " in your department" : ""}.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>USN</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No students found</TableCell>
                </TableRow>
              ) : (
                students.map((student: User) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.usn || "Not available"}</TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>{student.semester || "Not available"}</TableCell>
                    <TableCell>{student.phone || "Not available"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleEditStudent(student)}>
                        <UserCog className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {students.length === 0 ? (
            <div className="col-span-full text-center p-8 border rounded-lg bg-muted/10">
              <p className="text-muted-foreground">No students found</p>
            </div>
          ) : (
            students.map((student: User) => (
              <Card key={student.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="bg-muted/30 pb-2">
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <CardDescription className="flex flex-col gap-1">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5" /> 
                      {student.usn || "No USN"}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" /> 
                      Semester: {student.semester || "N/A"}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{student.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{student.phone || "No phone number"}</span>
                    </div>
                    <div className="mt-2 py-2 px-3 bg-primary/5 rounded-md text-sm">
                      <span className="font-medium">Department:</span> {student.department}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/20 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => handleEditStudent(student)}
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Edit Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}

      <AddStudentDialog
        open={addStudentDialogOpen}
        onOpenChange={setAddStudentDialogOpen}
      />
      
      {selectedStudent && (
        <EditStudentDialog
          open={editStudentDialogOpen}
          onOpenChange={setEditStudentDialogOpen}
          student={selectedStudent}
        />
      )}
    </div>
  );
};

export default Students;
