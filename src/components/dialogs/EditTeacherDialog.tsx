
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types";
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
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: User;
}

export function EditTeacherDialog({
  open,
  onOpenChange,
  teacher,
}: EditTeacherDialogProps) {
  const { updateUserProfile } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: teacher?.name || "",
      email: teacher?.email || "",
      phone: teacher?.phone || "",
    },
  });

  // Reset form when teacher changes
  React.useEffect(() => {
    if (teacher) {
      form.reset({
        name: teacher.name || "",
        email: teacher.email || "",
        phone: teacher.phone || "",
      });
    }
  }, [teacher, form]);

  const handleSubmit = (data: FormValues) => {
    try {
      const updatedTeacher = {
        ...teacher,
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
      };
      
      updateUserProfile(updatedTeacher);
      onOpenChange(false);
      toast.success("Teacher details updated successfully");
    } catch (error) {
      toast.error("Failed to update teacher details");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Teacher Details</DialogTitle>
          <DialogDescription>
            Update the teacher's information. Subjects are managed by the HOD.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
                    <Input placeholder="teacher@scahts.edu" {...field} />
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
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted/30 p-4 rounded-md">
              <h4 className="font-medium mb-2">Assigned Subjects</h4>
              {teacher?.subjects && teacher.subjects.length > 0 ? (
                <div className="space-y-2">
                  {teacher.subjects.map((subject, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{subject.name}</span>
                      <span className="text-muted-foreground ml-2">({subject.code})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No subjects assigned yet</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Subjects are managed by the HOD
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditTeacherDialog;
