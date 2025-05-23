
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, UserCog, Search } from "lucide-react";
import { User } from "@/types";
import AddStudentDialog from "@/components/dialogs/AddStudentDialog";

const Students = () => {
  const { authState, getUsersByRole, getUsersByDepartment } = useAuth();
  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Check if the current user can add students (teacher or HOD)
  const canAddStudents = ["teacher", "hod"].includes(authState.user?.role || "");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">
            Manage students, view their details, and monitor their academic progress.
          </p>
        </div>
        {canAddStudents && (
          <Button onClick={() => setAddStudentDialogOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add New Student
          </Button>
        )}
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
                    <Button variant="ghost" size="sm">
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

      <AddStudentDialog
        open={addStudentDialogOpen}
        onOpenChange={setAddStudentDialogOpen}
      />
    </div>
  );
};

export default Students;
