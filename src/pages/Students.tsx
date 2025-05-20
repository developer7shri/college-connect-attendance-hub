
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { 
  Search, 
  Filter, 
  UserPlus, 
  Mail, 
  Phone, 
  FileText,
  Pencil,
  Trash
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Student } from "@/types";

const Students = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  // Mock student data
  const mockStudents: Student[] = [
    {
      id: "1",
      name: "Rahul Sharma",
      usn: "CS001",
      email: "rahul.s@scahts.edu",
      department: "Computer Science",
      semester: 3,
      mentorId: "3"
    },
    {
      id: "2",
      name: "Priya Patel",
      usn: "CS002",
      email: "priya.p@scahts.edu",
      department: "Computer Science",
      semester: 5,
      mentorId: "3"
    },
    {
      id: "3",
      name: "Akash Kumar",
      usn: "EC001",
      email: "akash.k@scahts.edu",
      department: "Electronics",
      semester: 3,
      mentorId: "4"
    },
    {
      id: "4",
      name: "Meera Joshi",
      usn: "CS003",
      email: "meera.j@scahts.edu",
      department: "Computer Science",
      semester: 1,
      mentorId: "3"
    },
    {
      id: "5",
      name: "Vikas Reddy",
      usn: "ME001",
      email: "vikas.r@scahts.edu",
      department: "Mechanical",
      semester: 7,
      mentorId: "5"
    },
    {
      id: "6",
      name: "Aisha Khan",
      usn: "CS004",
      email: "aisha.k@scahts.edu",
      department: "Computer Science",
      semester: 5,
      mentorId: "3"
    }
  ];

  // Get distinct departments
  const departments = [...new Set(mockStudents.map(s => s.department))];
  
  // Get all semesters
  const semesters = [...Array(8)].map((_, i) => i + 1);

  // Filter students based on search and filters
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = 
      selectedDepartment === "all" || 
      student.department === selectedDepartment;
    
    const matchesSemester = 
      selectedSemester === "all" || 
      student.semester === parseInt(selectedSemester);
    
    return matchesSearch && matchesDepartment && matchesSemester;
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage and view student information.
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0"
          onClick={() => toast.info("Add student feature coming soon")}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, USN, or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map(sem => (
                    <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Students ({filteredStudents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>USN</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Department</TableHead>
                    <TableHead className="hidden md:table-cell">Semester</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                            </Avatar>
                            {student.name}
                          </div>
                        </TableCell>
                        <TableCell>{student.usn}</TableCell>
                        <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{student.department}</TableCell>
                        <TableCell className="hidden md:table-cell">{student.semester}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => toast.info("View details feature coming soon")}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toast.info("Edit student feature coming soon")}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toast.error("Delete student feature coming soon")}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No students found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <Card key={student.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">{student.usn}</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                          {student.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                          +91 98765XXXXX
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium">Department:</span> {student.department}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Semester:</span> {student.semester}
                        </div>
                      </div>
                    </div>
                    <div className="border-t px-6 py-3 flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-sm"
                        onClick={() => toast.info("View attendance feature coming soon")}
                      >
                        Attendance
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-sm"
                        onClick={() => toast.info("View details feature coming soon")}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                No students found.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Students;
