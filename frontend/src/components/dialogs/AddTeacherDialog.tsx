
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
import { toast } from "sonner";

const teacherFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
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
      phone: "",
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
      phone: data.phone,
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Teacher</DialogTitle>
          <DialogDescription>
            Create a new teacher account for your department. Login ID will be the email and initial password will be the phone number.
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
                      <Input placeholder="John Doe" {...field} className="bg-background" />
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
                      <FormLabel>Email (Login ID)</FormLabel>
                      <FormControl>
                        <Input placeholder="john@scahts.edu" {...field} className="bg-background" />
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
                      <FormLabel>Phone (Initial Password)</FormLabel>
                      <FormControl>
                        <Input placeholder="1234567890" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full md:w-auto">Create Teacher Account</Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg p-6 bg-muted/30 shadow-sm">
              <h4 className="font-medium mb-4 text-lg text-center text-primary">Teacher Account Created Successfully</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-muted-foreground font-medium">Name:</div>
                <div>{createdCredentials.name}</div>
                <div className="text-muted-foreground font-medium">Login ID:</div>
                <div className="font-mono bg-muted p-1 rounded">{createdCredentials.username}</div>
                <div className="text-muted-foreground font-medium">Initial Password:</div>
                <div className="font-mono bg-muted p-1 rounded">{createdCredentials.password}</div>
                <div className="text-muted-foreground font-medium">Email:</div>
                <div>{createdCredentials.email}</div>
                <div className="text-muted-foreground font-medium">Phone:</div>
                <div>{form.getValues().phone}</div>
                <div className="text-muted-foreground font-medium">Department:</div>
                <div>{authState.user?.department}</div>
              </div>
              <p className="text-xs mt-4 text-amber-500">
                Note: Subjects and classes can be assigned later by the HOD.
              </p>
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

export default AddTeacherDialog;
