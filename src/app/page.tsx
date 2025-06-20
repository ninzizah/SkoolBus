
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { SignupFormData, ForgotPasswordEmailFormData, ForgotPasswordTokenFormData, ForgotPasswordNewPasswordFormData } from '@/types';
import { signupFormSchema, forgotPasswordEmailSchema, forgotPasswordTokenSchema, forgotPasswordNewPasswordSchema } from '@/types';
import { Loader2, BusFront, Mail, KeyRound, ShieldCheck } from "lucide-react";
import { useRouter } from 'next/navigation';
import Link from "next/link";

async function signupUserAction(data: SignupFormData): Promise<{ success: boolean; message: string }> {
  console.log("[SignupPage] signupUserAction called (diagnostic mode - always success) with data:", data);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  // Always return success for diagnostic purposes
  const roleKinyarwanda = data.role === "parent" ? "Umubyeyi" : data.role === "school_representative" ? "Uhagarariye Ishuri" : "Umushoferi";
  return { success: true, message: `Diagnostic: Konti ya ${data.fullName} yafunguwe neza nka ${roleKinyarwanda}!` };
}

const MOCK_TOKEN = "TOKEN123";

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] = React.useState(false);
  const [forgotPasswordPhase, setForgotPasswordPhase] = React.useState<'email' | 'token' | 'newPassword'>('email');
  const [resetEmail, setResetEmail] = React.useState<string | null>(null);

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: { fullName: "", email: "", password: "", role: undefined },
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

  async function onSignupSubmit(data: SignupFormData) {
    setIsSubmitting(true);
    console.log('[SignupPage] onSignupSubmit started with data:', data);
    try {
      const result = await signupUserAction(data);
      console.log('[SignupPage] signupUserAction result:', result);
      if (result.success) {
        toast({ title: "Kwiyandikisha Byagenze Neza", description: result.message });
        console.log('[SignupPage] Navigating to /dashboard...');
        router.push('/dashboard');
        console.log('[SignupPage] Navigation to /dashboard initiated.');
      } else {
        toast({ title: "Kwiyandikisha Byanze", description: result.message || "Habayeho ikibazo kitazwi.", variant: "destructive" });
      }
    } catch (error) {
      console.error('[SignupPage] Error during signup submission:', error);
      toast({ title: "Ikibazo", description: "Habayeho ikibazo kitateganijwe. Nyamuneka gerageza futhi.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
      console.log('[SignupPage] onSignupSubmit finished.');
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
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    toast({
      title: "Agaciro Koherejwe (Igipimo)",
      description: `Niba ${data.email} ari konti yanditswe, agaciro ko guhindura ijambobanga koherejwe.`,
    });
    setForgotPasswordPhase('token');
  }

  async function onForgotPasswordTokenSubmit(data: ForgotPasswordTokenFormData) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    if (data.token === MOCK_TOKEN) {
      toast({ title: "Agaciro Kemejwe", description: "Nyamuneka shyiramo ijambobanga rishya." });
      setForgotPasswordPhase('newPassword');
    } else {
      forgotPasswordTokenForm.setError("token", { type: "manual", message: "Agaciro katanze ntabwo kemewe cyangwa karashaje." });
      toast({ title: "Kwemeza Agaciro Byanze", description: "Agaciro katanze ntabwo kemewe. Nyamuneka gerageza nanone.", variant: "destructive" });
    }
  }

  async function onForgotPasswordNewPasswordSubmit(data: ForgotPasswordNewPasswordFormData) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    toast({
      title: "Ijambobanga Ryahinduwe Neza",
      description: "Ijambobanga ryawe ryavuguruwe. Ushobora kwinjira ukoresheje ijambobanga rishya.",
    });
    setIsForgotPasswordDialogOpen(false);
  }

  const getDialogTitleKiny = () => {
    if (forgotPasswordPhase === 'email') return "Shakisha Konti Yawe ya SkoolBus";
    if (forgotPasswordPhase === 'token') return "Injiza Agaciro ko Guhindura Ijambobanga";
    return "Shyiramo Ijambobanga Rishya";
  };

  const getDialogDescriptionKiny = () => {
    if (forgotPasswordPhase === 'email') return "Injiza email ifitanye isano na konti yawe kugira ngo uhindure ijambobanga.";
    if (forgotPasswordPhase === 'token') return `Twakohereje agaciro ko guhindura ijambobanga kuri ${resetEmail || 'email yawe'}. Nyamuneka injiza ako gaciro hano. (Aho guca: gerageza "TOKEN123")`;
    return "Agaciro kemejwe. Nyamuneka shyiramo ijambobanga rishya.";
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
              Fungura Konti Yawe ya SkoolBus
            </h1>
            <p className="text-muted-foreground mt-2">
              Injira muri SkoolBus kugira ngo ucunge ingendo z'ishuri mu buryo bwizewe kandi buboneye.
            </p>
          </div>

          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-6 bg-card p-8 rounded-lg shadow-xl">
              <FormField
                control={signupForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amazina Yuzuye</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Urugero: Shema Honore" {...field} autoComplete="name" suppressHydrationWarning={true}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Urugero: you@example.com" {...field} autoComplete="email" suppressHydrationWarning={true}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ijambobanga</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} autoComplete="new-password" suppressHydrationWarning={true}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ndi...</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Hitamo uruhare rwawe" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="parent">Umubyeyi / Umurezi</SelectItem>
                        <SelectItem value="school_representative">Uhagarariye Ishuri</SelectItem>
                        <SelectItem value="driver">Umushoferi</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Birimo Gufungurwa...</>) : ("Fungura Konti")}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-muted-foreground space-y-1">
              <p>
              Usanzwe ufite konti?{' '}
              <Button variant="link" asChild className="p-0 h-auto font-medium text-primary hover:underline">
                  <Link href="/login">Injira</Link>
              </Button>
              </p>
              <p>
              <Button variant="link" onClick={handleOpenForgotPasswordDialog} className="p-0 h-auto font-medium text-primary hover:underline">
                  Wibagiwe ijambobanga?
              </Button>
              </p>
          </div>
        </div>
      </div>

      <Dialog open={isForgotPasswordDialogOpen} onOpenChange={setIsForgotPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
           <DialogHeader className="text-center">
            {getDialogIcon()}
            <DialogTitle className="text-2xl font-bold font-headline">{getDialogTitleKiny()}</DialogTitle>
            <DialogDescription>{getDialogDescriptionKiny()}</DialogDescription>
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
                        <Input type="email" placeholder="Injiza email yawe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={forgotPasswordEmailForm.formState.isSubmitting}>
                  {forgotPasswordEmailForm.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Komeza"}
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
                      <FormLabel>Agaciro</FormLabel>
                      <FormControl>
                        <Input placeholder="Injiza agaciro kavuye muri email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={forgotPasswordTokenForm.formState.isSubmitting}>
                  {forgotPasswordTokenForm.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Emeza Agaciro"}
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
                      <FormLabel>Ijambobanga Rishya</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Injiza ijambobanga rishya" {...field} />
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
                      <FormLabel>Emeza Ijambobanga Rishya</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Emeza ijambobanga rishya" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={forgotPasswordNewPasswordForm.formState.isSubmitting}>
                  {forgotPasswordNewPasswordForm.formState.isSubmitting ? <Loader2 className="animate-spin" /> : "Hindura Ijambobanga"}
                </Button>
              </form>
            </Form>
          )}
           <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Hagarika
                </Button>
              </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
