
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
import type { Child, ChildFormData, Parent, School } from '@/types';
import { childFormSchema } from '@/types';
import { Loader2, UploadCloud } from "lucide-react";

interface AddChildFormProps {
  parents: Pick<Parent, 'id' | 'name'>[];
  schools: Pick<School, 'id' | 'name'>[];
  onChildAdded: (child: Child) => void;
}

async function addChildAction(data: ChildFormData): Promise<{ success: boolean; message: string, childId?: string }> {
  console.log("Adding child:", data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (data.name.toLowerCase() === "error") {
    return { success: false, message: "Failed to add child due to a server error." };
  }
  const childId = `c-${Math.random().toString(36).substring(2, 9)}`;
  return { success: true, message: `Umwana ${data.name} yongewemo neza!`, childId };
}

export default function AddChildForm({ parents, schools, onChildAdded }: AddChildFormProps) {
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
      schoolId: "", 
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  async function onSubmit(data: ChildFormData) {
    setIsSubmitting(true);
    try {
      const selectedSchool = schools.find(s => s.id === data.schoolId);
      const result = await addChildAction(data);
      if (result.success && result.childId) {
        toast({
          title: "Byakunze",
          description: `${result.message} (Ishuri: ${selectedSchool?.name || 'N/A'})`,
        });
        const newChildData: Child = {
          ...data,
          age: Number(data.age), 
          id: result.childId,
        };
        onChildAdded(newChildData);
        form.reset();
        setPhotoPreview(null);
        if(fileInputRef.current) {
          fileInputRef.current.value = ""; 
        }
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
              <FormLabel>Amazina y'Umwana Yuzuye</FormLabel>
              <FormControl>
                <Input placeholder="Urugero: Keza Aline" {...field} />
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
              <FormLabel>Imyaka</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Urugero: 8" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
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
              <FormLabel>Ishuri</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Hitamo ishuri" />
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
              <FormLabel>Umwaka/Ishami</FormLabel>
              <FormControl>
                <Input placeholder="Urugero: P3, S2 A" {...field} />
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
              <FormLabel>Ifoto</FormLabel>
              <FormControl>
                <div className="flex flex-col items-center space-y-2">
                  <div 
                    onClick={triggerFileInput} 
                    className="cursor-pointer h-24 w-24 rounded-full bg-muted flex items-center justify-center border hover:bg-muted/80 transition-colors"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') triggerFileInput();}}
                  >
                    {photoPreview ? (
                      <img src={photoPreview} alt="Ifoto y'umwana" className="h-full w-full rounded-full object-cover" data-ai-hint="umwana ifoto" />
                    ) : (
                      <UploadCloud className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoChange} 
                    className="hidden" 
                    ref={fileInputRef}
                    aria-hidden="true"
                  />
                  <Button type="button" variant="link" onClick={triggerFileInput} className="text-sm p-0 h-auto">
                    {photoPreview ? "Hindura ifoto" : "Hitamo ifoto"}
                  </Button>
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
              <FormLabel>Umubyeyi/Umurezi</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Hitamo umubyeyi" />
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
              Birimo Kongerwamo...
            </>
          ) : (
            "Ongeramo Amakuru y'Umwana"
          )}
        </Button>
      </form>
    </Form>
  );
}
