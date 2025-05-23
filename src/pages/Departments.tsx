
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
import { UserPlus, Search, Phone, Mail, Users, Briefcase } from "lucide-react";
import AddHODDialog from "@/components/dialogs/AddHODDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Departments = () => {
  const { departments, getUsersByDepartment, getUsersByRole } = useAuth();
  const [addHODDialogOpen, setAddHODDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
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

  // Handle add HOD button click
  const handleAddHOD = (department: string) => {
    setSelectedDepartment(department);
    setAddHODDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">
            Manage academic departments and their heads.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input 
            placeholder="Search departments..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
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
              <Card key={department} className="overflow-hidden border shadow-sm transition-all hover:shadow">
                <CardHeader className="bg-muted/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{department}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
                          {teacherCount} Teachers
                        </Badge>
                        <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
                          {studentCount} Students
                        </Badge>
                      </div>
                    </div>
                    <Avatar className="h-12 w-12 border-2 border-background">
                      <AvatarImage src={hod?.profileImageUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {department.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-muted-foreground">Head of Department</div>
                    
                    {hod ? (
                      <div className="p-4 rounded-md bg-card border">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={hod.profileImageUrl} />
                            <AvatarFallback className="bg-primary/10">
                              {hod.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{hod.name}</div>
                            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5" /> {hod.email}
                            </div>
                            {hod.phone && (
                              <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5" /> {hod.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-md bg-card border">
                        <div className="flex items-center justify-center h-16 text-center">
                          <div>
                            <div className="text-sm font-medium text-amber-600">No HOD assigned</div>
                            <div className="text-xs text-muted-foreground mt-1">Assign an HOD using the button below</div>
                          </div>
                        </div>
                      </div>
                    )}

                  <div className="flex justify-between mt-4">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="bg-muted p-2 rounded-md">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-xs font-medium mt-1">{teacherCount}</div>
                        <div className="text-xs text-muted-foreground">Teachers</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-muted p-2 rounded-md">
                          <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-xs font-medium mt-1">{studentCount}</div>
                        <div className="text-xs text-muted-foreground">Students</div>
                      </div>
                    </div>
                  </div>
                </div>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t p-4">
                  <Button 
                    variant="outline" 
                    className="w-full gap-2 hover:bg-primary hover:text-white transition-colors" 
                    onClick={() => handleAddHOD(department)}
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
        initialDepartment={selectedDepartment}
      />
    </div>
  );
};

export default Departments;
