
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getOptimizedRoute } from '@/app/route-optimization/actions';
import type { SmartRouteOptimizationOutput } from "@/ai/flows/smart-route-optimization";
import { Loader2, Zap, MapPinned, CalendarClock, MessageSquareQuote } from 'lucide-react';

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
    defaultValues: {
      currentRoute: '',
      trafficData: '',
      currentSchedule: '',
    },
  });

  async function onSubmit(data: RouteOptimizationFormValues) {
    setIsLoading(true);
    setOptimizationResult(null);

    try {
      const result = await getOptimizedRoute(data); 
      if (result.success && result.data) {
        setOptimizationResult(result.data);
        toast({
          title: 'Kunoza Byagenze Neza',
          description: 'AI yatanze ibyifuzo by\'urugendo.',
        });
      } else {
        toast({
          title: 'Uko Kunoza Bihagaze',
          description: result.error || 'Serivisi yo kunoza ingendo ikoresheje AI ntabwo ikora muri iki gihe.',
          variant: result.success ? 'default' : 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ikibazo',
        description: 'Habayeho ikibazo kitateganijwe mu kohereza fomu.',
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
          <CardTitle className="font-headline text-2xl">Amakuru yo Kunoza Urugendo</CardTitle>
          <CardDescription>
            Tanga amakuru arambuye ku rugendo rusanzwe, uko imihanda ihagaze, na gahunda kugira ngo AI ibisesengure.
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
                    <FormLabel>Ubusobanuro bw'Urugendo Rusanzwe</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Urugero: Itangirira ku cyicaro cya Gikondo, ikanyura kuri KG 123 St, KK 456 Ave, kugera kuri Lycee de Kigali. Isubira inyuma inyuze kuri KN 789 St."
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
                    <FormLabel>Amakuru y'Imihanda Ako Kanya / Ibyagaragaye</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Urugero: Umuhanda wa KG 123 St urimo abantu benshi kubera imirimo. Impanuka yamenyekanye kuri KK 456 Ave. KN 789 St irakora neza."
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
                    <FormLabel>Gahunda y'Imodoka Isanzwe</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Urugero: Guhaguruka ku Cyicaro: 7:00 AM, Guhagarara 1 (KG 123 St): 7:15 AM, Guhagarara 2 (KK 456 Ave): 7:30 AM, Kugera ku Ishuri: 7:50 AM."
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
                    Birimo Gutunganywa... 
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" /> Bona Icyifuzo cy'Urugendo
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {optimizationResult && (
        <Card className="shadow-xl animate-fadeIn">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Ibyifuzo bya AI byo Kunoza</CardTitle>
            <CardDescription>
              Reba ibyifuzo byatanzwe na AI ku rugendo rwawe.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-2"><MapPinned className="mr-2 h-5 w-5 text-accent" />Urugendo Runoze</h3>
              <p className="text-foreground/90 bg-muted p-3 rounded-md whitespace-pre-wrap">{optimizationResult.optimizedRoute}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-2"><CalendarClock className="mr-2 h-5 w-5 text-accent" />Impinduka kuri Gahunda</h3>
              <p className="text-foreground/90 bg-muted p-3 rounded-md whitespace-pre-wrap">{optimizationResult.scheduleAdjustments}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-2"><MessageSquareQuote className="mr-2 h-5 w-5 text-accent" />Ubusobanuro bw'Igihe Cyatakaye & Akamaro</h3>
              <p className="text-foreground/90 bg-muted p-3 rounded-md whitespace-pre-wrap">{optimizationResult.delayExplanation}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
