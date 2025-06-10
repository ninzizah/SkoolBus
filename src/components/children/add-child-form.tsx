
"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { ChildFormData, Parent, School } from '@/types';
import { childFormSchema } from '@/types';
import { Loader2, UploadCloud } from "lucide-react";

interface AddChildFormProps {
  parents: Pick<Parent, 'id' | 'name'>[];
  schools: Pick<School, 'id' | 'name'>[]; 
}

async function addChildAction(data: ChildFormData): Promise<{ success: boolean; message: string }> {
  console.log("Adding child:", data);
  // In a real app, you would fetch the schoolName based on schoolId here if needed before saving,
  // or handle it on the backend. For mock, we assume schoolName is correctly passed or derived.
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (data.name.toLowerCase() === "error") {
    return { success: false, message: "Failed to add child due to a server error." };
  }
  return { success: true, message: `Child ${data.name} added successfully!` };
}

export default function AddChildForm({ parents, schools }: AddChildFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<ChildFormData>({
    resolver: zodResolver(childFormSchema),
    defaultValues: {
      name: "",
      age: undefined,
      classGrade: "",
      photoDataUrl: undefined,
      parentId: "",
      schoolId: "", // Initialize schoolId
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        form.setValue("photoDataUrl", result);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
      form.setValue("photoDataUrl", undefined);
    }
  };

  async function onSubmit(data: ChildFormData) {
    setIsSubmitting(true);
    try {
      // Find selected school name for toast message (optional, could be done differently in real app)
      const selectedSchool = schools.find(s => s.id === data.schoolId);
      const result = await addChildAction(data);
      if (result.success) {
        toast({
          title: "Success",
          description: `${result.message} (School: ${selectedSchool?.name || 'N/A'})`,
        });
        form.reset();
        setPhotoPreview(null);
        if(fileInputRef.current) {
          fileInputRef.current.value = ""; 
        }
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
       toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Child's Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Timmy Turner" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 8" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="schoolId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a school" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="classGrade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class/Grade</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 3rd Grade, Class B" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="photoDataUrl" 
          render={({ field }) => ( 
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <div className="flex flex-col items-center space-y-2">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Child preview" className="h-24 w-24 rounded-full object-cover border" />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border">
                      <UploadCloud className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoChange} 
                    className="text-sm"
                    ref={fileInputRef}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent/Guardian</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parent" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {parents.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Child...
            </>
          ) : (
            "Add Child Profile"
          )}
        </Button>
      </form>
    </Form>
  );
}

