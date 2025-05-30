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
import { UserPlus, UserCog, Search, Phone, Mail, Briefcase, Settings } from "lucide-react";
import { User } from "@/types";
import AddTeacherDialog from "@/components/dialogs/AddTeacherDialog";
import EditTeacherDialog from "@/components/dialogs/EditTeacherDialog";
import AssignSubjectsDialog from "@/components/dialogs/AssignSubjectsDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Teachers = () => {
  const { authState, getUsersByRole, getUsersByDepartment } = useAuth();
  const [addTeacherDialogOpen, setAddTeacherDialogOpen] = useState(false);
  const [editTeacherDialogOpen, setEditTeacherDialogOpen] = useState(false);
  const [assignSubjectsDialogOpen, setAssignSubjectsDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Get teachers based on user role
  const allTeachers = authState.user?.role === "admin" 
    ? getUsersByRole("teacher")
    : getUsersByDepartment(authState.user?.department || "").filter(user => user.role === "teacher");
  
  // Filter teachers based on search term
  const teachers = allTeachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (teacher.subjects && teacher.subjects.some(subject => 
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    )) ||
    (teacher.phone && teacher.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Only admin can add/edit teachers, HOD can only assign subjects
  const canAddTeachers = authState.user?.role === "admin";
  const canEditTeachers = authState.user?.role === "admin";
  const canAssignSubjects = authState.user?.role === "hod";

  // Handle edit button click
  const handleEditTeacher = (teacher: User) => {
    if (!canEditTeachers) return;
    setSelectedTeacher(teacher);
    setEditTeacherDialogOpen(true);
  };

  // Handle assign subjects button click
  const handleAssignSubjects = (teacher: User) => {
    setSelectedTeacher(teacher);
    setAssignSubjectsDialogOpen(true);
  };

  // Helper function to display subjects
  const displaySubjects = (subjects?: Array<{name: string; code: string}>) => {
    if (!subjects || subjects.length === 0) {
      return <span className="text-muted-foreground">Not assigned</span>;
    }
    return (
      <div className="space-y-1">
        {subjects.map((subject, index) => (
          <div key={index} className="text-sm">
            {subject.name}
            <span className="text-xs text-muted-foreground ml-1">({subject.code})</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teachers</h1>
          <p className="text-muted-foreground">
            {authState.user?.role === "admin" 
              ? "Manage teachers and their assigned subjects."
              : authState.user?.role === "hod"
                ? "View teachers in your department and assign subjects."
                : "View teachers in your department."
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "cards")}>
            <TabsList>
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
            </TabsList>
          </Tabs>
          {canAddTeachers && (
            <Button onClick={() => setAddTeacherDialogOpen(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Teacher
            </Button>
          )}
        </div>
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

      {viewMode === "table" ? (
        <div className="rounded-md border">
          <Table>
            <TableCaption>A list of all teachers{authState.user?.role === "hod" ? " in your department" : ""}.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Phone</TableHead>
                {(canEditTeachers || canAssignSubjects) && <TableHead className="w-[150px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canEditTeachers || canAssignSubjects ? 6 : 5} className="text-center">No teachers found</TableCell>
                </TableRow>
              ) : (
                teachers.map((teacher: User) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.department}</TableCell>
                    <TableCell>{displaySubjects(teacher.subjects)}</TableCell>
                    <TableCell>{teacher.phone || "Not available"}</TableCell>
                    {(canEditTeachers || canAssignSubjects) && (
                      <TableCell>
                        <div className="flex gap-1">
                          {canEditTeachers && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditTeacher(teacher)}
                            >
                              <UserCog className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          )}
                          {canAssignSubjects && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleAssignSubjects(teacher)}
                            >
                              <Settings className="h-4 w-4" />
                              <span className="sr-only">Assign Subjects</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teachers.length === 0 ? (
            <div className="col-span-full text-center p-8 border rounded-lg bg-muted/10">
              <p className="text-muted-foreground">No teachers found</p>
            </div>
          ) : (
            teachers.map((teacher: User) => (
              <Card key={teacher.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="bg-muted/30 pb-2">
                  <CardTitle className="text-lg">{teacher.name}</CardTitle>
                  <CardDescription className="flex flex-col gap-1">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {teacher.department}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{teacher.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-muted-foreground">{teacher.phone || "No phone number"}</span>
                    </div>
                    <div className="mt-2 py-2 px-3 bg-primary/5 rounded-md text-sm">
                      <span className="font-medium">Subjects:</span>
                      <div className="mt-1">{displaySubjects(teacher.subjects)}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/20 pt-2">
                  <div className="flex gap-2 w-full">
                    {canEditTeachers && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1" 
                        onClick={() => handleEditTeacher(teacher)}
                      >
                        <UserCog className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    )}
                    {canAssignSubjects && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleAssignSubjects(teacher)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    )}
                    {!canEditTeachers && !canAssignSubjects && (
                      <div className="w-full text-center text-sm text-muted-foreground">
                        View Only
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}

      {canAddTeachers && (
        <AddTeacherDialog
          open={addTeacherDialogOpen}
          onOpenChange={setAddTeacherDialogOpen}
        />
      )}

      {selectedTeacher && canEditTeachers && (
        <EditTeacherDialog
          open={editTeacherDialogOpen}
          onOpenChange={setEditTeacherDialogOpen}
          teacher={selectedTeacher}
        />
      )}

      {selectedTeacher && canAssignSubjects && (
        <AssignSubjectsDialog
          open={assignSubjectsDialogOpen}
          onOpenChange={setAssignSubjectsDialogOpen}
          teacher={selectedTeacher}
        />
      )}
    </div>
  );
};

export default Teachers;
