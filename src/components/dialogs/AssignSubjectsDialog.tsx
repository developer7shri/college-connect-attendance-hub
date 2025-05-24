
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { User, Subject } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const formSchema = z.object({
  subjectName: z.string().min(1, "Subject name is required"),
  subjectCode: z.string().min(1, "Subject code is required"),
  semester: z.number().min(1).max(8),
});

type FormValues = z.infer<typeof formSchema>;

interface AssignSubjectsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: User | null;
}

export function AssignSubjectsDialog({
  open,
  onOpenChange,
  teacher,
}: AssignSubjectsDialogProps) {
  const { updateUserProfile } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>(teacher?.subjects || []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectName: "",
      subjectCode: "",
      semester: 1,
    },
  });

  const addSubject = (data: FormValues) => {
    if (!teacher) return;

    const newSubject: Subject = {
      id: `${Date.now()}`,
      name: data.subjectName,
      code: data.subjectCode,
      semester: data.semester,
      department: teacher.department || "",
      teacherId: teacher.id,
    };

    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    form.reset();
  };

  const removeSubject = (index: number) => {
    const updatedSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(updatedSubjects);
  };

  const handleSave = () => {
    if (!teacher) return;

    const updatedTeacher: User = {
      ...teacher,
      subjects: subjects,
    };

    updateUserProfile(updatedTeacher);
    onOpenChange(false);
    toast.success("Subjects assigned successfully");
  };

  React.useEffect(() => {
    if (teacher) {
      setSubjects(teacher.subjects || []);
    }
  }, [teacher]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign Subjects</DialogTitle>
          <DialogDescription>
            Assign subjects and semesters to {teacher?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Subjects */}
          <div>
            <h4 className="font-medium mb-3">Current Subjects</h4>
            {subjects.length > 0 ? (
              <div className="space-y-2">
                {subjects.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{subject.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {subject.code} - Semester {subject.semester}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubject(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No subjects assigned yet</p>
            )}
          </div>

          {/* Add New Subject Form */}
          <div>
            <h4 className="font-medium mb-3">Add New Subject</h4>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(addSubject)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="subjectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Data Structures" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subjectCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject Code</FormLabel>
                        <FormControl>
                          <Input placeholder="CS301" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="8" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="sm">Add Subject</Button>
              </form>
            </Form>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AssignSubjectsDialog;
