
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, Mail, Phone, Pencil, Trash, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  subjects: string[];
  avatarUrl?: string;
}

const Teachers: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Omit<Teacher, "id">>({
    name: "",
    email: "",
    phone: "",
    department: "",
    subjects: [],
  });

  // Mock data for departments
  const departments = [
    { id: "cs", name: "Computer Science" },
    { id: "ec", name: "Electronics" },
    { id: "me", name: "Mechanical" },
    { id: "cv", name: "Civil" },
    { id: "is", name: "Information Science" }
  ];

  // Mock data for teachers
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: "1",
      name: "Dr. John Smith",
      email: "john.smith@scahts.edu",
      phone: "+91 9876543210",
      department: "Computer Science",
      subjects: ["Data Structures", "Algorithms"],
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=John Smith"
    },
    {
      id: "2",
      name: "Prof. Sarah Johnson",
      email: "sarah.johnson@scahts.edu",
      phone: "+91 9876543211",
      department: "Electronics",
      subjects: ["Digital Electronics", "Microprocessors"],
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah Johnson"
    },
    {
      id: "3",
      name: "Dr. Robert Brown",
      email: "robert.brown@scahts.edu",
      phone: "+91 9876543212",
      department: "Computer Science",
      subjects: ["Database Management", "Web Development"],
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Robert Brown"
    },
    {
      id: "4",
      name: "Prof. Emily Davis",
      email: "emily.davis@scahts.edu",
      phone: "+91 9876543213",
      department: "Information Science",
      subjects: ["Information Security", "Networking"],
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Emily Davis"
    },
  ]);

  // Filter teachers based on search query and department filter
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || teacher.department === departments.find(d => d.id === departmentFilter)?.name;
    return matchesSearch && matchesDepartment;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (value: string) => {
    const deptName = departments.find(d => d.id === value)?.name || "";
    setFormData(prev => ({ ...prev, department: deptName }));
  };

  const handleSubjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const subjects = e.target.value.split(',').map(s => s.trim());
    setFormData(prev => ({ ...prev, subjects }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      subjects: [],
    });
  };

  const handleAddTeacher = () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.department) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Add new teacher
    const newTeacher: Teacher = {
      id: Date.now().toString(),
      ...formData,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`
    };

    setTeachers(prev => [...prev, newTeacher]);
    resetForm();
    setIsAddDialogOpen(false);

    toast({
      title: "Teacher Added",
      description: "New teacher has been added successfully",
    });
  };

  const handleEditTeacher = () => {
    if (!selectedTeacher) return;
    
    // Validate form
    if (!formData.name || !formData.email || !formData.department) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Update teacher
    setTeachers(prev => prev.map(teacher => 
      teacher.id === selectedTeacher.id ? {
        ...teacher,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        subjects: formData.subjects,
      } : teacher
    ));

    resetForm();
    setSelectedTeacher(null);
    setIsEditDialogOpen(false);

    toast({
      title: "Teacher Updated",
      description: "Teacher information has been updated successfully",
    });
  };

  const handleDeleteTeacher = () => {
    if (!selectedTeacher) return;
    
    setTeachers(prev => prev.filter(teacher => teacher.id !== selectedTeacher.id));
    setSelectedTeacher(null);
    setIsDeleteDialogOpen(false);

    toast({
      title: "Teacher Removed",
      description: "Teacher has been removed successfully",
    });
  };

  const openEditDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      department: teacher.department,
      subjects: teacher.subjects,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Teachers Management</h1>
        <p className="text-muted-foreground">
          View, add, edit, and manage teachers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Teachers</CardTitle>
          <CardDescription>
            Manage teaching staff across all departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 md:w-2/3">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search teachers..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Teacher
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Teacher</DialogTitle>
                  <DialogDescription>
                    Enter teacher information to add them to the system
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name"
                      placeholder="Enter full name" 
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      placeholder="Enter email address" 
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      placeholder="Enter phone number" 
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Select onValueChange={handleDepartmentChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="subjects">Subjects (comma-separated)</Label>
                    <Input 
                      id="subjects" 
                      name="subjects"
                      placeholder="E.g. Data Structures, Algorithms" 
                      value={formData.subjects.join(', ')}
                      onChange={handleSubjectsChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddTeacher}>Add Teacher</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <Card key={teacher.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-start p-4">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
                        <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <h3 className="font-medium">{teacher.name}</h3>
                        <p className="text-sm text-muted-foreground">{teacher.department}</p>
                        <div className="flex items-center mt-2 text-sm">
                          <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          <span>{teacher.email}</span>
                        </div>
                        <div className="flex items-center mt-1 text-sm">
                          <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          <span>{teacher.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/50 p-3">
                      <p className="text-xs font-medium mb-1">Subjects</p>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.map((subject, idx) => (
                          <span 
                            key={idx} 
                            className="text-xs bg-background px-2 py-0.5 rounded"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="border-t flex divide-x">
                      <button 
                        className="flex items-center justify-center gap-1 flex-1 p-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => openEditDialog(teacher)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button 
                        className="flex items-center justify-center gap-1 flex-1 p-2 text-sm hover:bg-muted transition-colors text-destructive"
                        onClick={() => openDeleteDialog(teacher)}
                      >
                        <Trash className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 py-8 text-center">
                <p className="text-muted-foreground">No teachers found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>
              Update teacher information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input 
                id="edit-name" 
                name="name"
                placeholder="Enter full name" 
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input 
                id="edit-email" 
                name="email"
                type="email" 
                placeholder="Enter email address" 
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input 
                id="edit-phone" 
                name="phone"
                placeholder="Enter phone number" 
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-department">Department</Label>
              <Select onValueChange={handleDepartmentChange} defaultValue={departments.find(d => d.name === formData.department)?.id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="edit-subjects">Subjects (comma-separated)</Label>
              <Input 
                id="edit-subjects" 
                name="subjects"
                placeholder="E.g. Data Structures, Algorithms" 
                value={formData.subjects.join(', ')}
                onChange={handleSubjectsChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditTeacher}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Teacher</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this teacher? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedTeacher && (
            <div className="flex items-center p-2 bg-muted rounded-md">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={selectedTeacher.avatarUrl} alt={selectedTeacher.name} />
                <AvatarFallback>{getInitials(selectedTeacher.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{selectedTeacher.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedTeacher.email}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTeacher}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teachers;
