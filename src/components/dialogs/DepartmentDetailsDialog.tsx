
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types";
import { Users, GraduationCap, BookOpen } from "lucide-react";

interface DepartmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: string;
}

export function DepartmentDetailsDialog({
  open,
  onOpenChange,
  department,
}: DepartmentDetailsDialogProps) {
  const { getUsersByDepartment } = useAuth();
  
  const departmentUsers = getUsersByDepartment(department);
  const teachers = departmentUsers.filter(user => user.role === "teacher");
  const students = departmentUsers.filter(user => user.role === "student");
  const hod = departmentUsers.find(user => user.role === "hod");

  const getSubjects = () => {
    const allSubjects = teachers.reduce((acc: any[], teacher) => {
      if (teacher.subjects) {
        acc.push(...teacher.subjects);
      }
      return acc;
    }, []);
    
    // Remove duplicates based on subject code
    return allSubjects.filter((subject, index, self) => 
      index === self.findIndex(s => s.code === subject.code)
    );
  };

  const subjects = getSubjects();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{department} Department</DialogTitle>
          <DialogDescription>
            Department overview and statistics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Teachers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teachers.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Subjects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subjects.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* HOD Information */}
          <Card>
            <CardHeader>
              <CardTitle>Head of Department</CardTitle>
            </CardHeader>
            <CardContent>
              {hod ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {hod.name?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{hod.name}</p>
                    <p className="text-sm text-muted-foreground">{hod.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No HOD assigned</p>
              )}
            </CardContent>
          </Card>

          {/* Teachers List */}
          <Card>
            <CardHeader>
              <CardTitle>Teachers ({teachers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {teachers.length > 0 ? (
                <div className="space-y-3">
                  {teachers.map((teacher: User) => (
                    <div key={teacher.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-sm text-muted-foreground">{teacher.email}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects?.map((subject, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {subject.code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No teachers assigned</p>
              )}
            </CardContent>
          </Card>

          {/* Subjects List */}
          <Card>
            <CardHeader>
              <CardTitle>Subjects ({subjects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {subjects.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {subjects.map((subject: any, index: number) => (
                    <div key={index} className="p-2 border rounded-md">
                      <p className="font-medium text-sm">{subject.name}</p>
                      <p className="text-xs text-muted-foreground">{subject.code}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No subjects assigned</p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DepartmentDetailsDialog;
