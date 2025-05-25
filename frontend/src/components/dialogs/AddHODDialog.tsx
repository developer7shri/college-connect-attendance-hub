
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
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Search } from "lucide-react";

const hodFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  department: z.string().min(1, {
    message: "Please select a department.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
});

type HODFormValues = z.infer<typeof hodFormSchema>;

interface AddHODDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddHODDialog: React.FC<AddHODDialogProps> = ({ 
  open, 
  onOpenChange, 
}) => {
  const { createUser, departments } = useAuth();
  const [createdCredentials, setCreatedCredentials] = useState<GeneratedCredentials | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<HODFormValues>({
    resolver: zodResolver(hodFormSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      phone: "",
    },
  });

  const handleSubmit = (data: HODFormValues) => {
    const credentials = createUser({
      name: data.name,
      email: data.email,
      department: data.department,
      phone: data.phone,
      role: "hod"
    });
    
    if (credentials) {
      setCreatedCredentials(credentials);
      toast.success(`HOD ${data.name} created successfully`);
    }
  };

  const handleClose = () => {
    setCreatedCredentials(null);
    form.reset();
    onOpenChange(false);
  };

  // Filter departments based on search term
  const filteredDepartments = departments.filter(dept => 
    dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <DialogTitle className="text-2xl">Add New HOD</DialogTitle>
          <DialogDescription>
            Create a new Head of Department account. Login ID will be the email and initial password will be the phone number.
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
                      <Input placeholder="Dr. John Doe" {...field} className="bg-background" />
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
                        <Input placeholder="hod@scahts.edu" {...field} className="bg-background" />
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
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Input 
                        placeholder="Search departments..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 mb-2 bg-background"
                      />
                    </div>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredDepartments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full md:w-auto">Create HOD Account</Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg p-6 bg-muted/30 shadow-sm">
              <h4 className="font-medium mb-4 text-lg text-center text-primary">HOD Account Created Successfully</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-muted-foreground font-medium">Name:</div>
                <div>{createdCredentials.name}</div>
                <div className="text-muted-foreground font-medium">Login ID:</div>
                <div className="font-mono bg-muted p-1 rounded">{createdCredentials.username}</div>
                <div className="text-muted-foreground font-medium">Initial Password:</div>
                <div className="font-mono bg-muted p-1 rounded">{createdCredentials.password}</div>
                <div className="text-muted-foreground font-medium">Email:</div>
                <div>{createdCredentials.email}</div>
                <div className="text-muted-foreground font-medium">Department:</div>
                <div>{form.getValues().department}</div>
                <div className="text-muted-foreground font-medium">Phone:</div>
                <div>{form.getValues().phone}</div>
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

export default AddHODDialog;
