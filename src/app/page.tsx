
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
import type { SignupFormData } from '@/types';
import { signupFormSchema } from '@/types';
import { Loader2, BusFront } from "lucide-react";
import { useRouter } from 'next/navigation';

// Mock server action for signing up a user
async function signupUserAction(data: SignupFormData): Promise<{ success: boolean; message: string }> {
  console.log("Signing up user:", data);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Simulate success/failure
  if (data.email.toLowerCase().includes("error@example.com")) {
    return { success: false, message: "This email address is already taken or invalid." };
  }
  return { success: true, message: `Account for ${data.fullName} created successfully as a ${data.role}!` };
}

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  async function onSubmit(data: SignupFormData) {
    setIsSubmitting(true);
    try {
      const result = await signupUserAction(data);
      if (result.success) {
        toast({
          title: "Sign Up Successful",
          description: result.message,
        });
        // In a real app, you'd likely set some auth state here (e.g., token, user session)
        router.push('/dashboard'); 
      } else {
        toast({
          title: "Sign Up Failed",
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
    <div className="flex flex-col items-center justify-between min-h-screen bg-background p-6">
      <div /> {/* Spacer to push content down from the top with justify-between */}
      
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <BusFront className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-3xl font-bold font-headline text-primary">
            Create your SkoolBus Account
          </h1>
          <p className="text-muted-foreground mt-2">
            Join SkoolBus to manage school transportation safely and efficiently.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-8 rounded-lg shadow-xl">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="e.g., Jane Doe" {...field} autoComplete="name" />
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
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g., you@example.com" {...field} autoComplete="email" />
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
                    <Input type="password" placeholder="••••••••" {...field} autoComplete="new-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I am a...</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="parent">Parent / Guardian</SelectItem>
                      <SelectItem value="school_representative">School Representative</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem>
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
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <a href="#" className="font-medium text-primary hover:underline">Log In</a> (Log in not implemented)
        </p>
      </div>
       <footer className="w-full text-center py-4 text-muted-foreground text-sm">
         © {new Date().getFullYear()} SkoolBus. All rights reserved.
      </footer>
    </div>
  );
}
