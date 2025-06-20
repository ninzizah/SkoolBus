
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
import type { ParentFormData } from '@/types';
import { parentFormSchema } from '@/types';
import { Loader2 } from "lucide-react";

interface AddParentFormProps {
  onParentAdded: (parentData: ParentFormData) => void;
}

// Mock server action
async function addParentAction(data: ParentFormData): Promise<{ success: boolean; message: string }> {
  console.log("Adding parent:", data);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Simulate success/failure
  if (data.name.toLowerCase() === "error") {
    return { success: false, message: "Failed to add parent due to a server error." };
  }
  return { success: true, message: `Umubyeyi ${data.name} yongewemo neza!` };
}


export default function AddParentForm({ onParentAdded }: AddParentFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ParentFormData>({
    resolver: zodResolver(parentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
    },
  });

  async function onSubmit(data: ParentFormData) {
    setIsSubmitting(true);
    try {
      const result = await addParentAction(data); 
      if (result.success) {
        toast({
          title: "Byakunze",
          description: result.message,
        });
        onParentAdded(data); 
        form.reset();
      } else {
        toast({
          title: "Byanze",
          description: result.message,
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
              <FormLabel>Amazina Yuzuye</FormLabel>
              <FormControl>
                <Input placeholder="Urugero: Shema Honore" {...field} />
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
                <Input type="email" placeholder="Urugero: shema.honore@example.rw" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nimero ya Telefoni (Si ngombwa)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Urugero: (+250) 7XX XXX XXX" {...field} />
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
              <FormLabel>Aderesi (Si ngombwa)</FormLabel>
              <FormControl>
                <Textarea placeholder="Urugero: KG 17 Ave, Kigali" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Birimo kongerwamo...
            </>
          ) : (
            "Ongeramo Konti y'Umubyeyi"
          )}
        </Button>
      </form>
    </Form>
  );
}
