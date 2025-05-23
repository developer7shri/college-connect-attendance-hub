
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

const teacherFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  })
});

type TeacherFormValues = z.infer<typeof teacherFormSchema>;

interface AddTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddTeacherDialog: React.FC<AddTeacherDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { createUser, authState } = useAuth();
  const [createdCredentials, setCreatedCredentials] = useState<GeneratedCredentials | null>(null);

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = (data: TeacherFormValues) => {
    if (!authState.user?.department) {
      toast.error("Department information is missing");
      return;
    }
    
    const credentials = createUser({
      name: data.name,
      email: data.email,
      password: data.password,
      department: authState.user.department,
      role: "teacher"
    });

    if (credentials) {
      setCreatedCredentials(credentials);
      toast.success(`Teacher ${data.name} created successfully`);
    }
  };

  const handleClose = () => {
    setCreatedCredentials(null);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        handleClose();
      } else {
        onOpenChange(true);
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
          <DialogDescription>
            Create a new teacher account for your department. The system will generate credentials.
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
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@scahts.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Create Teacher Account</Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="border rounded p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Teacher Account Created</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Name:</div>
                <div>{createdCredentials.name}</div>
                <div className="text-muted-foreground">Username:</div>
                <div className="font-mono">{createdCredentials.username}</div>
                <div className="text-muted-foreground">Password:</div>
                <div className="font-mono">{createdCredentials.password}</div>
                <div className="text-muted-foreground">Email:</div>
                <div>{createdCredentials.email}</div>
                <div className="text-muted-foreground">Department:</div>
                <div>{authState.user?.department}</div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddTeacherDialog;
