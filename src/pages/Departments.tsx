
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserPlus, Search } from "lucide-react";
import AddHODDialog from "@/components/dialogs/AddHODDialog";

const Departments = () => {
  const { departments, getUsersByDepartment, getUsersByRole } = useAuth();
  const [addHODDialogOpen, setAddHODDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Get all HODs
  const hods = getUsersByRole("hod");

  // Get HOD for a specific department
  const getHODForDepartment = (departmentName: string) => {
    return hods.find(hod => hod.department === departmentName);
  };

  // Count teachers and students for each department
  const getDepartmentCounts = (departmentName: string) => {
    const departmentUsers = getUsersByDepartment(departmentName);
    const teacherCount = departmentUsers.filter(user => user.role === "teacher").length;
    const studentCount = departmentUsers.filter(user => user.role === "student").length;
    return { teacherCount, studentCount };
  };

  // Filter departments based on search term
  const filteredDepartments = departments.filter(department =>
    department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Departments</h1>
        <p className="text-muted-foreground">
          Manage academic departments and their heads.
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input 
          placeholder="Search departments..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 mb-4 max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No departments found matching your search.
          </div>
        ) : (
          filteredDepartments.map((department) => {
            const hod = getHODForDepartment(department);
            const { teacherCount, studentCount } = getDepartmentCounts(department);
            
            return (
              <Card key={department} className="overflow-hidden border shadow-sm">
                <CardHeader className="bg-muted/50">
                  <CardTitle className="text-lg">{department}</CardTitle>
                  <CardDescription className="flex gap-3">
                    <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                      {teacherCount} teachers
                    </span>
                    <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                      {studentCount} students
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">Head of Department:</div>
                    {hod ? (
                      <div className="p-3 border rounded-md bg-background">
                        <div className="font-medium text-primary">{hod.name}</div>
                        <div className="text-sm text-muted-foreground">{hod.email}</div>
                        {hod.phone && <div className="text-sm text-muted-foreground mt-1">Phone: {hod.phone}</div>}
                      </div>
                    ) : (
                      <div className="p-3 border rounded-md bg-background">
                        <div className="text-sm font-medium text-yellow-600">No HOD assigned</div>
                        <div className="text-xs text-muted-foreground mt-1">Assign an HOD using the button below</div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t p-4">
                  <Button 
                    variant="outline" 
                    className="w-full gap-2 hover:bg-primary hover:text-white transition-colors" 
                    onClick={() => setAddHODDialogOpen(true)}
                  >
                    <UserPlus className="h-4 w-4" />
                    {hod ? "Change HOD" : "Assign HOD"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>

      <AddHODDialog 
        open={addHODDialogOpen}
        onOpenChange={setAddHODDialogOpen}
      />
    </div>
  );
};

export default Departments;
