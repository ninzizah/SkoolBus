
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { School, SchoolFormData } from '@/types';
import { schoolFormSchema } from '@/types';
import { Loader2 } from "lucide-react";

interface AddSchoolFormProps {
  onSchoolAdded: (school: School) => void;
}

// Mock server action for adding a school
async function addSchoolAction(data: SchoolFormData): Promise<{ success: boolean; message: string, schoolId?: string }> {
  console.log("Adding school:", data);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Simulate success/failure
  if (data.name.toLowerCase().includes("error")) {
    return { success: false, message: "Failed to add school due to a server error." };
  }
  const schoolId = `sch-${Math.random().toString(36).substring(2, 9)}`;
  return { success: true, message: `School ${data.name} added successfully!`, schoolId };
}


export default function AddSchoolForm({ onSchoolAdded }: AddSchoolFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<SchoolFormData>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: "",
      address: "",
      contactPhone: "",
      contactEmail: "",
    },
  });

  async function onSubmit(data: SchoolFormData) {
    setIsSubmitting(true);
    try {
      const result = await addSchoolAction(data);
      if (result.success && result.schoolId) {
        toast({
          title: "Success",
          description: result.message,
        });
        onSchoolAdded({ ...data, id: result.schoolId });
        form.reset();
      } else {
        toast({
          title: "Error",
          description: result.message || "An unknown error occurred.",
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
              <FormLabel>School Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Northwood High" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., 123 Education Drive, City, State ZIP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="e.g., (250) 123-4567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g., admin@school.edu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding School...
            </>
          ) : (
            "Add School"
          )}
        </Button>
      </form>
    </Form>
  );
}
