
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import AddHODDialog from "@/components/dialogs/AddHODDialog";

const Departments = () => {
  const { departments, getUsersByDepartment, getUsersByRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  
  const allHODs = getUsersByRole("hod");
  
  // Filter departments based on search query
  const filteredDepartments = departments.filter(
    dept => dept.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get HODs by department
  const getDepartmentHOD = (department: string): User | undefined => {
    return allHODs.find(hod => hod.department === department);
  };
  
  // Count teachers and students in department
  const getDepartmentCounts = (department: string) => {
    const users = getUsersByDepartment(department);
    const teachers = users.filter(user => user.role === "teacher").length;
    const students = users.filter(user => user.role === "student").length;
    return { teachers, students };
  };
  
  const handleAddHOD = (department: string) => {
    setSelectedDepartment(department);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground">
            Manage academic departments and their HODs
          </p>
        </div>
      </div>
      
      <div className="flex justify-between mb-6">
        <div className="relative">
          <Input 
            placeholder="Search departments..." 
            className="pl-10 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 absolute left-3 top-3 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <Button
          onClick={() => {
            // Add department functionality would go here
            // This would typically open a dialog to add a new department
            alert("Add Department feature would go here");
          }}
        >
          Add Department
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((department) => {
          const hod = getDepartmentHOD(department);
          const { teachers, students } = getDepartmentCounts(department);
          
          return (
            <Card key={department} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{department}</CardTitle>
                <CardDescription>
                  Department of {department}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Teachers:</span> <span className="font-medium">{teachers}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Students:</span> <span className="font-medium">{students}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium">Head of Department</div>
                  
                  {hod ? (
                    <div className="flex items-center space-x-3 pt-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10">
                          {hod.name?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{hod.name}</p>
                        <p className="text-xs text-muted-foreground">{hod.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="outline" className="text-muted-foreground">
                        No HOD Assigned
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddHOD(department)}
                      >
                        Assign HOD
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="pt-3 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // View department details
                      alert("View department details");
                    }}
                  >
                    View Details
                  </Button>
                  {hod && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddHOD(department)}
                    >
                      Change HOD
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Add HOD Dialog */}
      <AddHODDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Departments;
