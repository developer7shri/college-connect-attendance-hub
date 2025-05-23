
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
import { UserPlus } from "lucide-react";
import AddHODDialog from "@/components/dialogs/AddHODDialog";

const Departments = () => {
  const { departments, getUsersByDepartment, getUsersByRole } = useAuth();
  const [addHODDialogOpen, setAddHODDialogOpen] = useState(false);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Departments</h1>
        <p className="text-muted-foreground">
          Manage academic departments and their heads.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => {
          const hod = getHODForDepartment(department);
          const { teacherCount, studentCount } = getDepartmentCounts(department);
          
          return (
            <Card key={department}>
              <CardHeader>
                <CardTitle>{department}</CardTitle>
                <CardDescription>
                  {teacherCount} teachers, {studentCount} students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Head of Department:</div>
                  {hod ? (
                    <div>
                      <div className="font-medium">{hod.name}</div>
                      <div className="text-sm text-muted-foreground">{hod.email}</div>
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-yellow-600">No HOD assigned</div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setAddHODDialogOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {hod ? "Change HOD" : "Assign HOD"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <AddHODDialog 
        open={addHODDialogOpen}
        onOpenChange={setAddHODDialogOpen}
      />
    </div>
  );
};

export default Departments;
