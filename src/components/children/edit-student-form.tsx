
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
import type { Child } from '@/types';
import { z } from 'zod';
import { Loader2 } from "lucide-react";

// Schema for editing student - only name, age, classGrade
const editStudentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  age: z.coerce.number().int().positive("Age must be a positive number.").min(1, "Age must be at least 1."),
  classGrade: z.string().min(1, "Class/Grade is required."),
});

export type EditStudentFormData = z.infer<typeof editStudentFormSchema>;

interface EditStudentFormProps {
  student: Child;
  onFormSubmit: (data: EditStudentFormData) => void;
  onCancel: () => void;
}

export default function EditStudentForm({ student, onFormSubmit, onCancel }: EditStudentFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<EditStudentFormData>({
    resolver: zodResolver(editStudentFormSchema),
    defaultValues: {
      name: student.name || "",
      age: student.age || undefined,
      classGrade: student.classGrade || "",
    },
  });

  async function onSubmit(data: EditStudentFormData) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    onFormSubmit(data);
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student's Full Name</FormLabel>
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
        <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
            {isSubmitting ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
                </>
            ) : (
                "Save Changes"
            )}
            </Button>
        </div>
      </form>
    </Form>
  );
}
