
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { GeneratedCredentials } from "@/types";

const hodFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  department: z.string().min(1, {
    message: "Please select a department.",
  })
});

type HODFormValues = z.infer<typeof hodFormSchema>;

interface AddHODDialogProps {
  open: boolean;
  departments: string[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: HODFormValues) => GeneratedCredentials | null;
}

const AddHODDialog: React.FC<AddHODDialogProps> = ({ 
  open, 
  departments, 
  onOpenChange, 
  onSubmit 
}) => {
  const [createdCredentials, setCreatedCredentials] = useState<GeneratedCredentials | null>(null);

  const form = useForm<HODFormValues>({
    resolver: zodResolver(hodFormSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
    },
  });

  const handleSubmit = (data: HODFormValues) => {
    const credentials = onSubmit(data);
    if (credentials) {
      setCreatedCredentials(credentials);
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
          <DialogTitle>Add New HOD</DialogTitle>
          <DialogDescription>
            Create a new Head of Department account. The system will generate credentials.
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
                      <Input placeholder="Dr. John Doe" {...field} />
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
                      <Input placeholder="hod@scahts.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Create HOD Account</Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="border rounded p-4 bg-muted/50">
              <h4 className="font-medium mb-2">HOD Account Created</h4>
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
                <div>{form.getValues().department}</div>
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

export default AddHODDialog;
