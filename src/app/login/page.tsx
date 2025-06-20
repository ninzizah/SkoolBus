
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
import { useToast } from "@/hooks/use-toast";
import type { LoginFormData } from '@/types';
import { loginFormSchema } from '@/types';
import { Loader2, BusFront, LogIn } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock server action for logging in a user
async function loginUserAction(data: LoginFormData): Promise<{ success: boolean; message: string }> {
  console.log("Logging in user:", data);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Simulate success/failure
  if (data.email.toLowerCase().includes("error@example.com")) {
    return { success: false, message: "Invalid email or password." };
  }
  return { success: true, message: `Welcome back!` };
}

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsSubmitting(true);
    try {
      const result = await loginUserAction(data);
      if (result.success) {
        toast({
          title: "Login Successful",
          description: result.message,
        });
        // In a real app, you'd likely set some auth state here
        router.push('/dashboard');
      } else {
        toast({
          title: "Login Failed",
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

  const handleForgotPasswordClick = () => {
    const firstEmail = window.prompt("Please enter your email address to reset your password:");

    if (firstEmail === null) {
      toast({ title: "Password Reset Cancelled", description: "Password reset request was cancelled." });
      return;
    }
    if (firstEmail.trim() === "") {
      toast({ title: "Password Reset Failed", description: "Email address cannot be empty.", variant: "destructive" });
      return;
    }

    const secondEmail = window.prompt("Please re-enter your email address for confirmation:");

    if (secondEmail === null) {
      toast({ title: "Password Reset Cancelled", description: "Email confirmation process was cancelled." });
      return;
    }
    if (secondEmail.trim() === "") {
      toast({ title: "Password Reset Failed", description: "Confirmation email cannot be empty.", variant: "destructive" });
      return;
    }

    if (firstEmail.trim().toLowerCase() === secondEmail.trim().toLowerCase()) {
      toast({
        title: "Email Confirmed",
        description: `If this email address (${firstEmail.trim()}) is registered, a password reset token will be sent.`,
      });

      // Simulate sending email and token process
      const MOCK_TOKEN = "TOKEN123"; // In a real app, this would be generated and sent via email.

      const enteredToken = window.prompt("A password reset token has been (notionally) sent to your email. Please enter the token here:");

      if (enteredToken === null) {
        toast({ title: "Password Reset Cancelled", description: "Token entry was cancelled.", variant: "destructive" });
        return;
      }
      if (enteredToken.trim() === "") {
        toast({ title: "Password Reset Failed", description: "Token cannot be empty.", variant: "destructive" });
        return;
      }

      if (enteredToken.trim() === MOCK_TOKEN) {
        const newPassword = window.prompt("Token verified. Please enter your new password:");
        if (newPassword === null) {
          toast({ title: "Password Reset Cancelled", description: "New password entry was cancelled.", variant: "destructive" });
          return;
        }
        if (newPassword.trim() === "" || newPassword.trim().length < 8) {
          toast({ title: "Password Reset Failed", description: "New password cannot be empty and must be at least 8 characters.", variant: "destructive" });
          return;
        }

        const confirmNewPassword = window.prompt("Please confirm your new password:");
        if (confirmNewPassword === null) {
          toast({ title: "Password Reset Cancelled", description: "Password confirmation was cancelled.", variant: "destructive" });
          return;
        }

        if (newPassword.trim() === confirmNewPassword.trim()) {
          // In a real app, an API call would be made here to update the password
          toast({
            title: "Password Reset Successful",
            description: "Your password has been updated. You can now log in with your new password.",
          });
        } else {
          toast({
            title: "Password Reset Failed",
            description: "The new passwords do not match. Please try the 'Forgot Password' process again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Password Reset Failed",
          description: "Invalid reset token. Please try the 'Forgot Password' process again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Password Reset Failed",
        description: "The email addresses entered do not match. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <div className="w-full max-w-md space-y-8 py-12">
        <div className="text-center">
          <BusFront className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-3xl font-bold font-headline text-primary">
            Log In to SkoolBus
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Please enter your credentials.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-8 rounded-lg shadow-xl">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g., you@example.com"
                      {...field}
                      autoComplete="email"
                      suppressHydrationWarning={true}
                    />
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
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      autoComplete="current-password"
                      suppressHydrationWarning={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging In...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Log In
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>
            <Button variant="link" onClick={handleForgotPasswordClick} className="p-0 h-auto font-medium text-primary hover:underline">
                Forgot Password?
            </Button>
            </p>
            <p>
            Don&apos;t have an account?{' '}
            <Button variant="link" asChild className="p-0 h-auto font-medium text-primary hover:underline">
                <Link href="/">Create Account</Link>
            </Button>
            </p>
        </div>
      </div>
    </div>
  );
}
