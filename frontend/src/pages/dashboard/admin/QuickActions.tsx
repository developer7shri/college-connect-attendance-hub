
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, FileText, UserPlus } from "lucide-react";

interface QuickActionsProps {
  onAddHOD: () => void;
  onCreateDepartment: () => void;
  onManageTeachers: () => void;
  onGenerateReports: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onAddHOD,
  onCreateDepartment,
  onManageTeachers,
  onGenerateReports,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Frequently used admin operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={onAddHOD}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add New HOD
          </Button>
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={onCreateDepartment}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Create Department
          </Button>
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={onManageTeachers}
          >
            <Users className="mr-2 h-4 w-4" />
            Manage Teachers
          </Button>
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={onGenerateReports}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Reports
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
