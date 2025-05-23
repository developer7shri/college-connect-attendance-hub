
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
import AddTeacherDialog from "@/components/dialogs/AddTeacherDialog";

const Teachers = () => {
  const { authState, getUsersByRole, getUsersByDepartment } = useAuth();
  const [addTeacherDialogOpen, setAddTeacherDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Get teachers based on user role
  const allTeachers = authState.user?.role === "admin" 
    ? getUsersByRole("teacher")
    : getUsersByDepartment(authState.user?.department || "").filter(user => user.role === "teacher");
  
  // Filter teachers based on search term
  const teachers = allTeachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.subjectName && teacher.subjectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (teacher.subjectCode && teacher.subjectCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (teacher.phone && teacher.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <Button onClick={() => setAddTeacherDialogOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add New Teacher
          </Button>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input 
          placeholder="Search teachers by name, email, subject or phone..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 mb-4"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of all teachers{authState.user?.role === "hod" ? " in your department" : ""}.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No teachers found</TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher: User) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.department}</TableCell>
                  <TableCell>
                    {teacher.subjectName ? (
                      <>
                        {teacher.subjectName}
                        {teacher.subjectCode && <span className="text-xs text-muted-foreground ml-1">({teacher.subjectCode})</span>}
                      </>
                    ) : (
                      <span className="text-muted-foreground">Not assigned</span>
                    )}
                  </TableCell>
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
