
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { LoginFormData, ForgotPasswordEmailFormData, ForgotPasswordTokenFormData, ForgotPasswordNewPasswordFormData } from '@/types';
import { loginFormSchema, forgotPasswordEmailSchema, forgotPasswordTokenSchema, forgotPasswordNewPasswordSchema } from '@/types';
import { Loader2, BusFront, LogIn, Mail, KeyRound, ShieldCheck } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

async function loginUserAction(data: LoginFormData): Promise<{ success: boolean; message: string }> {
  console.log("Logging in user:", data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (data.email.toLowerCase().includes("error@example.com")) {
    return { success: false, message: "Invalid email or password." };
  }
  return { success: true, message: `Welcome back!` };
}

const MOCK_TOKEN = "TOKEN123";

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] = React.useState(false);
  const [forgotPasswordPhase, setForgotPasswordPhase] = React.useState<'email' | 'token' | 'newPassword'>('email');
  const [resetEmail, setResetEmail] = React.useState<string | null>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const forgotPasswordEmailForm = useForm<ForgotPasswordEmailFormData>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: { email: "" },
  });

  const forgotPasswordTokenForm = useForm<ForgotPasswordTokenFormData>({
    resolver: zodResolver(forgotPasswordTokenSchema),
    defaultValues: { token: "" },
  });

  const forgotPasswordNewPasswordForm = useForm<ForgotPasswordNewPasswordFormData>({
    resolver: zodResolver(forgotPasswordNewPasswordSchema),
    defaultValues: { newPassword: "", confirmNewPassword: "" },
  });


  async function onLoginSubmit(data: LoginFormData) {
    setIsSubmitting(true);
    try {
      const result = await loginUserAction(data);
      if (result.success) {
        toast({ title: "Login Successful", description: result.message });
        router.push('/dashboard');
      } else {
        toast({ title: "Login Failed", description: result.message || "An unknown error occurred.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleOpenForgotPasswordDialog = () => {
    setForgotPasswordPhase('email');
    forgotPasswordEmailForm.reset();
    forgotPasswordTokenForm.reset();
    forgotPasswordNewPasswordForm.reset();
    setResetEmail(null);
    setIsForgotPasswordDialogOpen(true);
  };

  async function onForgotPasswordEmailSubmit(data: ForgotPasswordEmailFormData) {
    setResetEmail(data.email);
    // Simulate sending token
    await new Promise(resolve => setTimeout(resolve, 500));
    toast({
      title: "Token Sent (Simulated)",
      description: `If ${data.email} is a registered account, a password reset token has been sent.`,
    });
    setForgotPasswordPhase('token');
  }

  async function onForgotPasswordTokenSubmit(data: ForgotPasswordTokenFormData) {
    // Simulate token verification
    await new Promise(resolve => setTimeout(resolve, 500));
    if (data.token === MOCK_TOKEN) {
      toast({ title: "Token Verified", description: "Please set your new password." });
      setForgotPasswordPhase('newPassword');
    } else {
      forgotPasswordTokenForm.setError("token", { type: "manual", message: "Invalid or expired token." });
      toast({ title: "Token Verification Failed", description: "The token entered is invalid. Please try again.", variant: "destructive" });
    }
  }

  async function onForgotPasswordNewPasswordSubmit(data: ForgotPasswordNewPasswordFormData) {
    // Simulate password update
    await new Promise(resolve => setTimeout(resolve, 500));
    toast({
      title: "Password Reset Successful",
      description: "Your password has been updated. You can now log in with your new password.",
    });
    setIsForgotPasswordDialogOpen(false);
  }
  
  const getDialogTitle = () => {
    if (forgotPasswordPhase === 'email') return "Find your SkoolBus Account";
    if (forgotPasswordPhase === 'token') return "Enter Password Reset Token";
    return "Set New Password";
  };

  const getDialogDescription = () => {
    if (forgotPasswordPhase === 'email') return "Enter the email associated with your account to change your password.";
    if (forgotPasswordPhase === 'token') return `A password reset token was (notionally) sent to ${resetEmail || 'your email'}. Please enter it here. (Hint: try "TOKEN123")`;
    return "Token verified. Please set your new password.";
  };

  const getDialogIcon = () => {
    if (forgotPasswordPhase === 'email') return <Mail className="mx-auto h-10 w-10 text-primary mb-3" />;
    if (forgotPasswordPhase === 'token') return <KeyRound className="mx-auto h-10 w-10 text-primary mb-3" />;
    return <ShieldCheck className="mx-auto h-10 w-10 text-primary mb-3" />;
  };


  return (
    <>
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

          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6 bg-card p-8 rounded-lg shadow-xl">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="e.g., you@example.com" {...field} autoComplete="email" suppressHydrationWarning={true}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} autoComplete="current-password" suppressHydrationWarning={true}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging In...</>) : (<><LogIn className="mr-2 h-4 w-4" /> Log In</>)}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>
                <Button variant="link" onClick={handleOpenForgotPasswordDialog} className="p-0 h-auto font-medium text-primary hover:underline">
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

      <Dialog open={isForgotPasswordDialogOpen} onOpenChange={setIsForgotPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            {getDialogIcon()}
            <DialogTitle className="text-2xl font-bold font-headline">{getDialogTitle()}</DialogTitle>
            <DialogDescription>{getDialogDescription()}</DialogDescription>
          </DialogHeader>
          
          {forgotPasswordPhase === 'email' && (
            <Form {...forgotPasswordEmailForm}>
              <form onSubmit={forgotPasswordEmailForm.handleSubmit(onForgotPasswordEmailSubmit)} className="space-y-4 py-4">
                <FormField
                  control={forgotPasswordEmailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={forgotPasswordEmailForm.formState.isSubmitting}>
                  {forgotPasswordEmailForm.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Next"}
                </Button>
              </form>
            </Form>
          )}

          {forgotPasswordPhase === 'token' && (
            <Form {...forgotPasswordTokenForm}>
              <form onSubmit={forgotPasswordTokenForm.handleSubmit(onForgotPasswordTokenSubmit)} className="space-y-4 py-4">
                <FormField
                  control={forgotPasswordTokenForm.control}
                  name="token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter token from email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={forgotPasswordTokenForm.formState.isSubmitting}>
                  {forgotPasswordTokenForm.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Verify Token"}
                </Button>
              </form>
            </Form>
          )}

          {forgotPasswordPhase === 'newPassword' && (
            <Form {...forgotPasswordNewPasswordForm}>
              <form onSubmit={forgotPasswordNewPasswordForm.handleSubmit(onForgotPasswordNewPasswordSubmit)} className="space-y-4 py-4">
                <FormField
                  control={forgotPasswordNewPasswordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={forgotPasswordNewPasswordForm.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={forgotPasswordNewPasswordForm.formState.isSubmitting}>
                 {forgotPasswordNewPasswordForm.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Change Password"}
                </Button>
              </form>
            </Form>
          )}
          <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
