
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
  return { success: true, message: `Ishuri ${data.name} ryongewemo neza!`, schoolId };
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
          title: "Byakunze",
          description: result.message,
        });
        onSchoolAdded({ ...data, id: result.schoolId });
        form.reset();
      } else {
        toast({
          title: "Byanze",
          description: result.message || "Habayeho ikibazo kitazwi.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Byanze",
        description: "Habayeho ikibazo kitateganijwe. Nyamuneka gerageza futhi.",
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
              <FormLabel>Izina ry'Ishuri</FormLabel>
              <FormControl>
                <Input placeholder="Urugero: Groupe Scolaire Remera" {...field} />
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
              <FormLabel>Aderesi</FormLabel>
              <FormControl>
                <Textarea placeholder="Urugero: KG 123 St, Remera, Kigali" {...field} />
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
              <FormLabel>Telefoni yo Guhamagara</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Urugero: (+250) 7XX XXX XXX" {...field} />
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
              <FormLabel>Email yo Guhamagara</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Urugero: admin@ishuri.rw" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Birimo Kongerwamo...
            </>
          ) : (
            "Ongeramo Ishuri"
          )}
        </Button>
      </form>
    </Form>
  );
}
