
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
import Link from "next/link";

// Mock server action for signing up a user
async function signupUserAction(data: SignupFormData): Promise<{ success: boolean; message: string }> {
  console.log("Signing up user:", data);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Simulate success/failure
  if (data.email.toLowerCase().includes("error@example.com")) {
    return { success: false, message: "Iyi email isanzwe ikoreshwa cyangwa ntiyemewe." };
  }
  const roleKinyarwanda = data.role === "parent" ? "Umubyeyi" : data.role === "school_representative" ? "Uhagarariye Ishuri" : "Umushoferi";
  return { success: true, message: `Konti ya ${data.fullName} yafunguwe neza nka ${roleKinyarwanda}!` };
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
          title: "Kwiyandikisha Byagenze Neza",
          description: result.message,
        });
        router.push('/dashboard');
      } else {
        toast({
          title: "Kwiyandikisha Byanze",
          description: result.message || "Habayeho ikibazo kitazwi.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ikibazo",
        description: "Habayeho ikibazo kitateganijwe. Nyamuneka gerageza futhi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleForgotPasswordClick = () => {
    const firstEmail = window.prompt("Nyamuneka shyiramo email yawe yo guhindura ijambobanga:");

    if (firstEmail === null) {
      toast({ title: "Guhindura Ijambobanga Byahagaritswe", description: "Gusaba guhindura ijambobanga byahagaritswe." });
      return;
    }
    if (firstEmail.trim() === "") {
      toast({ title: "Guhindura Ijambobanga Byanze", description: "Email ntishobora kuba ubusa.", variant: "destructive" });
      return;
    }

    const secondEmail = window.prompt("Nyamuneka ongera ushyiremo email yawe kugira ngo wemeze:");

    if (secondEmail === null) {
      toast({ title: "Guhindura Ijambobanga Byahagaritswe", description: "Igikorwa cyo kwemeza email cyahagaritswe." });
      return;
    }
    if (secondEmail.trim() === "") {
      toast({ title: "Guhindura Ijambobanga Byanze", description: "Email yo kwemeza ntishobora kuba ubusa.", variant: "destructive" });
      return;
    }

    if (firstEmail.trim().toLowerCase() === secondEmail.trim().toLowerCase()) {
      toast({
        title: "Email Yemejwe",
        description: `Niba iyi email (${firstEmail.trim()}) yanditswe, agaciro ko guhindura ijambobanga (token) karaza koherezwa.`,
      });

      // Simulate sending email and token process
      const MOCK_TOKEN = "TOKEN123"; // In a real app, this would be generated and sent via email.

      const enteredToken = window.prompt("Agaciro ko guhindura ijambobanga (token) (mu bitekerezo) koherejwe kuri email yawe. Nyamuneka shyiramo ako gaciro hano:");

      if (enteredToken === null) {
        toast({ title: "Guhindura Ijambobanga Byahagaritswe", description: "Kwinjiza agaciro byahagaritswe.", variant: "destructive" });
        return;
      }
      if (enteredToken.trim() === "") {
        toast({ title: "Guhindura Ijambobanga Byanze", description: "Agaciro ntigashobora kuba ubusa.", variant: "destructive" });
        return;
      }

      if (enteredToken.trim() === MOCK_TOKEN) {
        const newPassword = window.prompt("Agaciro kemejwe. Nyamuneka shyiramo ijambobanga rishya:");
        if (newPassword === null) {
          toast({ title: "Guhindura Ijambobanga Byahagaritswe", description: "Kwinjiza ijambobanga rishya byahagaritswe.", variant: "destructive" });
          return;
        }
        if (newPassword.trim() === "" || newPassword.trim().length < 8) {
          toast({ title: "Guhindura Ijambobanga Byanze", description: "Ijambobanga rishya ntirishobora kuba ubusa kandi rigomba kuba nibura inyuguti 8.", variant: "destructive" });
          return;
        }

        const confirmNewPassword = window.prompt("Nyamuneka ongera wemeze ijambobanga rishya:");
        if (confirmNewPassword === null) {
          toast({ title: "Guhindura Ijambobanga Byahagaritswe", description: "Kwemeza ijambobanga byahagaritswe.", variant: "destructive" });
          return;
        }

        if (newPassword.trim() === confirmNewPassword.trim()) {
          // In a real app, an API call would be made here to update the password
          toast({
            title: "Ijambobanga Ryahinduwe Neza",
            description: "Ijambobanga ryawe ryavuguruwe. Ushobora kwinjira ukoresheje ijambobanga rishya.",
          });
        } else {
          toast({
            title: "Guhindura Ijambobanga Byanze",
            description: "Amajambobanga mashya ntabwo ahuye. Nyamuneka gerageza inzira yo 'Kwibagirwa ijambobanga' nanone.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Guhindura Ijambobanga Byanze",
          description: "Agaciro ko guhindura ijambobanga ntabwo kemewe. Nyamuneka gerageza inzira yo 'Kwibagirwa ijambobanga' nanone.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Guhindura Ijambobanga Byanze",
        description: "Ama email watanze ntabwo ahuye. Nyamuneka gerageza nanone.",
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
            Fungura Konti Yawe ya SkoolBus
          </h1>
          <p className="text-muted-foreground mt-2">
            Injira muri SkoolBus kugira ngo ucunge ingendo z'ishuri mu buryo bwizewe kandi buboneye.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-8 rounded-lg shadow-xl">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amazina Yuzuye</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Urugero: Shema Honore"
                      {...field}
                      autoComplete="name"
                      suppressHydrationWarning={true}
                    />
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
                    <Input
                      type="email"
                      placeholder="Urugero: you@example.com"
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
                  <FormLabel>Ijambobanga</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      autoComplete="new-password"
                      suppressHydrationWarning={true}
                    />
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
                  <FormLabel>Ndi...</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Hitamo uruhare rwawe" />
                      </SelectTrigger>
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
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Birimo Gufungurwa...
                </>
              ) : (
                "Fungura Konti"
              )}
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
            <Button variant="link" onClick={handleForgotPasswordClick} className="p-0 h-auto font-medium text-primary hover:underline">
                Wibagiwe ijambobanga?
            </Button>
            </p>
        </div>
      </div>
    </div>
  );
}
