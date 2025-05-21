
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Plus, Pencil, Trash, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Department interface
interface Department {
  id: string;
  name: string;
  code: string;
  hodName: string;
  totalTeachers: number;
  totalStudents: number;
}

const Departments: React.FC = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({
    name: "",
    code: "",
    hodName: ""
  });
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock departments data
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "1",
      name: "Computer Science Engineering",
      code: "CSE",
      hodName: "Dr. Suresh Kumar",
      totalTeachers: 18,
      totalStudents: 240
    },
    {
      id: "2",
      name: "Electronics & Communication",
      code: "ECE",
      hodName: "Dr. Meena Sharma",
      totalTeachers: 15,
      totalStudents: 180
    },
    {
      id: "3",
      name: "Mechanical Engineering",
      code: "ME",
      hodName: "Dr. Rajesh Verma",
      totalTeachers: 12,
      totalStudents: 150
    },
    {
      id: "4",
      name: "Civil Engineering",
      code: "CE",
      hodName: "Dr. Priya Patil",
      totalTeachers: 10,
      totalStudents: 120
    },
    {
      id: "5",
      name: "Information Technology",
      code: "IT",
      hodName: "Dr. Amit Singh",
      totalTeachers: 14,
      totalStudents: 160
    }
  ]);

  // Filter departments based on search query
  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.hodName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDepartment = () => {
    if (!newDepartment.name || !newDepartment.code || !newDepartment.hodName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newDept: Department = {
      id: (departments.length + 1).toString(),
      name: newDepartment.name,
      code: newDepartment.code,
      hodName: newDepartment.hodName,
      totalTeachers: 0,
      totalStudents: 0
    };

    setDepartments([...departments, newDept]);
    setNewDepartment({ name: "", code: "", hodName: "" });
    setIsAddDialogOpen(false);

    toast({
      title: "Success",
      description: "Department added successfully",
    });
  };

  const openEditDialog = (department: Department) => {
    setEditDepartment(department);
    setIsEditDialogOpen(true);
  };

  const handleEditDepartment = () => {
    if (!editDepartment) return;

    const updatedDepartments = departments.map(dept =>
      dept.id === editDepartment.id ? editDepartment : dept
    );

    setDepartments(updatedDepartments);
    setIsEditDialogOpen(false);

    toast({
      title: "Success",
      description: "Department updated successfully",
    });
  };

  const handleDeleteDepartment = (id: string) => {
    const updatedDepartments = departments.filter(dept => dept.id !== id);
    setDepartments(updatedDepartments);

    toast({
      title: "Success",
      description: "Department deleted successfully",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">
            Manage all departments and their details
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>HOD</TableHead>
                <TableHead className="text-center">Teachers</TableHead>
                <TableHead className="text-center">Students</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No departments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredDepartments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium flex items-center">
                      <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                      {dept.name}
                    </TableCell>
                    <TableCell>{dept.code}</TableCell>
                    <TableCell>{dept.hodName}</TableCell>
                    <TableCell className="text-center">{dept.totalTeachers}</TableCell>
                    <TableCell className="text-center">{dept.totalStudents}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditDialog(dept)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteDepartment(dept.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Department Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Department</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Department Name
              </Label>
              <Input
                id="name"
                value={newDepartment.name || ""}
                onChange={(e) =>
                  setNewDepartment({ ...newDepartment, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                value={newDepartment.code || ""}
                onChange={(e) =>
                  setNewDepartment({ ...newDepartment, code: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hod" className="text-right">
                HOD Name
              </Label>
              <Input
                id="hod"
                value={newDepartment.hodName || ""}
                onChange={(e) =>
                  setNewDepartment({ ...newDepartment, hodName: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddDepartment}>Add Department</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          {editDepartment && (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Department Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={editDepartment.name}
                    onChange={(e) =>
                      setEditDepartment({
                        ...editDepartment,
                        name: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-code" className="text-right">
                    Code
                  </Label>
                  <Input
                    id="edit-code"
                    value={editDepartment.code}
                    onChange={(e) =>
                      setEditDepartment({
                        ...editDepartment,
                        code: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-hod" className="text-right">
                    HOD Name
                  </Label>
                  <Input
                    id="edit-hod"
                    value={editDepartment.hodName}
                    onChange={(e) =>
                      setEditDepartment({
                        ...editDepartment,
                        hodName: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleEditDepartment}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Departments;
