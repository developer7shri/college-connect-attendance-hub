
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GeneratedCredentials } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const studentFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  semester: z.string().min(1, {
    message: "Please select a semester.",
  }),
  usn: z.string().min(4, {
    message: "USN must be at least 4 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }).optional(),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { createUser, authState } = useAuth();
  const [createdCredentials, setCreatedCredentials] = useState<GeneratedCredentials | null>(null);
  const [searchSemester, setSearchSemester] = useState("");

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      semester: "",
      usn: "",
      phone: "",
    },
  });

  const handleSubmit = (data: StudentFormValues) => {
    if (!authState.user?.department) {
      toast.error("Department information is missing");
      return;
    }
    
    const credentials = createUser({
      name: data.name,
      email: data.email,
      department: authState.user.department,
      semester: parseInt(data.semester),
      usn: data.usn,
      phone: data.phone,
      role: "student"
    });

    if (credentials) {
      setCreatedCredentials(credentials);
      toast.success(`Student ${data.name} created successfully`);
    }
  };

  const handleClose = () => {
    setCreatedCredentials(null);
    form.reset();
    onOpenChange(false);
  };

  // Filter semesters based on search term
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const filteredSemesters = searchSemester 
    ? semesters.filter(sem => sem.toString().includes(searchSemester))
    : semesters;

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        handleClose();
      } else {
        onOpenChange(true);
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Student</DialogTitle>
          <DialogDescription>
            Create a new student account for your department. The system will generate credentials.
          </DialogDescription>
        </DialogHeader>

        {!createdCredentials ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Student Name" {...field} className="bg-background" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="student@scahts.edu" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="usn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>USN Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1CS20XX" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester</FormLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input 
                          placeholder="Search semester..." 
                          value={searchSemester}
                          onChange={(e) => setSearchSemester(e.target.value)}
                          className="pl-10 mb-2 bg-background"
                        />
                      </div>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredSemesters.map((sem) => (
                            <SelectItem key={sem} value={sem.toString()}>
                              Semester {sem}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full md:w-auto">Create Student Account</Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg p-6 bg-muted/30 shadow-sm">
              <h4 className="font-medium mb-4 text-lg text-center text-primary">Student Account Created Successfully</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-muted-foreground font-medium">Name:</div>
                <div>{createdCredentials.name}</div>
                <div className="text-muted-foreground font-medium">Username:</div>
                <div className="font-mono bg-muted p-1 rounded">{createdCredentials.username}</div>
                <div className="text-muted-foreground font-medium">Password:</div>
                <div className="font-mono bg-muted p-1 rounded">{createdCredentials.password}</div>
                <div className="text-muted-foreground font-medium">Email:</div>
                <div>{createdCredentials.email}</div>
                <div className="text-muted-foreground font-medium">USN:</div>
                <div>{form.getValues().usn}</div>
                <div className="text-muted-foreground font-medium">Phone:</div>
                <div>{form.getValues().phone || "Not provided"}</div>
                <div className="text-muted-foreground font-medium">Department:</div>
                <div>{authState.user?.department}</div>
                <div className="text-muted-foreground font-medium">Semester:</div>
                <div>{form.getValues().semester}</div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose} className="w-full md:w-auto">Close</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
