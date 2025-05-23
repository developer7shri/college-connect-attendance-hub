
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
import AddTeacherDialog from "@/components/dialogs/AddTeacherDialog";

const Teachers = () => {
  const { authState, getUsersByRole, getUsersByDepartment } = useAuth();
  const [addTeacherDialogOpen, setAddTeacherDialogOpen] = useState(false);

  // Get teachers based on user role
  const teachers = authState.user?.role === "admin" 
    ? getUsersByRole("teacher")
    : getUsersByDepartment(authState.user?.department || "").filter(user => user.role === "teacher");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="text-muted-foreground">
            Manage teachers and their assigned subjects.
          </p>
        </div>
        {authState.user?.role === "hod" && (
          <Button onClick={() => setAddTeacherDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Teacher
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of all teachers{authState.user?.role === "hod" ? " in your department" : ""}.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No teachers found</TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher: User) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.department}</TableCell>
                  <TableCell>{teacher.phone || "Not available"}</TableCell>
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

      <AddTeacherDialog
        open={addTeacherDialogOpen}
        onOpenChange={setAddTeacherDialogOpen}
      />
    </div>
  );
};

export default Teachers;
