
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
import { UserPlus, UserCog } from "lucide-react";
import { User } from "@/types";
import AddStudentDialog from "@/components/dialogs/AddStudentDialog";

const Students = () => {
  const { authState, getUsersByRole, getUsersByDepartment } = useAuth();
  const [addStudentDialogOpen, setAddStudentDialogOpen] = useState(false);

  // Get students based on user role
  const students = authState.user?.role === "admin" 
    ? getUsersByRole("student")
    : getUsersByDepartment(authState.user?.department || "").filter(user => user.role === "student");

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
          <Button onClick={() => setAddStudentDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Student
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of all students{authState.user?.role !== "admin" ? " in your department" : ""}.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No students found</TableCell>
              </TableRow>
            ) : (
              students.map((student: User) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.department}</TableCell>
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
