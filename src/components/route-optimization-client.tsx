
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
// zodResolver is no longer needed as the schema has been removed
// import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getOptimizedRoute } from '@/app/route-optimization/actions';
// routeOptimizationSchema and RouteOptimizationFormData have been removed from @/types
// import type { RouteOptimizationFormData } from '@/types';
// import { routeOptimizationSchema } from '@/types';
import type { SmartRouteOptimizationOutput } from "@/ai/flows/smart-route-optimization";
import { Loader2, Zap, MapPinned, CalendarClock, MessageSquareQuote } from 'lucide-react';

// Local type for form data now that shared type is removed
interface RouteOptimizationFormValues {
  currentRoute: string;
  trafficData: string;
  currentSchedule: string;
}

export default function RouteOptimizationClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<SmartRouteOptimizationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<RouteOptimizationFormValues>({
    // resolver: zodResolver(routeOptimizationSchema), // Resolver removed
    defaultValues: {
      currentRoute: '',
      trafficData: '',
      currentSchedule: '',
    },
  });

  async function onSubmit(data: RouteOptimizationFormValues) {
    setIsLoading(true);
    setOptimizationResult(null);
    // form.clearErrors(); // Not strictly necessary without a resolver

    try {
      const result = await getOptimizedRoute(data); // data is compatible with 'any' in the action
      if (result.success && result.data) {
        // This block is unlikely to be hit as result.data will be undefined from the modified action
        setOptimizationResult(result.data);
        toast({
          title: 'Optimization Successful',
          description: 'AI has generated route suggestions.',
        });
      } else {
        // Field errors from the action are not expected anymore
        toast({
          title: 'Optimization Status',
          description: result.error || 'The Smart Route Optimization feature is currently disabled.',
          variant: result.success ? 'default' : 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while submitting the form.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Route Optimization Input</CardTitle>
          <CardDescription>
            Provide details about the current route, traffic conditions, and schedule for AI analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="currentRoute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Route Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Starts at Main St depot, proceeds via Elm St, Oak Ave, to Northwood High. Returns via Pine St."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trafficData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Real-Time Traffic Data / Observations</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Heavy congestion on Elm St due to construction. Accident reported on Oak Ave. Pine St clear."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentSchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Bus Schedule</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Depart Depot: 7:00 AM, Stop 1 (Elm St): 7:15 AM, Stop 2 (Oak Ave): 7:30 AM, Arrive School: 7:50 AM."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing... 
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" /> Get Route Suggestion
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* This section will likely not render as optimizationResult will remain null */}
      {optimizationResult && (
        <Card className="shadow-xl animate-fadeIn">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">AI Optimization Suggestions</CardTitle>
            <CardDescription>
              Review the AI-generated recommendations for your route.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-2"><MapPinned className="mr-2 h-5 w-5 text-accent" />Optimized Route</h3>
              <p className="text-foreground/90 bg-muted p-3 rounded-md whitespace-pre-wrap">{optimizationResult.optimizedRoute}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-2"><CalendarClock className="mr-2 h-5 w-5 text-accent" />Schedule Adjustments</h3>
              <p className="text-foreground/90 bg-muted p-3 rounded-md whitespace-pre-wrap">{optimizationResult.scheduleAdjustments}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-2"><MessageSquareQuote className="mr-2 h-5 w-5 text-accent" />Delay Explanation & Benefits</h3>
              <p className="text-foreground/90 bg-muted p-3 rounded-md whitespace-pre-wrap">{optimizationResult.delayExplanation}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
